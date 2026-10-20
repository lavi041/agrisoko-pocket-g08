# Group G08 task plan (deadline: Friday 23 October 2026, 17:00 CAT)

Every member must: own one GitHub issue, work on a named branch, open one substantial PR linked to the issue,
review one PR of another member, and be able to explain and change their own code in the defense.
The facts in members.json (metrics, links, feedback) must be filled by each member only when true.

| Member | Issue (feature) | Branch | What to deliver | Evidence to collect |
|---|---|---|---|---|
| Aisha | #1 GitHub workflow, release and evidence package | feature/product-release | Issues for all features, milestones, merge reviewed PRs, tag v1.0.0, GitHub Release with APK, README, report PDF, CONTRIBUTIONS, final ZIP | Issue list, release URL, final commit hash |
| Mahgoub | #2 TF-IDF matching engine and evaluation | feature/ai-engine | Review members.json schema and text fields, tune threshold if needed, extend eval/queries.json, EVAL_REPORT, model-info | eval report, threshold justification, top-1 and no-match accuracy |
| Manzi | #3 FastAPI endpoints and deployment | feature/api-deploy | Deploy ai-api to Render (https URL), logging, keep pytest green, document request/response examples | /health and /model-info on the live URL, pytest output |
| Adelphine | #4 Screens, navigation and accessibility | feature/mobile-ui | Check all screens on a phone, large-text behaviour, contrast, accessibility labels, screenshots of every state | Annotated screenshots (home, ask, result, directory, profile, no-match, error, offline) |
| Sumaya | #5 Offline mode, cache and device testing | feature/offline-quality | Test matrix on 2+ devices, offline and reconnect tests, reproduce and fix 2+ bugs (issue + commit each), run the tester sessions | TEST_LOG, FEEDBACK (4 testers, 2 outside the group), bug issue links |

## Shared tasks
1. Each member fills their own record in ai-api/data/members.json (introductionDraft, outcomeMetric only if verified, evidenceLinks to own PR and commits) and signs it.
2. Cross-reviews: Aisha reviews Adelphine, Adelphine reviews Aisha, Mahgoub reviews Manzi, Manzi reviews Sumaya, Sumaya reviews Mahgoub. A review needs a real comment or approval, not a reaction.
3. Demo video (max 3 min, one take): everyone says their name and technical contribution. Shows APK icon, name query, role query, no-match query, profile + link, offline lookup and reconnect, /model-info, GitHub release.
4. Everyone writes true lines in evidence/AI_USE.md for any AI help used.

## Timeline
- Tue 20: all members clone the repo, owners create issues and branches, members fill their records.
- Wed 21: deploy API (Manzi), set apiBaseUrl, merge PRs after review.
- Thu 22: build APK with EAS, device tests, tester sessions, bug fixes, screenshots, video.
- Fri 23 morning: tag v1.0.0, release with APK, report and evidence PDFs, ZIP, submit well before 17:00.
