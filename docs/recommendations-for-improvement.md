# Recommendations for Improvement

When a function-calling system misbehaves, fix it in this order. The cheapest fix comes first, and each layer is easier to change than the next.

| # | Layer | Fix here when... |
|---|---|---|
| 1 | **Tool descriptions & schema** | Wrong tool chosen, wrong or invented arguments, wrong units or formats |
| 2 | **System prompt** | Wrong policy behavior: no confirmation, guesses instead of asking, wrong tone, out-of-scope requests |
| 3 | **Tool output** | The model can't recover from errors, misreads results, or dumps raw JSON |
| 4 | **Orchestration code** | Loops, too many tools, parallel calls mishandled, context overflow |
| 5 | **Model choice** | The failures persist across the layers above (compare models on the [leaderboard](https://toolcalling.ai/leaderboard)) |
| 6 | **Training data / fine-tuning** | You need a small or private model, or a behavior prompting can't fix ([Fine-Tuning](fine-tuning.md)) |

## Common fixes

- **Document every parameter**: type, purpose, format, unit, and default ([Schema](best-practices-for-schema.md)).
- **Teach error handling**: say in the description how to handle each error, and return errors with a machine-readable code and a `hint` ([Tool Output](best-practices-for-tool-output.md)).
- **Add "when not to use" lines** to tools that get confused with each other.
- **Add explicit rules** to the system prompt for every behavior you expect ([System Instruction](best-practices-for-system-instruction.md)).

## Close the loop

1. Collect failures from production logs and the [Arena](https://app.toolcalling.ai/arena).
2. Add each one to your eval set ([Evaluation](evaluation.md)).
3. Fix it at the lowest layer that works, and re-run the eval.
4. If you fine-tune, turn the failures into new seeds and [variants](variants.md).
