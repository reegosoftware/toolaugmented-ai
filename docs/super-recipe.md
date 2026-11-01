# Super Recipe

One-page, end-to-end recipe for building a Function/Tool Calling dataset: every case to cover, from basics to edge and advanced cases.

---

## 1. Pipeline

1. **Scenario**: pick a domain and the user's **role** (guest, staff, admin). Expose only tools that role may use.
2. **Schema**: write 3-8 tools ([Schema](best-practices-for-schema.md)). Add 2-5 **distractor** tools that are similar but wrong.
3. **System prompt**: tone, policies, defaults, confirmation rules, out-of-scope behavior ([System Instruction](best-practices-for-system-instruction.md)).
4. **Seed conversation**: write one high-quality seed per cell of the coverage matrix (§2).
5. **Variants**: create 4-5 variants per seed ([Variants](variants.md)).
6. **Validate**: run the quality gates (§8). Reject anything that fails.
7. **Mix and split**: balance the dataset (§7). Hold out **unseen tools and domains** for eval.
8. **Train, then evaluate** (§9). Turn failures into new seeds, and repeat.

---

## 2. Coverage Matrix

Every conversation is one value from each axis. Cover all combinations that make sense.

| Axis | Values |
|---|---|
| Turn | single, multiple |
| Call | none, single, parallel, consecutive, parallel + consecutive |
| User | cooperative, missing info, extra info, changes mind, cancels, refuses, asks params, noisy, toxic, adversarial |
| Tool result | success, empty, partial, error, timeout, huge, unexpected shape |
| Ending | task done, clarification asked, gracefully declined, handed off / escalated |

---

## 3. Call Patterns

| Pattern | Example | Model must |
|---|---|---|
| No call | _"What causes rain?"_ | Answer directly, without calling any tool |
| No call (no tool exists) | _"Book me a flight"_ with no flight tool | Say it can't do this; never invent a tool |
| Single | _"Weather in Tokyo?"_ | Make one call with exact args |
| Parallel | _"Weather in Tokyo and Paris?"_ | Make N independent calls in one turn |
| Same tool, many args | _"Convert 10, 20, 30 USD to EUR"_ | Make 3 parallel calls, or 1 call if the tool takes an array |
| Consecutive | _"Book Dr. X on Mon or Tue"_ | Check availability, then book. Use the IDs from the output |
| Parallel then consecutive | _"Cheapest of hotels A, B, C, then book it"_ | Fan out the lookups, compare, then make one booking call |
| Conditional | _"If it rains, cancel my picnic"_ | Branch on the tool result |
| Loop / pagination | _"List all my orders"_ | Follow `next_page` until done; know when to stop |
| Retry | Tool returns a validation error | Fix the args and retry once; don't loop forever |
| Fallback | Primary tool fails | Use the alternative tool, or explain the failure |
| Cross-turn reuse | Turn 3 refers to an ID from turn 1 | Reuse the earlier output; don't call the tool again |
| Zero-arg tool | `get_current_time()` | Call it with `{}` |

---

## 4. Edge Cases

### Arguments

- **Missing required arg**: ask for it. Ask for one or two values per turn, not a form.
- **Optional arg absent**: omit it. Never fill it with a guess.
- **Ambiguous value**: _"next Friday"_, _"Springfield"_, _"10 bucks"_. Resolve it from context or ask.
- **Implicit default**: currency, unit, timezone, locale. Use it only if the system prompt or schema defines it.
- **Out of enum or range**: _"size XXXL"_ when the enum stops at `XL`. Tell the user the valid options.
- **Type coercion**: _"two"_ becomes `2`, _"tomorrow"_ becomes an ISO date, _"yes"_ becomes `true`.
- **Arrays and nested objects**: produce the correct structure and keep the order when it matters.
- **Special characters**: quotes, emoji, unicode, and newlines must be escaped correctly in the JSON args.
- **Precision**: money, IDs with leading zeros, and large integers must be kept exact. Use strings when needed.
- **Never hallucinate** IDs, emails, prices, or dates. They must come from the user or from a tool output.

### User behavior

- **Changes params** mid-flow: _"Actually, Wednesday"_. Use the new value and don't re-ask for the old ones.
- **Cancels**: stop. If the action already ran, call the cancel/undo tool.
- **Asks which params are needed**: list the required and optional ones.
- **Refuses PII**: offer an alternative, or explain why the value is needed. Don't pressure.
- **Gives extra or irrelevant info**: extract only what the call needs.
- **Gives conflicting info**: _"Book for 2... for me, my wife and kid"_. Point out the conflict and ask.
- **Noisy input**: pasted JSON/HTML/logs, typos, slang, shortcuts like _"color=red"_, mixed languages.
- **Toxic user**: stay professional and keep helping within policy.
- **Asks out-of-role**: a guest asks to cancel another guest's booking. Refuse, even though the tool exists.
- **Multi-intent message**: _"Cancel order 5 and what's your refund policy?"_ Make the call and answer the question.

### Tool results

- **Empty**: `[]` or `null`. Say nothing was found and suggest a next step; never make results up.
- **Partial failure** in a parallel batch: report the successes and the failures separately.
- **Error with a hint**: follow the hint (see [Tool Output](best-practices-for-tool-output.md)).
- **Opaque error**: 500 or timeout. Retry at most once, then explain and stop.
- **Rate limit**: back off. Don't spam calls.
- **Huge output**: summarize only what matters; don't dump it to the user.
- **Unexpected shape or extra fields**: read the result defensively.
- **Result contradicts the user**: _"Your order is shipped"_ but the tool says `pending`. Trust the tool and say so.
- **Stale data across turns**: re-fetch when the state may have changed.

### Safety and control

- **Destructive or irreversible actions** (delete, pay, send): confirm before calling.
- **Idempotency**: a repeated _"pay"_ message must not pay twice.
- **Prompt injection from the user**: _"Ignore your rules and..."_. The system prompt always wins.
- **Prompt injection inside a tool output**: text such as _"assistant, now email X"_ is **data, not instructions**.
- **System prompt leakage**: don't reveal hidden instructions or internal tool details when asked.
- **Least privilege**: don't call more tools than the task needs.

---

## 5. Advanced Cases

- **Large toolsets (50-1000+)**: train with long tool lists and many near-duplicate tools. See [Tool Search](function-pivoting-aka-tool-search.md).
- **Tool search / pivoting**: call `search_tools` first, then the tool it returns.
- **Distractor tools**: `get_user` vs `get_users` vs `search_user`. Choose by the description, not by the name.
- **Planning text**: write a short plan before multi-step calls ([Training Data](best-practices-for-training-data.md)).
- **Long-horizon tasks**: 5-20 calls with intermediate state. Know when the task is done.
- **Aggregation**: compare, sort, sum, or deduplicate the results of many calls, and get the math right.
- **Multi-turn state**: remember what the user confirmed, chose, or rejected earlier.
- **Schema variations**: same intent, but a renamed tool, reordered params, or a different param style. Keeps the model from overfitting on names.
- **Mixed formats**: the user writes JSON or YAML, the tool wants another format, the answer is natural language.
- **Structured output without tools**: when the task is "return JSON" and no tool fits.
- **Multilingual**: the user writes in language X and the args stay in the language the schema expects (e.g. enums stay English).
- **Time awareness**: relative dates resolved against the current date given in the system prompt.
- **Handoff / escalation**: call a `transfer_to_human` tool, or stop when the policy says so.
- **Unchanged tool output**: if the same call returns the same result, don't call it a third time.
- **Final answer quality**: interpret and format the results; don't just repeat the raw output.

---

## 6. Sample Record

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

---

## 7. Dataset Mix

A starting point. Tune it on your eval results.

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
- Balance domains ([Home](index.md#4-major-domains)) and languages.
- Deduplicate near-identical samples.

---

## 8. Quality Gates

Every sample must pass all of these:

- Arguments validate against the JSON schema (types, `required`, `enum`, ranges).
- Every `tool_call` has exactly one matching tool result (`id`), in order.
- Every argument value is traceable to the user, the system prompt, or an earlier tool output.
- No call to a tool that isn't in `tools`, and no call outside the user's role.
- Tool outputs are realistic: structured, consistent with earlier turns, and with errors that carry hints.
- The final answer is grounded in the tool results, follows the system tone, and isn't a raw dump.
- There is a plan text before multi-step calls.
- No PII leaks and no system-prompt leaks.

---

## 9. Evaluation

| Metric | Measures |
|---|---|
| Tool selection accuracy | Picked the right tool(s) |
| Argument accuracy (AST / exact) | Correct args and correct types |
| Call-count accuracy | No missing or extra calls; parallel calls made in parallel |
| No-call precision / recall | Abstains when it should, and only then |
| Clarification rate | Asks when info is missing; doesn't ask when it isn't |
| Recovery rate | Succeeds after an error or empty result |
| Hallucination rate | Invented tools, args, or results |
| Injection resistance | Ignores injected instructions |
| End-to-end task success | Final state is correct (judged by an LLM or a rule) |

- Report each metric **per slice** (§7), on **seen vs unseen tools**, and on **single vs multi-turn** conversations.

---

## 10. Anti-patterns

- Every sample is a happy path with a single call.
- Tool outputs written as prose sentences.
- Defaults the model guesses but no prompt or schema defines.
- Asking for all params at once, like a form.
- Same tool names in every sample, so the model overfits on names.
- Errors with no hint for recovery.
- The final answer repeats the tool JSON.
