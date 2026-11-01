# Function Pivoting aka Tool Search

## 1. Pivoting a function

JSON Schema pivoting means having one Tool Search function that searches within the tools and outputs the most relevant one, so that the model can call that function next.

### Benefit:

- Picking the right function is under your control instead of the LLM's.

- When there are many functions, you don't need to send them all. This saves a significant number of tokens and reduces cost.

### Drawback:

- Every request needs at least 2 function calls, so there is always extra delay.
- Your app, rather than the LLM, decides which function fits. LLMs are usually better at choosing the correct function with the correct parameters.
- Models not trained on this pattern may handle it poorly. Several providers now offer it natively (see below), which reduces this risk.

## 2. Large toolsets

- Train with long tool lists (50-1000+) so that selection holds up at scale.
- Include samples where `search_tools` returns several candidates, or none.

## 3. Distractor tools

- Add near-duplicates such as `get_user`, `get_users`, and `search_user`. The model must choose by the description, not by the name.
- Rename tools across variants so the model doesn't overfit on names.

## 4. Native tool search

Some providers now do this for you: mark tools as deferred and let the model search for them.

- **Anthropic**: `tool_search_tool_regex` / `tool_search_tool_bm25` server tools, plus `defer_loading: true` on the other tools ([docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)).
- **OpenAI Responses**: a `tool_search` tool plus `defer_loading: true`, and `namespace` groups ([docs](https://developers.openai.com/api/docs/guides/function-calling)).
- **Your own**: embed the tool descriptions, retrieve the top-k for each user turn, and send only those. Evaluate retrieval recall separately from call accuracy.

See [Providers Compared](providers.md).
