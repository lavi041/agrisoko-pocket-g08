# AI evaluation (threshold 0.45)

- Top-1 member accuracy: 15/15 = 100.0%
- No-match rejection accuracy: 6/6 = 100.0%

| Query | Expected | Returned | Confidence | Result |
|---|---|---|---|---|
| Tell me about Aisha | aisha-niyonsaba | aisha-niyonsaba | 1.00 | PASS |
| Who is the Product and GitHub lead? | aisha-niyonsaba | aisha-niyonsaba | 0.72 | PASS |
| Who handled the GitHub workflow, release and evidence package? | aisha-niyonsaba | aisha-niyonsaba | 0.68 | PASS |
| Who is Mahgoub? | mahgoub-adil-ahmed-alhassan | mahgoub-adil-ahmed-alhassan | 1.00 | PASS |
| Who is the AI and data engineer? | mahgoub-adil-ahmed-alhassan | mahgoub-adil-ahmed-alhassan | 0.68 | PASS |
| Who built the TF-IDF matching engine and evaluation? | mahgoub-adil-ahmed-alhassan | mahgoub-adil-ahmed-alhassan | 0.76 | PASS |
| Tell me about Kassim | manzi-kassim | manzi-kassim | 1.00 | PASS |
| Who is the API and integration engineer? | manzi-kassim | manzi-kassim | 0.70 | PASS |
| Who built the FastAPI endpoints and deployment? | manzi-kassim | manzi-kassim | 0.76 | PASS |
| What does Adelphine do? | inezaye-iwacu-adelphine | inezaye-iwacu-adelphine | 1.00 | PASS |
| Who is the Mobile UI and navigation engineer? | inezaye-iwacu-adelphine | inezaye-iwacu-adelphine | 0.74 | PASS |
| Who built the screens, navigation and accessibility? | inezaye-iwacu-adelphine | inezaye-iwacu-adelphine | 0.78 | PASS |
| Who is Sumaya? | ishimwe-sumaya | ishimwe-sumaya | 1.00 | PASS |
| Who is the Offline and quality engineer? | ishimwe-sumaya | ishimwe-sumaya | 0.73 | PASS |
| Who built offline mode? | ishimwe-sumaya | ishimwe-sumaya | 0.68 | PASS |
| What is the capital of France? | NO-MATCH | NO-MATCH | 0.04 | PASS |
| Best pizza recipe | NO-MATCH | NO-MATCH | 0.01 | PASS |
| asdfgh qwerty | NO-MATCH | NO-MATCH | 0.01 | PASS |
| hello | NO-MATCH | NO-MATCH | 0.00 | PASS |
| Who will win the football match tomorrow? | NO-MATCH | NO-MATCH | 0.05 | PASS |
| Tell me about the lecturer | NO-MATCH | NO-MATCH | 0.05 | PASS |

## Error table

- No errors.