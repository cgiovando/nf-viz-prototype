// Render a URL to a full-height PNG via headless Chrome (CDP, no deps).
// Usage: node html_to_png.mjs <url> <out.png> [widthPx]
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [url, out, widthArg] = process.argv.slice(2);
const width = parseInt(widthArg || "1280", 10);
const port = 9333 + Math.floor(Math.random() * 200);

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--window-size=${width},900`,
  "--force-device-scale-factor=2",
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cdp(ws, id, method, params = {}) {
  return new Promise((resolve) => {
    const onMsg = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        ws.off("message", onMsg);
        resolve(msg.result);
      }
    };
    ws.on("message", onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

try {
  // Wait for the debugging endpoint.
  let target = null;
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
      target = await r.json();
      if (target.webSocketDebuggerUrl) break;
    } catch {}
    await sleep(250);
  }
  if (!target?.webSocketDebuggerUrl) throw new Error("no CDP target");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  // Node's global WebSocket uses addEventListener; shim .on/.off/.send compatibility.
  ws.on = (ev, fn) => ws.addEventListener(ev, (e) => fn(e.data));
  ws.off = (ev, fn) => ws.removeEventListener(ev, fn);

  let id = 1;
  await cdp(ws, id++, "Page.enable");
  await cdp(ws, id++, "Runtime.enable");
  await cdp(ws, id++, "Emulation.setDeviceMetricsOverride", {
    width, height: 900, deviceScaleFactor: 2, mobile: false,
  });
  await sleep(2500); // let Observable Plot / fonts / d3 render
  const evalRes = await cdp(ws, id++, "Runtime.evaluate", {
    expression:
      "Math.ceil(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.querySelector('.viz-page')?.getBoundingClientRect().bottom||0))",
    returnByValue: true,
  });
  const height = (evalRes?.result?.value || 900) + 8;
  const shot = await cdp(ws, id++, "Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  writeFileSync(out, Buffer.from(shot.data, "base64"));
  console.log(`wrote ${out} (${width}x${height})`);
  ws.close();
} finally {
  chrome.kill();
}
