#!/usr/bin/env python3
"""
Lint the public-facing HTML in this viz repo for dev shorthand and
factual/citation drift that should never reach the viewer.

Catches things like:
- Internal data file/sheet names leaking into footers
- Wrong report year (2025 instead of 2026)
- Internal slot names ("Quadrant" capitalized in tooltips, etc.)
- Internal scaffolding labels ("HERO", "Concept intro", etc.)

Run from anywhere:
    python3 scripts/lint_viewer_facing.py

Exit 1 if any issues found.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# (pattern, why) tuples. Pattern is a compiled regex; matched in viewer-facing
# text only (skip script/style blocks and HTML comments).
RULES = [
    (re.compile(r"\bWorld Bank\s*,?\s*2025\b"),
     "report year is 2026, not 2025"),
    (re.compile(r"Nourish_and_Flourish_Dash_Data\.xlsx", re.I),
     "internal data filename leaked"),
    (re.compile(r"\bVW_Data\b"),
     "internal sheet name leaked (use plain 'virtual water trade data')"),
    (re.compile(r"\bcountries_2x2\.json\b"),
     "internal data path leaked"),
    (re.compile(r"<dt>\s*Quadrant\s*</dt>", re.I),
     "tooltip label should be 'Context' (per report nomenclature)"),
    (re.compile(r"\bHERO\b"),
     "internal scaffolding term"),
    (re.compile(r"Concept intro|Headline stats|Format note|Three shifts intro"),
     "internal scaffolding shorthand"),
    (re.compile(r"draft for editorial review", re.I),
     "WIP marker"),
    (re.compile(r"placehold\.co", re.I),
     "placeholder image leaked"),
    # Em/en dashes are forbidden (global preference).
    (re.compile(r"[–—]"),
     "em or en dash found - use plain hyphen-minus"),
]

SCRIPT_OR_STYLE = re.compile(
    r"<(script|style)\b[^>]*>.*?</\1\s*>", re.I | re.S
)
HTML_COMMENT = re.compile(r"<!--.*?-->", re.S)


def viewer_text(html: str) -> str:
    """Strip <script>, <style>, and HTML comments so we lint only viewer text."""
    html = SCRIPT_OR_STYLE.sub(" ", html)
    html = HTML_COMMENT.sub(" ", html)
    return html


def lint_file(path: Path) -> list[str]:
    text = viewer_text(path.read_text(encoding="utf-8"))
    issues: list[str] = []
    for pattern, why in RULES:
        for m in pattern.finditer(text):
            snippet = text[max(0, m.start() - 30): m.end() + 30].replace("\n", " ")
            issues.append(
                f"{path.relative_to(REPO_ROOT)}:{m.start()}  {why}\n"
                f"    ...{snippet}..."
            )
    return issues


def main() -> int:
    targets = list((REPO_ROOT / "viz").glob("*.html"))
    targets.append(REPO_ROOT / "index.html")
    targets = [p for p in targets if p.exists()]
    if not targets:
        print("no HTML files found", file=sys.stderr)
        return 1

    all_issues: list[str] = []
    for p in sorted(targets):
        all_issues.extend(lint_file(p))

    if all_issues:
        print("VIEWER-FACING LINT FAILED:")
        for x in all_issues:
            print(" -", x)
        print(f"\n{len(all_issues)} issue(s) across {len(targets)} file(s)")
        return 1

    print(f"viewer-facing lint: clean ({len(targets)} file(s) checked)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
