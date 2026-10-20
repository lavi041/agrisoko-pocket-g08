"""Evaluate the matcher on recorded queries. Writes eval/EVAL_REPORT.md."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.engine import DEFAULT_THRESHOLD, Engine, load_members  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
thr = float(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_THRESHOLD
engine = Engine(load_members(ROOT / "data" / "members.json"), thr)
queries = json.loads((ROOT / "eval" / "queries.json").read_text())

rows, pos_ok, pos_n, neg_ok, neg_n = [], 0, 0, 0, 0
for q in queries:
    r = engine.search(q["query"])
    got = r["member"]["id"] if r["matched"] else None
    ok = got == q["expected"]
    if q["expected"]:
        pos_n += 1; pos_ok += ok
    else:
        neg_n += 1; neg_ok += ok
    rows.append((q["query"], q["expected"] or "NO-MATCH", got or "NO-MATCH", r["confidence"], "PASS" if ok else "FAIL"))

lines = [f"# AI evaluation (threshold {thr})", "",
         f"- Top-1 member accuracy: {pos_ok}/{pos_n} = {pos_ok / max(pos_n, 1):.1%}",
         f"- No-match rejection accuracy: {neg_ok}/{neg_n} = {neg_ok / max(neg_n, 1):.1%}", "",
         "| Query | Expected | Returned | Confidence | Result |", "|---|---|---|---|---|"]
lines += [f"| {a} | {b} | {c} | {d:.2f} | {e} |" for a, b, c, d, e in rows]
fails = [r for r in rows if r[4] == "FAIL"]
lines += ["", "## Error table", ""] + ([f"- `{r[0]}` expected {r[1]}, got {r[2]} ({r[3]:.2f})" for r in fails] or ["- No errors."])
(ROOT / "eval" / "EVAL_REPORT.md").write_text("\n".join(lines), encoding="utf-8")
print("\n".join(lines))
