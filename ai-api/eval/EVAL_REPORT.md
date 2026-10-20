# AI evaluation (threshold 0.45)

- Top-1 member accuracy: 12/12 = 100.0%
- No-match rejection accuracy: 6/6 = 100.0%

| Query | Expected | Returned | Confidence | Result |
|---|---|---|---|---|
| Tell me about Alice | alice-example | alice-example | 1.00 | PASS |
| Who is the Product and GitHub lead? | alice-example | alice-example | 0.74 | PASS |
| Who handled release management and GitHub workflow? | alice-example | alice-example | 0.62 | PASS |
| Who is Bobby? | bob-example | bob-example | 1.00 | PASS |
| Who is the AI and data engineer? | bob-example | bob-example | 0.68 | PASS |
| Who built the TF-IDF matching engine? | bob-example | bob-example | 0.74 | PASS |
| Tell me about CJ | carol-example | carol-example | 1.00 | PASS |
| Who is the API and integration engineer? | carol-example | carol-example | 0.72 | PASS |
| Who built the FastAPI endpoints and deployment? | carol-example | carol-example | 0.78 | PASS |
| What does Dave do? | david-example | david-example | 1.00 | PASS |
| Who is the Mobile UI, offline and release engineer? | david-example | david-example | 0.76 | PASS |
| Who built offline mode? | david-example | david-example | 0.70 | PASS |
| What is the capital of France? | NO-MATCH | NO-MATCH | 0.04 | PASS |
| Best pizza recipe | NO-MATCH | NO-MATCH | 0.01 | PASS |
| asdfgh qwerty | NO-MATCH | NO-MATCH | 0.01 | PASS |
| hello | NO-MATCH | NO-MATCH | 0.00 | PASS |
| Who will win the football match tomorrow? | NO-MATCH | NO-MATCH | 0.05 | PASS |
| Tell me about the lecturer | NO-MATCH | NO-MATCH | 0.05 | PASS |

## Error table

- No errors.