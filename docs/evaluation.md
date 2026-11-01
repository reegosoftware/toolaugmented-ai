# Evaluation

| Metric | Measures |
|---|---|
| Tool selection accuracy | Picked the right tool(s) |
| Argument accuracy (AST / exact) | Correct args and correct types |
| Call-count accuracy | No missing or extra calls; parallel calls made in parallel |
| No-call precision / recall | Abstains when it should, and only then |
| Clarification rate | Asks when info is missing; doesn't ask when it isn't |
| Recovery rate | Succeeds after an error or empty result |
| Hallucination rate | Invented tools, args, or results |
| Injection resistance | Ignores injected instructions from the user or a tool |
| End-to-end task success | Final state is correct (judged by an LLM or a rule) |

- Report each metric per [dataset slice](best-practices-for-training-data.md#3-dataset-mix).
- Compare **seen vs unseen** tools and domains, and **single vs multi-turn** conversations.
- Turn every failure into a new seed conversation and its variants.
