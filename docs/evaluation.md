# Evaluation

!!! tip "Benchmark on your own tools: [toolcalling.ai](https://toolcalling.ai/)"
    Public leaderboards measure *their* tools. Your users call *yours*. Debug your schemas in the [workspace](https://app.toolcalling.ai/), compare models in blind pairwise battles in the [Arena](https://app.toolcalling.ai/arena), and see the community [leaderboard](https://toolcalling.ai/leaderboard).

    [:material-sword-cross: Vote in the Arena](https://app.toolcalling.ai/arena){ .md-button .md-button--primary }
    [:material-trophy: Leaderboard](https://toolcalling.ai/leaderboard){ .md-button }

## Metrics

| Metric | Measures |
|---|---|
| Tool selection accuracy | Picked the right tool(s) |
| Argument accuracy (AST / exact) | Correct args and correct types |
| Call-count accuracy | No missing or extra calls; parallel calls made in parallel |
| No-call precision / recall | Abstains when it should, and only then (irrelevance detection) |
| Clarification rate | Asks when info is missing; doesn't ask when it isn't |
| Recovery rate | Succeeds after an error or empty result |
| Hallucination rate | Invented tools, args, or results |
| Injection resistance | Ignores injected instructions from the user or a tool |
| End-to-end task success | Final state is correct (judged by an LLM or a rule) |
| Consistency (pass^k) | Succeeds on *all* k repeated runs, not just one |
| Cost & latency | Tokens, number of calls, and wall time per completed task |

- Report each metric per [dataset slice](recipe.md#7-dataset-mix).
- Compare **seen vs unseen** tools and domains, and **single vs multi-turn** conversations.
- Turn every failure into a new seed conversation and its variants.

## How to score

| Method | Good for | Watch out |
|---|---|---|
| **Exact match** | Enums, ids | Too strict for free text and equivalent values |
| **AST match** | Single and parallel calls | Define what counts as equivalent (`"2"` vs `2`, date formats, unordered parallel calls) |
| **Execution match** | Calls with deterministic results | Needs real or mocked tools |
| **State check** | Multi-step agents (did the booking exist at the end?) | Needs a simulated environment |
| **LLM judge** | Final answer quality, clarification quality | Calibrate it against human labels; use a rubric |
| **Human votes** | Real-world preference across models | Needs volume. The [toolcalling.ai Arena](https://app.toolcalling.ai/arena) collects blind pairwise votes on tool-calling tasks; [LMArena](https://arena.ai/leaderboard) does the same for general chat |

## Build your own eval set

1. **Sample from production**, or write 100-500 cases covering the [coverage matrix](recipe.md#2-coverage-matrix).
2. Include **no-call**, **clarification**, **error**, and **adversarial** cases, not just happy paths.
3. Keep **held-out tools** that never appear in training.
4. Freeze it, version it, and run it on every model, prompt, or schema change.
5. Run each case several times for **consistency** (pass^k).

See the public suites on [Benchmarks](benchmarks.md).
