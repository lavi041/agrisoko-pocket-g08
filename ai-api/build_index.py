"""Validate members.json, build the index, write fingerprint + metadata.

Usage:  python build_index.py [--export-mobile ../mobile/src/data/members.bundle.json]
"""
import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from app.engine import (DEFAULT_THRESHOLD, MODEL_VERSION, Engine, file_fingerprint,
                        load_members, make_introduction, placeholder_warnings)

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "members.json"


def git_commit() -> str:
    try:
        return subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT,
                                       stderr=subprocess.DEVNULL, text=True).strip()
    except Exception:
        return "unknown"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--export-mobile", help="write bundled directory for the mobile app")
    ap.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD)
    args = ap.parse_args()
    members = load_members(DATA)
    engine = Engine(members, args.threshold)
    for w in placeholder_warnings(members):
        print("WARNING:", w)
    meta = {"model_version": MODEL_VERSION, "threshold": args.threshold,
            "dataset_fingerprint_sha256": file_fingerprint(DATA), "member_count": len(members),
            "vocabulary_word": len(engine.word.vocabulary_), "vocabulary_char": len(engine.char.vocabulary_),
            "build_commit": git_commit(), "built_at": datetime.now(timezone.utc).isoformat()}
    (ROOT / "data" / "model_meta.json").write_text(json.dumps(meta, indent=2))
    print(json.dumps(meta, indent=2))
    if args.export_mobile:
        bundle = [{**m, "introduction": make_introduction(m)} for m in members]
        out = Path(args.export_mobile)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(bundle, indent=2, ensure_ascii=False), encoding="utf-8")
        print("Exported mobile bundle ->", out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
