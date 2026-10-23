# AgriSoko Pocket G08

> Fill every `REPLACE` and `TODO` with real group data before submitting.

**Group code:** G08  |  **Course:** Integrated Mobile and Artificial Intelligence, Group Assignment 3 (INES Ruhengeri)

## Members and roles
| # | Name | Reg. no. | GitHub | Primary role | Review responsibility |
|---|------|----------|--------|--------------|-----------------------|
| 1 | Aisha Niyonsaba | 25/27104 | lavi041 | Product and GitHub lead (also release and evidence) | Reviews Adelphine's PR: product scope and contribution evidence |
| 2 | Mahgoub ADIL AHMED ALHASSAN | 25/28013 | mahgoubalhassan2-tec | AI and data engineer | Reviews Manzi's PR: API tests and no-match safety |
| 3 | Manzi Kassim | 25/27935 | manzikassim | API and integration engineer | Reviews Sumaya's PR: mobile networking and error handling |
| 4 | Inezaye Iwacu Adelphine | 25/27676 | addyiwacu444-droid | Mobile UI and navigation engineer | Reviews Aisha's PR: UI and UX evidence |
| 5 | Ishimwe Sumaya | 25/27949 | ug2527949-cyber | Offline and quality engineer (shares release and evidence) | Reviews Mahgoub's PR: AI query evaluation |

Five-member combination: roles 1-5; the Product lead and the Quality engineer share release and evidence duties.

## Purpose
AgriSoko Pocket lets a visitor ask about any team member by name, nickname, role, skill or feature. A deterministic
TF-IDF engine returns the best matching approved profile with a confidence score, the reason, and evidence links.
It works offline for exact name, nickname and role lookups. No external generative AI is used.

## Architecture
```
Android APK (React Native + Expo + TypeScript)
   |  online: POST /ask, GET /members, GET /members/{id}, GET /health, GET /model-info (HTTPS, 8 s timeout)
   v
FastAPI service (ai-api/)  ->  TF-IDF engine (scikit-learn)  ->  data/members.json (approved, signed records)
   ^
   |  offline / server down: bundled directory (src/data/members.bundle.json) + AsyncStorage cache
```
`members.bundle.json` is generated from `members.json` by `build_index.py`, so the phone and the server always share one source of truth.

## Setup and run
### 1. AI service
```bash
cd ai-api
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python build_index.py --export-mobile ../mobile/src/data/members.bundle.json   # validate, fingerprint, export
python -m pytest -q                                      # automated tests
python eval/run_eval.py                                  # writes eval/EVAL_REPORT.md
uvicorn app.main:app --host 0.0.0.0 --port 8000          # http://localhost:8000/docs
```
Environment variables: `GROUP_CODE` (default G08), `CONFIDENCE_THRESHOLD` (default 0.45), `BUILD_COMMIT`, `MEMBERS_PATH`.
Deployment (example, Render): build `pip install -r requirements.txt && python build_index.py`, start
`uvicorn app.main:app --host 0.0.0.0 --port $PORT`. No secrets are needed.

### 2. Mobile app
```bash
cd mobile
npm install
npx expo install --fix            # aligns package versions with your Expo SDK
npm run typecheck
# API URL: edit expo.extra.apiBaseUrl in app.json, or set EXPO_PUBLIC_API_URL
EXPO_PUBLIC_API_URL=http://<your-pc-ip>:8000 npx expo start
```
### 3. Build the APK
```bash
npm install -g eas-cli && eas login
eas build:configure                           # first time only
eas build --platform android --profile preview   # produces an installable APK
```
Download the APK, rename it `AgriSokoPocket_G08.apk`, place it in `build/` and attach it to the GitHub Release `v1.0.0`.

## Required details (fill before submission)
- Tested devices: TODO (at least two Android devices or configurations)
- Repository URL: https://github.com/lavi041/agrisoko-pocket-g08  |  Release URL (v1.0.0): TODO
- Final commit hash: TODO  |  APK path: `build/AgriSokoPocket_G08.apk`
- API URL: TODO

## Known limitations
- Vocabulary-based retrieval: synonyms and heavy misspellings can be missed.
- Offline mode matches only exact names, nicknames, GitHub usernames and roles (never guesses between members).
- Covers only this group's approved profiles.

## AI rules (documented)
See `ai-api/app/engine.py` header: score = 0.4 x cosine(word+char TF-IDF) + 0.6 x IDF-weighted coverage; name/alias boost +0.50;
threshold 0.45; ambiguity guard (runner-up within 0.05 and no name hit -> no match). Threshold justification: `ai-api/eval/EVAL_REPORT.md`
(correct matches scored >= 0.62, no-match queries <= 0.05, so 0.45 was kept). Re-run the evaluation after you replace the sample data.

## Where is every evidence file
| Evidence | Location |
|---|---|
| Report | `docs/COMBO_A3_G08_REPORT.pdf` (template: `docs/REPORT_TEMPLATE.md`) |
| Demo video | `evidence/COMBO_A3_G08_DEMO.mp4` |
| Contributions (signed) | `evidence/CONTRIBUTIONS.pdf` (template: `evidence/CONTRIBUTIONS_TEMPLATE.md`) |
| Test log | `evidence/TEST_LOG.pdf` (template: `evidence/TEST_LOG_TEMPLATE.md`) |
| Feedback | `evidence/FEEDBACK.pdf` (template: `evidence/FEEDBACK_TEMPLATE.md`) |
| AI use | `evidence/AI_USE.md` |
| AI evaluation | `ai-api/eval/EVAL_REPORT.md` |
