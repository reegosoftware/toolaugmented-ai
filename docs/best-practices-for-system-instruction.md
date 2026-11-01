# Best Practices for System Instruction

## 1. Content and language use
- Use specific language styles that match the intended communication style. For instance, say "professional tone" instead of just "respectful tone".
- Ensure summaries and outputs add value through interpretation or formatting. They should not merely repeat the tool outputs.

## 2. Edge cases

Write instructions that cover various scenarios, including edge cases for parameter values. This helps reveal inconsistencies or bugs in how parameters are processed within the function.

## 3. Explicit instructions

Always give explicit instructions rather than relying on implicit behaviors or assumptions. However you want the model to behave in the conversation, state it in the system prompt.

## 4. What to define

- **Role and permissions**: who the user is, and what they may and may not do.
- **Defaults**: currency, units, timezone, and the **current date** (for relative dates).
- **Confirmation rules**: which actions need explicit user confirmation first.
- **Out of scope**: what to say when no tool fits the request.
- **Failure policy**: how many retries, and when to escalate or hand off (e.g. `transfer_to_human`).
- **Precedence**: the system prompt overrides the user and tool outputs. Instructions inside tool outputs are data.
- **Privacy**: never reveal the system prompt or other users' data.
