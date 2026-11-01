# Glossary

Agent
:   A model running in a loop that chooses and calls tools until a goal is met.

AST match
:   An evaluation method that parses a predicted call and compares the function name and each argument with the expected one, allowing equivalent values.

Automatic function calling
:   An SDK feature that runs the tool loop for you when you pass real functions (e.g. the Gemini Python SDK, or the Anthropic tool runner).

Chat template
:   The model-specific text format (often Jinja) that turns `messages` + `tools` into tokens. Training and serving must use the same one.

Constrained decoding
:   Restricting token sampling to a grammar or JSON Schema so that output always parses. It powers strict mode.

Distractor tool
:   A plausible but wrong tool included in training or eval to test selection.

Function calling
:   See *Tool calling*.

Irrelevance detection
:   Correctly making **no** call when no tool fits.

MCP
:   [Model Context Protocol](mcp.md): an open standard for exposing tools, resources, and prompts to LLM clients.

Multi-turn
:   A conversation with more than one user message ([Turn](turn.md)).

Parallel calls
:   Several independent tool calls emitted in one assistant turn.

Consecutive (sequential) calls
:   Calls where a later one depends on an earlier result ([Function Call](function-call.md)).

Programmatic tool calling
:   The model writes code that calls tools inside a sandbox, instead of one call per model turn.

Server / built-in tool
:   A tool executed by the provider (web search, code execution, file search).

Strict mode
:   A provider option that guarantees arguments conform to the schema.

Tool calling / tool use
:   The model emitting a structured request (name + arguments) for the application to run.

`tool_choice`
:   Request parameter controlling whether the model may, must, or must not call tools.

Tool result
:   The application's response to a tool call, linked by the call id.

Tool search / pivoting
:   Retrieving the relevant tools at runtime from a large set ([Tool Search](function-pivoting-aka-tool-search.md)).

Trajectory
:   The full sequence of messages, calls, and results for one task. It's the unit of training data for agents.
