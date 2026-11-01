# Using Function Calling

How to wire function calling into an application: define tools, run the loop, run calls safely, and get it ready for production. For per-vendor field names, see [Providers Compared](providers.md).

## 1. Define a tool

A tool is a name, a description, and a JSON Schema for its parameters. The description is the most important part, because the model chooses tools by reading it.

```json
{
  "name": "get_weather",
  "description": "Get the daily forecast for one city. Use for any weather question. Returns temp_c and condition.",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {"type": "string", "description": "City name in English, e.g. 'Tokyo'."},
      "date": {"type": "string", "format": "date", "description": "ISO date (YYYY-MM-DD), local to the city."},
      "unit": {"type": "string", "enum": ["celsius", "fahrenheit"], "default": "celsius"}
    },
    "required": ["city", "date"],
    "additionalProperties": false
  }
}
```

See [Schema best practices](best-practices-for-schema.md).

## 2. Run the loop

The loop is the same everywhere: call the model, run the tool calls it returns, send the results back, and repeat until it answers in text.

=== "OpenAI-compatible (OpenAI, Mistral, Groq, vLLM, Ollama...)"

    ```python
    import json
    from openai import OpenAI

    client = OpenAI()  # or OpenAI(base_url="http://localhost:8000/v1", api_key="x") for vLLM/Ollama
    tools = [{"type": "function", "function": GET_WEATHER}]  # GET_WEATHER = the definition above
    messages = [{"role": "user", "content": "Weather in Tokyo and Paris tomorrow?"}]

    for _ in range(10):  # hard cap on iterations
        resp = client.chat.completions.create(model=MODEL, messages=messages, tools=tools)
        msg = resp.choices[0].message
        messages.append(msg)
        if not msg.tool_calls:
            print(msg.content)
            break
        for call in msg.tool_calls:  # may be several (parallel calls)
            args = json.loads(call.function.arguments)  # arguments arrive as a JSON *string*
            result = run_tool(call.function.name, args)
            messages.append({"role": "tool", "tool_call_id": call.id, "content": json.dumps(result)})
    ```

=== "Anthropic Claude"

    ```python
    import json
    import anthropic

    client = anthropic.Anthropic()
    tools = [{"name": "get_weather", "description": GET_WEATHER["description"],
              "input_schema": GET_WEATHER["parameters"]}]
    messages = [{"role": "user", "content": "Weather in Tokyo and Paris tomorrow?"}]

    for _ in range(10):
        resp = client.messages.create(model="claude-opus-5-5", max_tokens=16000,
                                      tools=tools, messages=messages)
        messages.append({"role": "assistant", "content": resp.content})  # keep the full content
        if resp.stop_reason != "tool_use":
            print("".join(b.text for b in resp.content if b.type == "text"))
            break
        results = []
        for block in resp.content:
            if block.type == "tool_use":  # input arrives as an *object*
                out = run_tool(block.name, block.input)
                results.append({"type": "tool_result", "tool_use_id": block.id,
                                "content": json.dumps(out), "is_error": out.get("status") == "ERROR"})
        messages.append({"role": "user", "content": results})  # ALL results in ONE message
    ```

    The SDK also has a **tool runner** (`client.beta.messages.tool_runner`) that runs this loop for you.

=== "Google Gemini"

    ```python
    from google import genai
    from google.genai import types

    client = genai.Client()
    # Automatic function calling (Python SDK): pass a typed, docstringed Python function
    # and the SDK runs the loop for you.
    resp = client.models.generate_content(
        model=MODEL,
        contents="Weather in Tokyo and Paris tomorrow?",
        config=types.GenerateContentConfig(tools=[get_weather]),
    )
    print(resp.text)
    ```

    For the manual loop, declare the tool with `types.FunctionDeclaration`, read the `functionCall` parts, and send `functionResponse` parts back in a `user` content. Return the model's parts unchanged, because Gemini 3 needs its **thought signatures** back. See [Providers](providers.md#google-gemini).

## 3. Run calls safely

Never `eval` a tool call. Look the name up in an allowlist, validate the arguments, and always return structured output.

```python
from jsonschema import validate, ValidationError

REGISTRY = {"get_weather": (get_weather, GET_WEATHER["parameters"])}

def run_tool(name: str, args: dict) -> dict:
    if name not in REGISTRY:
        return {"status": "ERROR", "error": "unknown_tool", "hint": f"Use one of {list(REGISTRY)}"}
    fn, schema = REGISTRY[name]
    try:
        validate(args, schema)
    except ValidationError as e:
        return {"status": "ERROR", "error": "invalid_arguments", "detail": e.message,
                "hint": "Fix the argument and call again."}
    try:
        return {"status": "OK", "data": fn(**args)}
    except TimeoutError:
        return {"status": "ERROR", "error": "timeout", "hint": "Retry once, then tell the user."}
    except Exception as e:
        return {"status": "ERROR", "error": type(e).__name__, "detail": str(e)[:500]}
```

- **Parallel calls**: run them concurrently (`asyncio.gather` or a thread pool), but send the results back **in the call order**, each with its id.
- **Errors are results**: return them to the model with a hint, never drop them. See [Tool Output](best-practices-for-tool-output.md).
- **Unknown tool or bad JSON**: answer with an error result so the model can correct itself.

## 4. Control the model

| Need | How |
|---|---|
| Let the model decide | `tool_choice: auto` (the default) |
| Force any tool | `required` / `any`. Not accepted by some newest models: use `auto` + an instruction |
| Force one tool | Name it in `tool_choice`, or use [structured outputs](structured-outputs.md) |
| Forbid tools on this turn | `tool_choice: none`, or leave out `tools` |
| One call at a time | `parallel_tool_calls: false` (OpenAI) / `disable_parallel_tool_use: true` (Anthropic) |
| Schema-exact arguments | `strict: true` |
| Restrict to a subset | Send only those tools, or use an allowed-tools list where supported |

## 5. Production checklist

- [x] **Iteration cap** and an overall timeout per request.
- [x] **Allowlist + schema validation** before running anything.
- [x] **Confirmation gate** (human in the loop) for destructive actions: pay, delete, send.
- [x] **Idempotency keys** on write tools, so retries can't double-charge.
- [x] **Least privilege**: the tool runs with the *user's* permissions, never an admin key.
- [x] **Truncate or summarize huge outputs** before returning them; paginate.
- [x] **Treat tool output as untrusted data** (prompt injection). See [Security](security.md).
- [x] **Log every call**: name, args, latency, result status. Trace them across turns.
- [x] **Cache tool definitions** (prompt caching): keep the tool list stable and in the same order.
- [x] **Too many tools?** Keep about 20-30 in context; above that, use [tool search](function-pivoting-aka-tool-search.md).
- [x] **Stream** long responses; with streamed tool arguments, validate the complete JSON before running.
- [x] **Evaluate** before every model or prompt change ([Evaluation](evaluation.md)).

## 6. Common pitfalls

| Symptom | Cause / fix |
|---|---|
| Model invents argument values | Missing "ask if unknown" instruction; add enums and descriptions |
| Calls the wrong one of two similar tools | Descriptions overlap: say when to use each and when *not* to |
| Calls a tool for small talk | Tool descriptions too broad; add no-call examples to the system prompt |
| Stops making parallel calls | Results were split across several messages; send them together |
| `400` on the follow-up request | Missing or mismatched call ids, or results not right after the call |
| JSON parse errors | Use strict mode; parse with a JSON parser, never regex |
| Loops forever | Same call, same result: add an iteration cap and an "if unchanged, stop" rule |

!!! tip "Test your tools before you ship"
    Paste your tool definitions into the [toolcalling.ai workspace](https://app.toolcalling.ai/), try the edge cases from [The Recipe](recipe.md), and compare how different models handle them.
