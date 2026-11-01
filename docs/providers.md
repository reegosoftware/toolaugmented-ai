# Providers Compared

Every major API supports function calling, but the field names, argument types, and result formats differ. This page shows the differences side by side. *Verified against the official docs on 2026-11-01. APIs change, so follow the links.*

!!! tip "Compare them live"
    The quickest way to see how providers differ is to send the **same** schema and prompt to several models. Do it in the [toolcalling.ai workspace](https://app.toolcalling.ai/), or vote blind in the [Arena](https://app.toolcalling.ai/arena).

## At a glance

| Provider | Tool definition | Args come as | Result goes back as | Error flag | Stop signal |
|---|---|---|---|---|---|
| OpenAI Chat Completions | `{"type":"function","function":{name, description, parameters, strict}}` | JSON **string** | `role:"tool"` + `tool_call_id` | — | `finish_reason:"tool_calls"` |
| OpenAI Responses | `{"type":"function", name, description, parameters, strict}` (flat) | JSON **string** | `function_call_output` item + `call_id` | — | `function_call` items in `output` |
| Anthropic Claude | `{name, description, input_schema, strict?, input_examples?}` | **object** (`input`) | `tool_result` blocks (`tool_use_id`) in **one** user message | `is_error` | `stop_reason:"tool_use"` |
| Google Gemini | `functionDeclarations:[{name, description, parameters / parametersJsonSchema}]` | **object** (`args`) | `functionResponse` part in a `user` content, matched by `id` | — | `functionCall` parts |
| Mistral | OpenAI-style | JSON **string** | `role:"tool"` + `tool_call_id` + `name` | — | `tool_calls` present |
| Cohere v2 | OpenAI-style | JSON **string** | `role:"tool"` + `tool_call_id`, content = documents | — | `finish_reason:"TOOL_CALL"` |
| AWS Bedrock Converse | `toolSpec:{name, description, inputSchema:{json}}` | **object** (`input`) | `toolResult` (`toolUseId`) in a user message | `status:"error"` | `stopReason:"tool_use"` |
| Ollama (native) | OpenAI-style | **object** | `role:"tool"` + `tool_name` (no id) | — | `tool_calls` present |
| vLLM / OpenAI-compatible servers | OpenAI-style | JSON **string** | `role:"tool"` + `tool_call_id` | — | `finish_reason:"tool_calls"` |
| MCP | `{name, description, inputSchema, outputSchema?}` | **object** | `tools/call` result `content` / `structuredContent` | `isError` | — |

## Control options

| Provider | Auto | Force any | Force one | None | Subset | Parallel off | Strict |
|---|---|---|---|---|---|---|---|
| OpenAI | `auto` | `required` | `{"type":"function",...}` | `none` | `allowed_tools` | `parallel_tool_calls:false` | `strict:true` |
| Anthropic | `auto` | `any`* | `{"type":"tool","name"}`* | `none` | — | `disable_parallel_tool_use` | `strict:true` |
| Gemini | `AUTO` | `ANY` | `ANY` + `allowedFunctionNames` | `NONE` | `allowedFunctionNames` | — | `VALIDATED` mode |
| Mistral | `auto` | `any` / `required` | named | `none` | — | `parallel_tool_calls:false` | — |
| Cohere | (omit) | `REQUIRED` | — | `NONE` | — | — | `strict_tools:true` |
| Bedrock | `{"auto":{}}` | `{"any":{}}` | `{"tool":{"name"}}` (Claude, Nova) | — | — | — | `toolSpec.strict` |
| Ollama | default | — | — | — | — | — | — |
| vLLM | `auto` (needs parser flags) | `required` | named (structured outputs) | `none` | — | model-dependent | `strict` + `--tool-strict-level` |

\* Claude Opus 5.5, Sonnet 5.5, Fable 5.1, and Mythos 5.1 reject forced `any`/`tool` with a 400. Use `auto` + `strict: true` + a prompt instruction, or structured outputs.

## Key differences that bite

- **String vs object args.** OpenAI-style APIs return `arguments` as a JSON **string**: `json.loads` it, and expect it may be invalid. Anthropic, Gemini, Bedrock, and Ollama return an **object**. HF chat templates expect a **dict** in training data.
- **Where results go.** OpenAI uses a `tool` role; Anthropic and Bedrock use a **user** message holding result blocks; Gemini uses a `user` content with `functionResponse` parts; Ollama matches by **name**, not id.
- **Parallel results.** Anthropic: return *all* results in **one** user message, or the model learns to stop calling in parallel.
- **Error signaling.** Only Anthropic (`is_error`), Bedrock (`status`), and MCP (`isError`) have a flag. Elsewhere, put a structured error in the content ([Tool Output](best-practices-for-tool-output.md)).
- **Reasoning state.** Gemini 3 **thought signatures** and OpenAI reasoning items must be sent back unchanged with the tool results.
- **Strict schema rules.** OpenAI-style strict needs `additionalProperties:false` and every property in `required`; express optional fields as nullable.
- **Tool limits.** xAI: 350 tools max. Name length: OpenAI, Bedrock, and Fireworks 64 characters; Anthropic and MCP 128. Guidance: OpenAI fewer than 20 tools at the start of a turn; Gemini 10-20 active tools.

---

## OpenAI

Docs: [Function calling guide](https://developers.openai.com/api/docs/guides/function-calling) · [Chat Completions reference](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)

=== "Chat Completions"

    ```python
    import json
    from openai import OpenAI
    client = OpenAI()
    tools = [{"type": "function", "function": {
        "name": "get_weather", "description": "Get weather for a city.",
        "parameters": {"type": "object", "properties": {"city": {"type": "string"}},
                       "required": ["city"], "additionalProperties": False},
        "strict": True}}]
    r = client.chat.completions.create(model=MODEL, messages=msgs, tools=tools)
    msg = r.choices[0].message
    msgs.append(msg)
    for tc in msg.tool_calls or []:
        args = json.loads(tc.function.arguments)
        msgs.append({"role": "tool", "tool_call_id": tc.id, "content": json.dumps(get_weather(**args))})
    ```

=== "Responses API"

    ```python
    tools = [{"type": "function", "name": "get_weather", "description": "Get weather for a city.",
              "parameters": {...}, "strict": True}]
    r = client.responses.create(model=MODEL, input=inp, tools=tools)
    inp += r.output  # includes reasoning items: send them back
    for item in r.output:
        if item.type == "function_call":
            out = get_weather(**json.loads(item.arguments))
            inp.append({"type": "function_call_output", "call_id": item.call_id, "output": json.dumps(out)})
    r2 = client.responses.create(model=MODEL, input=inp, tools=tools)
    ```

Extras:

- **Custom (freeform) tools** constrained by a Lark or regex grammar return plain text instead of JSON.
- **Tool search** with `defer_loading: true`.
- **Namespaces**, built-in tools (web search, file search, code interpreter, remote MCP), and `allowed_tools`.
- Some of the newest models support tool calling **only through the Responses API**.

## Anthropic Claude

Docs: [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use)

```python
import anthropic, json
client = anthropic.Anthropic()
tools = [{"name": "get_weather", "description": "Get weather for a city.",
          "input_schema": {"type": "object", "properties": {"city": {"type": "string"}},
                           "required": ["city"], "additionalProperties": False},
          "strict": True,
          "input_examples": [{"city": "Tokyo"}]}]
r = client.messages.create(model="claude-opus-5-5", max_tokens=16000, tools=tools, messages=msgs)
msgs.append({"role": "assistant", "content": r.content})
if r.stop_reason == "tool_use":
    msgs.append({"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": b.id, "content": json.dumps(get_weather(**b.input))}
        for b in r.content if b.type == "tool_use"]})
```

Extras:

- Names match `^[a-zA-Z0-9_-]{1,128}$`.
- `input_examples` must validate against the schema.
- **Server tools**: web search, web fetch, code execution.
- **Tool search** (`tool_search_tool_regex` / `bm25`, with `defer_loading`).
- **Programmatic tool calling** (`allowed_callers`), the MCP connector, prompt caching of tool definitions, and the SDK **tool runner**.

## Google Gemini

Docs: [Function calling (generateContent)](https://ai.google.dev/gemini-api/docs/generate-content/function-calling) · [Interactions API](https://ai.google.dev/gemini-api/docs/function-calling) · [Thought signatures](https://ai.google.dev/gemini-api/docs/generate-content/thought-signatures) · [FunctionCallingConfig](https://ai.google.dev/api/caching#FunctionCallingConfig)

```python
from google import genai
from google.genai import types
client = genai.Client()
fd = types.FunctionDeclaration(name="get_weather", description="Get weather for a city.",
        parameters_json_schema={"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]})
cfg = types.GenerateContentConfig(
    tools=[types.Tool(function_declarations=[fd])],
    tool_config=types.ToolConfig(function_calling_config=types.FunctionCallingConfig(mode="AUTO")))
r = client.models.generate_content(model=MODEL, contents=contents, config=cfg)
contents.append(r.candidates[0].content)  # keep parts unchanged (thought signatures!)
parts = [types.Part.from_function_response(name=fc.name, response={"result": get_weather(**fc.args)})
         for fc in r.function_calls or []]
contents.append(types.Content(role="user", parts=parts))
```

Extras:

- Modes: `AUTO`, `ANY`, `NONE`, and `VALIDATED` (text allowed, but calls are schema-constrained).
- **Automatic function calling** in Python: pass the functions themselves.
- Parallel and compositional calls; MCP sessions can be passed as tools.
- Multimodal function responses (Gemini 3).
- The new **Interactions API** uses flat tools, `function_call` steps, and `function_result` items.

## Mistral

Docs: [Function calling](https://docs.mistral.ai/capabilities/function_calling/) · [Chat API](https://docs.mistral.ai/api/endpoint/chat)

OpenAI-style. `tool_choice` takes `auto`, `none`, `any`, `required`, or a named function; `parallel_tool_calls` is also supported. The tool message includes `name`. Tool call ids are 9 alphanumeric characters (this matters if you build training data in Mistral's format).

## Cohere

Docs: [Tool use overview](https://docs.cohere.com/v2/docs/tool-use-overview) · [Usage patterns](https://docs.cohere.com/v2/docs/tool-use-usage-patterns) · [Chat reference](https://docs.cohere.com/reference/chat)

- OpenAI-style tools; the response includes a `tool_plan` (the model's plan).
- Results are **documents** (`{"type":"document","document":{"data":...}}`) that power **citations**.
- `tool_choice` is `REQUIRED` or `NONE`; `strict_tools: true` enforces the schema.

## AWS Bedrock (Converse)

Docs: [Tool use](https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html) · [ToolSpecification](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ToolSpecification.html) · [ToolResultBlock](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ToolResultBlock.html)

```python
import boto3
br = boto3.client("bedrock-runtime")
r = br.converse(modelId=MODEL, messages=msgs, toolConfig={
    "tools": [{"toolSpec": {"name": "get_weather", "description": "...", "inputSchema": {"json": schema}}}],
    "toolChoice": {"auto": {}}})
if r["stopReason"] == "tool_use":
    m = r["output"]["message"]; msgs.append(m)
    msgs.append({"role": "user", "content": [
        {"toolResult": {"toolUseId": b["toolUse"]["toolUseId"],
                        "content": [{"json": get_weather(**b["toolUse"]["input"])}], "status": "success"}}
        for b in m["content"] if "toolUse" in b]})
```

The same Converse shape works across all the model families on Bedrock that support tools.

## Ollama

Docs: [Tool calling](https://docs.ollama.com/capabilities/tool-calling)

```python
from ollama import chat
r = chat(model="qwen3", messages=msgs, tools=[get_weather])  # plain Python functions work
msgs.append(r.message)
for tc in r.message.tool_calls or []:
    msgs.append({"role": "tool", "tool_name": tc.function.name,
                 "content": str(get_weather(**tc.function.arguments))})  # args are a dict
```

## vLLM and other OpenAI-compatible servers

Docs: [vLLM tool calling](https://docs.vllm.ai/en/latest/features/tool_calling.html)

- `--enable-auto-tool-choice --tool-call-parser <name>` turns on `auto`. Parsers include `hermes`, `mistral`, `llama3_json`, `llama4_pythonic`, `pythonic`, `xlam`, `granite`, `internlm`, `jamba`, `deepseek_v3`, `kimi_k2`, `glm45`, `qwen3_xml`, `openai`, and more. Use `--tool-parser-plugin` for a custom parser.
- `required` and named `tool_choice` use structured outputs. The docs warn: *a validly-parsable function call, not necessarily a high-quality one*.
- Other OpenAI-compatible APIs:
    - [Groq](https://console.groq.com/docs/tool-use)
    - [Together](https://docs.together.ai/docs/function-calling)
    - [Fireworks](https://docs.fireworks.ai/guides/function-calling)
    - [OpenRouter](https://openrouter.ai/docs/guides/features/tool-calling): normalizes tool calling across providers; send `tools` on every request.
    - [DeepSeek](https://api-docs.deepseek.com/guides/tool_calls): strict mode on the beta endpoint.
    - [xAI](https://docs.x.ai/docs/guides/function-calling): up to 350 tools.

## Open-model raw formats

What the model actually generates under the chat template. You need this when [fine-tuning](fine-tuning.md) or writing a parser. Docs: [transformers chat templates & tools](https://huggingface.co/docs/transformers/main/en/chat_extras) · [Llama 3.1 prompt format](https://dev.meta.ai/llama/docs/model-cards-and-prompt-formats/llama3_1)

| Family | Call format | Result format |
|---|---|---|
| Hermes / Qwen | `<tool_call>{"name": "fn", "arguments": {...}}</tool_call>` | `<tool_response>...</tool_response>` |
| Llama 3.1+ (custom tools) | `{"name": "fn", "parameters": {...}}` (note: `parameters`), ends with `<\|eom_id\|>` | `ipython` role |
| Llama 3.1+ (built-in tools) | `<\|python_tag\|>brave_search.call(query="...")` | `ipython` role |
| Mistral (tokenizer v11+) | `[TOOL_CALLS]fn[ARGS]{...}` | `[TOOL_RESULTS]...[/TOOL_RESULTS]` |
| Mistral (older) | `[TOOL_CALLS][{"name":..,"arguments":{..}}]` | `[TOOL_RESULTS]...[/TOOL_RESULTS]` |
| Pythonic (Llama 4, others) | `[get_weather(city="Oslo"), ...]` | template-specific |

In `transformers`, pass `tools=[fn or schema]` to `apply_chat_template`. The assistant `tool_calls[].function.arguments` must be a **dict**, and `transformers.utils.get_json_schema(fn)` builds a schema from a Google-style docstring.
