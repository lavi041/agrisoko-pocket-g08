# AgriSoko Pocket G08: UI, UX and AI system report (draft, export to PDF as COMBO_A3_G08_REPORT.pdf)
Items marked TODO need real data from the group. Do not invent testers, metrics or quotes.

## Page 1. Problem and users
Scenario: AgriSoko presents to potato cooperatives, employers and innovation partners in Musanze. A visitor asks a natural question and gets a short profile that links a member's contribution to the product, tests and repository history.
Product promise: ask by name, nickname, role, skill or feature; get the best matching approved profile with confidence, reason and evidence links; works offline for exact name, nickname and role.
Members and roles: Aisha Niyonsaba (Product and GitHub lead, release and evidence), Mahgoub ADIL AHMED ALHASSAN (AI and data), Manzi Kassim (API and integration), Inezaye Iwacu Adelphine (Mobile UI and navigation), Ishimwe Sumaya (Offline and quality). Five-member combination: roles 1-5.

## Page 2. Information architecture
Screens: Home, Ask, Result, Profile, Directory, About. Flow: Home -> Ask -> Result -> Profile; Home -> Directory -> Profile; Home -> About.
Online: question validated (1-200 characters), POST /ask, result labelled Live. Offline or server down: exact name, alias, GitHub username or role lookup in the bundled directory, labelled Offline match; otherwise message plus suggestions. Last result and directory cached with AsyncStorage.

## Pages 3-4. Annotated interface design (use evidence/screenshots/)
01_home, 02_ask, 03_result, 04_no_match, 05_directory, 06_profile, 07_about, 08_offline. TODO: error/timeout screenshot, annotations (source label, confidence, evidence links, accessibility labels, 48 px touch targets).

## Page 5. AI design
Schema (14 keys): fullName, registrationNumber, aliases, githubUsername, role, skills, targetUser, problem, contribution, feature, outcomeMetric, evidenceLinks, testerFeedback, introductionDraft. One document per member from name, aliases, GitHub, role, skills, feature, problem, target user, contribution, metric and consented feedback.
Scoring: 0.4 x cosine (0.6 word TF-IDF 1-2 grams + 0.4 char_wb 3-5 grams) + 0.6 x IDF-weighted coverage of the question's content words; name/alias boost +0.50; threshold 0.45; ambiguity guard (runner-up within 0.05 and no name hit gives no match). Why coverage: plain cosine against long documents gave low scores (about 0.2) even for correct role and feature questions.
Grounding: only stored fields are returned; the introduction is a fixed template over approved facts; if outcomeMetric is empty it says no verified metric exists; SHA-256 fingerprint of members.json shown in /model-info and the app.

## Page 6. API and integration
Endpoints: GET /health, GET /members, GET /members/{id} (404 if unknown), POST /ask, GET /model-info. Validation: query 1-200 characters, otherwise 422. Empty dataset gives 503; unexpected errors give a generic 500.
Example request: POST /ask {"query": "Tell me about Aisha"}
Example response (shortened): {"matched": true, "confidence": 1.0, "threshold": 0.45, "reason": "The question contains the name or alias 'aisha'.", "member": {"id": "aisha-niyonsaba", "role": "Product and GitHub lead"}, "evidence_links": [{"label": "Repository", "url": "https://github.com/lavi041/agrisoko-pocket-g08"}], "model_version": "agrisoko-tfidf-1.0.0", "group_code": "G08"}
No-match example: {"query": "best pizza recipe"} gives matched false, confidence 0.0084, member null, five suggestions.
Mobile: Axios, base URL from app config (Render HTTPS URL), 8 s timeout, retry button, fallback to bundled directory. Deployment: Render Free plan, https://agrisoko-pocket-g08.onrender.com (sleeps when idle; first request about 50 s).

## Page 7. Testing evidence
AI: 15/15 top-1, 6/6 no-match (EVAL_REPORT.md); API: 22 pytest tests passed; mobile: expo-doctor 20/20, tsc clean; APK checks 1-6 passed on a physical phone (see TEST_LOG.md). TODO: device matrix with 2 devices, four testers (two external) with consent and findings, two fixed issues with issue and commit links.
Limitation: the evaluation queries were written by the group.

## Page 8. GitHub collaboration
Repository: https://github.com/lavi041/agrisoko-pocket-g08. Issues #3-#7, one per member. PR #1 (Expo SDK 58) and PR #2 (team data) were merged by the Product lead without review, before the other members had accepted their invitations. This is stated honestly; later PRs are reviewed by another member before merge. TODO: branches, PRs and reviews per member, tag v1.0.0, release URL, contribution map (CONTRIBUTIONS.pdf).

## Pages 9-10. Results and responsible AI
TODO: final screenshots from the v1.0.0 APK. Limitations: vocabulary-based retrieval (synonyms missed), offline mode is exact match only, Render Free cold start, only five members covered. Privacy: no phone numbers, addresses, passwords or tokens in members.json or the repository; tester names only with consent. Truthfulness: no metric, tester or quote is shown unless verified; outcomeMetric stays empty until real evidence exists. AI use: see evidence/AI_USE.md. Lessons and next steps: TODO.
