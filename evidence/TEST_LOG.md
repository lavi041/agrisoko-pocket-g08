
## 9. Live API validation tests (Render, run on 22 Oct 2026)
| Request | Expected | Result |
|---|---|---|
| GET /health | 200, group G08 | PASS |
| POST /ask with empty query | 422 | PASS |
| POST /ask with 201 characters | 422 | PASS |
| GET /members/ntawe | 404 Member not found | PASS |
| GET /members/aisha-niyonsaba | 200 | PASS |
| POST /ask "Who is the AI and data engineer?" | matched Mahgoub, confidence 0.68 | PASS |
