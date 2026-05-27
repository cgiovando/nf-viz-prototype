// Check viz HTML files for horizontal overflow at multiple embed widths.
// Usage: node overflow_check.mjs <file.html> [width1,width2,...]
// Loads each at ?embed=storymap and reports scrollWidth vs clientWidth.
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [fileArg, widthsArg] = process.argv.slice(2);
const widths = (widthsArg || "480,520,650,1024,1470,2000")
  .split(",").map((w) => parseInt(w, 10));
// Support an optional ?query in the file arg (e.g. viz/x.html?stage=2)
const qIdx = fileArg.indexOf("?");
const filePath = qIdx >= 0 ? fileArg.slice(0, qIdx) : fileArg;
const extraQuery = qIdx >= 0 ? fileArg.slice(qIdx + 1) + "&" : "";
const fileUrl = "file://" + resolve(filePath) + "?" + extraQuery + "embed=storymap";
const port = 9555 + Math.floor(Math.random() * 200);

const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${port}`, "about:blank",
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cdp(ws, id, method, params = {}) {
  return new Promise((resolve) => {
    const onMsg = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) { ws.off("message", onMsg); resolve(msg.result); }
    };
    ws.on("message", onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

try {
  let target = null;
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(fileUrl)}`, { method: "PUT" });
      target = await r.json();
      if (target.webSocketDebuggerUrl) break;
    } catch {}
    await sleep(250);
  }
  if (!target?.webSocketDebuggerUrl) throw new Error("no CDP target");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.on = (ev, fn) => ws.addEventListener(ev, (e) => fn(e.data));
  ws.off = (ev, fn) => ws.removeEventListener(ev, fn);

  let id = 1;
  await cdp(ws, id++, "Page.enable");
  await cdp(ws, id++, "Runtime.enable");

  let anyOverflow = false;
  for (const w of widths) {
    await cdp(ws, id++, "Emulation.setDeviceMetricsOverride", {
      width: w, height: 800, deviceScaleFactor: 1, mobile: false,
    });
    // reload to trigger resize-based re-render
    await cdp(ws, id++, "Page.navigate", { url: fileUrl });
    await sleep(2200);
    const r = await cdp(ws, id++, "Runtime.evaluate", {
      expression:
        "(() => { const d=document.documentElement; const ov = d.scrollWidth - d.clientWidth; return JSON.stringify({sw:d.scrollWidth, cw:d.clientWidth, ov}); })()",
      returnByValue: true,
    });
    const { sw, cw, ov } = JSON.parse(r.result.value);
    const flag = ov > 1 ? "  <-- OVERFLOW" : "";
    if (ov > 1) anyOverflow = true;
    console.log(`  ${String(w).padStart(5)}px : scrollWidth=${sw} clientWidth=${cw} overflow=${ov}px${flag}`);
  }
  ws.close();
  process.exitCode = anyOverflow ? 2 : 0;
} finally {
  chrome.kill();
}
