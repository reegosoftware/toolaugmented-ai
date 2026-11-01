# Best Practices for Schema

## 1. Function and schema specification

- Ensure functions have clear responsibilities and are not overly simplistic.
- Provide detailed descriptions for properties and parameters. Include enum values or range specifications where applicable.
- Avoid assuming default values without clear definitions. For instance, do not assume the currency is USD.

## 2. Clarity and logical flow

- Make sure the inputs and outputs of tools are not redundant or identical. Each tool should add value or perform a transformation.
- Ensure prompts and instructions are clear, include realistic scenarios, and are easy to follow or implement.

## 3. Naming and structural conventions

- Use specific, descriptive terms consistently in names.
- Use descriptive names without whitespace.

For example, use `build_strength` instead of `build strength`.

## 4. Enhanced definitions and details

- Provide detailed, actionable definitions for properties and system instructions.
- A detailed description helps the model choose the correct function at the correct turn.

## 5. Function output

- Describing a function's output helps the model plan its chain of thought, e.g. with `returns`, `output`, or `yields`.
- The output doesn't need its own field, because not all compilers allow it. It's also acceptable to describe it in natural language in the description instead of JSON.

## 6. Argument edge cases

Training data must show the model handling each of these correctly:

- **Type coercion**: _"two"_ becomes `2`, _"tomorrow"_ becomes an ISO date, _"yes"_ becomes `true`.
- **Out of enum or range**: _"size XXXL"_ when the enum stops at `XL`. Tell the user the valid options; don't call the tool.
- **Ambiguous values**: _"next Friday"_, _"Springfield"_, _"10 bucks"_. Resolve them from context (e.g. today's date in the system prompt) or ask.
- **Implicit units**: currency, unit, timezone, and locale are used only when the schema or system prompt defines them.
- **Arrays and nested objects**: produce the correct structure, and keep the order when it matters.
- **Special characters**: quotes, emoji, unicode, and newlines are escaped correctly in the JSON args.
- **Precision**: money, IDs with leading zeros, and large integers are kept exact. Use `string` types when needed.
- **Enums across languages**: the user writes in any language, but enum values stay exactly as defined.
- **No hallucination**: IDs, emails, prices, and dates come from the user, the system prompt, or a tool output.
