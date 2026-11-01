# Best Practices

## 1. Enums

- Use either `enum`s or the options mentioned in descriptions as much as possible.

## 2. Function descriptions

- Always include the function description within the function definition, for consistency.

## 3. Parameters
- **Clear parameter definitions**:
    - Specify whether parameters like `max_length` refer to the number of characters, words, or sentences. This prevents ambiguity and makes clear how to use the function.

- **Consistent default parameters**:
    - Ensure default parameter values are consistent across the system. For example, if the default limit for retrieving news is 5, this should be reflected in all system prompts and documentation.
    - In short, do not assume any default parameter. If something should have a default value, include it in the system prompt, in the field description, or as a `default` field in the parameter.

## 4. Pick a clear scenario

- The role of the user talking with the AI assistant must be clear. They could be an end-user (such as a guest renting a hotel room through the system), a manager, a staff member, etc. The functions included must take the user's role into account: if the user is an end-user in a booking system, you MUST NOT include functions for operations the user couldn't reasonably perform, like cancelling another user's booking.

## 5. Consistent naming standards

- Functions are commonly named with a verb and a noun, such as `get_reservations`, `createUser`, `get_compliance`, `add_task`, etc. This standard isn't mandatory, but follow it unless you have a good reason not to.
- Pick one case (PascalCase, camelCase, snake_case, etc.) and stick with it, so the whole system is consistent.

## 6. Safety

- Confirm before destructive or irreversible actions (delete, pay, send).
- Make write tools idempotent, e.g. with a `request_id`, so a repeated message can't run an action twice.
- Least privilege: don't call more tools than the task needs.
