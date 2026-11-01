# Function Pivoting aka Tool Search

## 1. Pivoting a function

JSON Schema pivoting means having one Tool Search function that searches within the tools and outputs the most relevant one, so that the model can call that function next.

### Benefit:

- Picking the right function is under your control instead of the LLM's.

- When there are many functions, you don't need to send them all. This saves a significant number of tokens and reduces cost.

### Drawback:

- Every request needs at least 2 function calls, so there is always extra delay.
- Your app, rather than the LLM, decides which function fits. LLMs are usually better at choosing the correct function with the correct parameters.
- Many LLMs are not trained this way, so this approach is experimental.

## 2. Large toolsets

- Train with long tool lists (50-1000+) so that selection holds up at scale.
- Include samples where `search_tools` returns several candidates, or none.

## 3. Distractor tools

- Add near-duplicates such as `get_user`, `get_users`, and `search_user`. The model must choose by the description, not by the name.
- Rename tools across variants so the model doesn't overfit on names.
