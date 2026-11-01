# Turn

A turn is one move by one role: user, assistant, or tool.

## 1. Single turn

In a single-turn conversation, the user prompts once, the model answers, and the user does not continue the conversation.

## 2. Multiple turns

In a multiple-turn conversation, the user prompts, the model answers, and the user continues with follow-up prompts. There should be at least 2 user prompts, with assistant responses in between.

## 3. Multi-turn state

- **Reuse earlier outputs**: if turn 3 refers to an ID from turn 1, use it; don't call the tool again.
- **Remember decisions**: keep what the user confirmed, chose, or rejected earlier. Don't ask again.
- **Re-fetch stale data**: if the state may have changed (stock, availability, order status), call the tool again.
- **Override**: a newer value from the user replaces the older one (_"Actually, Wednesday"_).
