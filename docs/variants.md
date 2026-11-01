# Variants

Create 4-5 variants from each original task.

## To create variants:

### Variant with system instructions:

Slightly change the system prompt to a variant scenario.

- Behavioral: include a different kind of behavior, e.g. the assistant should be concise, the assistant should be kind, etc.
- Data related: change a data value such as a date, name, email, or phone number.
- Policy related: change a default, a confirmation rule, or the user's role.

### Variant with user persona:

Use exactly the same schema and system prompt, but change the user's behavior.

- Users may have different personas, e.g. a user may hold back some information, or provide it all at once.

### Variant with JSON schema:

Slightly change the JSON schema while keeping the rest the same.

- Update the JSON schema with competing or mixed functions (if the original includes 3 functions, the variant might include 5-6).
- Rename tools, reorder params, or change the param style, keeping the same intent, so the model doesn't overfit on names.

### Variant with adversarial cases:

Unhappy cases, where the assistant can't fulfill the request at once, gives up, fails gracefully, or recovers from failure.

### Variant with tool results:

Keep the conversation the same, but change the tool result: empty, partial failure, error with hint, timeout, or huge output.

### Variant with noisy user prompt:

Users may ask for the same thing with different wording and/or noisy data.

- Some users might be toxic
- Some users might use slang
- Some developers might include the user prompt in JSON/HTML format
- Some users might be verbose
- Some users might use shortcuts, e.g. _"properties.color = red"_ instead of _"give me red products"_
- Some users might write in another language, or mix languages
