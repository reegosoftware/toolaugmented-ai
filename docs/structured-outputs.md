# Structured Outputs vs Tools

Three related features are often confused:

| Feature | What you get | Use when |
|---|---|---|
| **Function / tool calling** | The model *may* request one or more actions; your code runs them and replies | The model must decide **whether** and **which** action to take, or needs live data |
| **Structured outputs** (JSON schema response format) | The model's final answer is JSON matching your schema | You always want one typed object back (extraction, classification) |
| **JSON mode** | Valid JSON, no schema guarantee | Legacy; prefer structured outputs |

## Rules of thumb

- **Always exactly one JSON object** → structured outputs. Don't fake it with a single forced tool.
- **A decision, several actions, or multiple steps** → tools.
- **Both**: an agent can use tools while working and return a structured final answer.
- **Extraction from noisy input** (one of this site's [major domains](index.md#5-major-domains)) works either way. Tools are more natural when there are several possible record types (one tool per type).

## Strict mode and constrained decoding

With `strict: true`, the provider constrains generation to your schema, so the arguments always parse and validate. Typical constraints:

- `additionalProperties: false` on every object.
- All properties listed in `required`. Express optional fields as nullable (`"type": ["string", "null"]`), depending on the provider.
- A *subset* of JSON Schema is supported. Some keywords (e.g. certain `format`s, `patternProperties`, deep `$ref` recursion) may be rejected or ignored. Check [Providers Compared](providers.md).
- The first request with a new schema may be slower while the grammar compiles. Later requests are cached.

For self-hosted models, the same guarantee comes from constrained decoding libraries such as [Outlines](https://github.com/dottxt-ai/outlines), [XGrammar](https://github.com/mlc-ai/xgrammar), [llguidance](https://github.com/guidance-ai/llguidance), or vLLM's structured outputs / guided decoding.

!!! warning "Valid isn't correct"
    Strict mode guarantees **shape**, not **truth**. The model can still choose the wrong tool, invent a value, or call when it should ask. That's what training data and [evaluation](evaluation.md) are for.
