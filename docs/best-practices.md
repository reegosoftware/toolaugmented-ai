# General Best Practices

The rules that matter most, whether you call a hosted API or train your own model. The details are on [Schema](best-practices-for-schema.md), [System Instruction](best-practices-for-system-instruction.md), and [Tool Output](best-practices-for-tool-output.md).

## 1. Start from a clear scenario and role

Decide **who** the user is: a guest, a staff member, a manager, an admin. Expose only the tools that role may use. A hotel guest's assistant must not have `cancel_any_booking`, even if the backend would block it. A tool the model can see is a tool it can be talked into calling.

## 2. Design tools around tasks

- **One clear responsibility per tool.** Not so granular that every task needs five calls, not so broad that one tool takes a `mode` switch with ten behaviors.
- **Inputs and outputs must not duplicate each other.** Every tool should add information or perform an action.
- **Keep the set small.** Around 20-30 tools in context at most; beyond that, use [tool search](function-pivoting-aka-tool-search.md).
- **Group similar operations** (`search_orders` with filters) instead of many near-copies (`search_orders_by_date`, `search_orders_by_status`, ...).

## 3. Write descriptions for the model

The model chooses tools by reading their descriptions, so each one should state:

- **What** the tool does and **what it returns**.
- **When to use it**, and **when not to** (especially next to a similar tool).
- **Constraints**: limits, units, formats, side effects (_"Charges the card. Ask for confirmation first."_).

## 4. Make parameters unambiguous

- Use **`enum`s** wherever the values are a fixed set.
- **State units and formats**: does `max_length` mean characters, words, or sentences? Is `date` ISO 8601? Which timezone?
- **Never leave defaults implicit.** If something has a default, put it in the schema (`default`), the description, or the system prompt, and keep it **identical** everywhere. If the news tool returns 5 items by default, every prompt and doc must say 5.
- Mark only the truly required fields as **`required`**.

## 5. Name consistently

- Use a **verb + noun** (`get_reservations`, `create_user`, `cancel_order`) unless you have a reason not to.
- Pick **one case** (snake_case, camelCase, ...) and use it for every tool and parameter.
- No whitespace or special characters in names: `build_strength`, not `build strength`. Check your provider's name limits ([Providers](providers.md#key-differences-that-bite)).

## 6. Return structured results and helpful errors

Results are for the model, not the user: concise key-value data, enums, numbers. Errors say **what** went wrong and **how to fix it**. See [Tool Output](best-practices-for-tool-output.md).

## 7. Build in safety

- **Confirm** before destructive or irreversible actions (delete, pay, send).
- Make write tools **idempotent** (e.g. a `request_id`), so a repeated message can't run an action twice.
- **Least privilege**: tools run with the user's permissions and the model calls only what the task needs. See [Security](security.md).

## 8. Test with real conversations

Run the [adversarial cases](adversarial-user-cases.md) against your tools before users do. The [toolcalling.ai workspace](https://app.toolcalling.ai/) makes this quick. Then measure it with an [evaluation](evaluation.md).
