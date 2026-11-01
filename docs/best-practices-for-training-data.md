# Best Practices for Training Data

## 1. Planning
- Planning, aka the preceding text, is crucial for the model to keep track of its next action.
- Provide clear intermediate explanations or logical connections between sequential tool uses, so the process flow is never confusing.

## 2. Sample record

The record below shows a parallel call, a partial failure, and a grounded final answer.

```json
{
  "messages": [
    {"role": "system", "content": "You are a travel assistant. Today is 2026-11-01. Default currency: EUR. Confirm before booking."},
    {"role": "user", "content": "weather in tokyo & paris tmrw?"},
    {"role": "assistant", "content": "I'll check both cities.", "tool_calls": [
      {"id": "c1", "name": "get_weather", "arguments": {"city": "Tokyo", "date": "2026-11-02"}},
      {"id": "c2", "name": "get_weather", "arguments": {"city": "Paris", "date": "2026-11-02"}}
    ]},
    {"role": "tool", "tool_call_id": "c1", "content": {"status": "OK", "temp_c": 14, "condition": "rain"}},
    {"role": "tool", "tool_call_id": "c2", "content": {"status": "ERROR", "error": "date_out_of_range", "hint": "max 1 day ahead in local time"}},
    {"role": "assistant", "content": "Tokyo tomorrow: 14°C with rain. I couldn't get Paris yet; its forecast isn't available for that date. Want me to try again later?"}
  ],
  "tools": [
    {"name": "get_weather", "description": "Daily forecast for a city.", "parameters": {
      "type": "object",
      "properties": {
        "city": {"type": "string", "description": "City name, English."},
        "date": {"type": "string", "format": "date", "description": "ISO date, local to the city."}
      },
      "required": ["city", "date"]
    }}
  ]
}
```

## 3. Dataset mix

A starting point. Tune it on your [evaluation](evaluation.md) results.

| Slice | Share |
|---|---|
| Single call | 20% |
| Parallel | 15% |
| Consecutive / mixed | 20% |
| No call (chit-chat + no tool exists) | 15% |
| Clarification (missing or ambiguous args) | 10% |
| Tool error / empty result / recovery | 10% |
| Adversarial (injection, out-of-role, toxic, noisy) | 10% |

- About 50% multi-turn.
- At least 30% of samples include distractor tools.
- Balance domains and languages.
- Deduplicate near-identical samples.
- Hold out unseen tools and domains for evaluation.

## 4. Quality gates

Every sample must pass all of these:

- Arguments validate against the JSON schema (types, `required`, `enum`, ranges).
- Every `tool_call` has exactly one matching tool result (`id`), in order.
- Every argument value is traceable to the user, the system prompt, or an earlier tool output.
- No call to a tool that isn't in `tools`, and no call outside the user's role.
- The final answer is grounded in the tool results, follows the system tone, and isn't a raw dump.
- No PII leaks and no system-prompt leaks.

## 5. Anti-patterns

- Every sample is a happy path with a single call.
- Tool outputs written as prose sentences.
- Defaults the model guesses but no prompt or schema defines.
- Asking for all params at once, like a form.
- Same tool names in every sample, so the model overfits on names.
- Errors with no hint for recovery.
