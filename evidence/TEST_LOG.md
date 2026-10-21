# TEST LOG, Group G08 (AgriSoko Pocket G08)
Only results that were actually run are marked PASS. Items marked TODO are not done yet.

## 1. API automated tests (pytest, ai-api/tests/test_api.py)
- Command: `python -m pytest -q`  | Result: **22 passed** (run on 20 Oct 2026, Python 3.14, commit b898468 + team data)
- Covers: health, safe member directory, member detail and 404, exact name, alias, role, feature queries for all 5 members, 5 no-match queries, ambiguous single word, missing question (422), empty and too-long question (422), response schema, no invented links or metrics, model-info, empty dataset (engine error and API 503), missing required key, empty optional field.

## 2. AI query evaluation (ai-api/eval/EVAL_REPORT.md, threshold 0.45)
- Top-1 member accuracy: **15/15 = 100%** (3 queries per member: name/alias, role, feature)
- No-match rejection accuracy: **6/6 = 100%** (capital of France, pizza recipe, random letters, hello, football, the lecturer)
- Lowest correct confidence 0.68; highest no-match confidence 0.05. Threshold 0.45 kept.
- Limitation: the evaluation set was written by the group on the same vocabulary as the profiles, so 100% is optimistic.

## 3. Mobile project checks
- `npx expo-doctor`: 20/20 checks passed. `npm run typecheck` (tsc): no errors.

## 4. Deployed API (Render, Free plan) https://agrisoko-pocket-g08.onrender.com
- GET /health returned status ok, group_code G08: PASS
- Note: the Free instance sleeps; the first request can take about 50 seconds.

## 5. Release APK (EAS preview build 91812c4f, SDK 57, version 1.0.0, 74 MB), tested without Expo Go
| # | Check | Result |
|---|---|---|
| 1 | Home shows name, G08, online status, version | PASS |
| 2 | Ask "Tell me about Aisha": result, confidence, reason, introduction, live label | PASS |
| 3 | Ask "best pizza recipe": no confident match and suggestions | PASS |
| 4 | Directory then Profile | PASS |
| 5 | About: API reachable, fingerprint, G08 | PASS |
| 6 | Network off, "Tell me about Aisha": Offline match label | PASS |
Screenshots: evidence/screenshots/ (01_home ... 08_offline).

## 6. Device matrix (at least 2 devices or configurations required)
| Device | Android version | Screen / font size | APK installed | Online | Offline | Tester |
|---|---|---|---|---|---|---|
| TODO: phone 1 model | TODO | TODO | yes | PASS | PASS | Aisha |
| TODO: phone 2 model | TODO | TODO | TODO | TODO | TODO | TODO |

## 7. Still to do (not yet tested)
- Retry after server stop, timeout state, large-text behaviour, link-open failure case.
- Second device. Four external testers (see FEEDBACK). At least two reproducible bugs, each with issue and fix commit.

## 8. Fixed issues (at least 2 required, each linked to an issue and a commit)
| Issue | How reproduced | Fix | Commit |
|---|---|---|---|
| TODO | TODO | TODO | TODO |
