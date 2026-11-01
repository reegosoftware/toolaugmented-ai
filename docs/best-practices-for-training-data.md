# Best Practices for Training Data

How to write each training sample. For **what** to cover (coverage matrix, edge cases, dataset mix, quality gates), see [The Recipe](recipe.md). For training itself, see the [Fine-Tuning Guide](fine-tuning.md).

## 1. Plan before acting

- Before multi-step calls, the assistant writes a **short plan** (the "preceding text"). It keeps the model from losing track of the next action.
- Between sequential calls, add brief logical connections: _"Dr. Lee is free on Tuesday at 10:00. I'll book that."_
- Keep plans short and factual. They are part of the training target.

## 2. Write realistic tool outputs

- **Structured, not prose** ([Tool Output](best-practices-for-tool-output.md)).
- **Consistent across turns**: the same ids, prices, and states everywhere in the conversation.
- **Errors carry hints**, so the next assistant turn can show the recovery.
- Vary them: empty, partial, large, slow, and failing results all occur in production.

## 3. Write grounded assistant turns

- Every argument value comes from the **user**, the **system prompt**, or an **earlier tool result**. Never from nowhere.
- Final answers **interpret** the results (compare, summarize, format) instead of repeating JSON.
- Follow the system prompt's tone and policies in every turn, including the failure turns.

## 4. Keep the format exact

- Every tool call has a unique id, and exactly one result with the same id follows it.
- The arguments validate against the schema.
- Use the same message format your training framework and chat template expect ([Fine-Tuning § Data format](fine-tuning.md#3-data-format)).

## 5. Sample: multi-turn with clarification and consecutive calls

```json
{
  "tools": [
    {"name": "find_slots", "description": "Find free appointment slots for a doctor on a date.", "parameters": {"type": "object", "properties": {"doctor_id": {"type": "string"}, "date": {"type": "string", "format": "date"}}, "required": ["doctor_id", "date"]}},
    {"name": "book_slot", "description": "Book a slot. Irreversible: confirm with the user first.", "parameters": {"type": "object", "properties": {"slot_id": {"type": "string"}}, "required": ["slot_id"]}},
    {"name": "list_doctors", "description": "List doctors in a department.", "parameters": {"type": "object", "properties": {"department": {"type": "string", "enum": ["cardiology", "dermatology", "pediatrics"]}}, "required": ["department"]}}
  ],
  "messages": [
    {"role": "system", "content": "You are a clinic booking assistant. Today is 2026-11-02 (Monday). Confirm before booking."},
    {"role": "user", "content": "I need an appointment on Tuesday or Wednesday."},
    {"role": "assistant", "content": "Sure. Which department is it for: cardiology, dermatology or pediatrics?"},
    {"role": "user", "content": "dermatology"},
    {"role": "assistant", "content": "Let me find the dermatologists first.", "tool_calls": [{"id": "c1", "name": "list_doctors", "arguments": {"department": "dermatology"}}]},
    {"role": "tool", "tool_call_id": "c1", "content": {"doctors": [{"id": "d7", "name": "Dr. Lee"}]}},
    {"role": "assistant", "content": "Dr. Lee is available in dermatology. Checking Tuesday and Wednesday.", "tool_calls": [
      {"id": "c2", "name": "find_slots", "arguments": {"doctor_id": "d7", "date": "2026-11-03"}},
      {"id": "c3", "name": "find_slots", "arguments": {"doctor_id": "d7", "date": "2026-11-04"}}
    ]},
    {"role": "tool", "tool_call_id": "c2", "content": {"slots": []}},
    {"role": "tool", "tool_call_id": "c3", "content": {"slots": [{"slot_id": "s42", "time": "10:00"}, {"slot_id": "s43", "time": "15:30"}]}},
    {"role": "assistant", "content": "Dr. Lee has no openings on Tuesday. On Wednesday, Nov 4, there are 10:00 and 15:30. Which one should I book?"},
    {"role": "user", "content": "10 please"},
    {"role": "assistant", "content": "Booking Wednesday 10:00 with Dr. Lee.", "tool_calls": [{"id": "c4", "name": "book_slot", "arguments": {"slot_id": "s42"}}]},
    {"role": "tool", "tool_call_id": "c4", "content": {"status": "OK", "booking_id": "B-9013"}},
    {"role": "assistant", "content": "Done. You're booked with Dr. Lee on Wednesday, Nov 4 at 10:00 (booking B-9013)."}
  ]
}
```

What this sample teaches:

- Asking for a missing parameter, one value at a time.
- A consecutive call: the doctor's id from `list_doctors` feeds `find_slots`.
- Parallel calls for the two days.
- Handling an empty result.
- Taking the user's choice as the confirmation.
- A grounded final answer.

!!! note "Tool content format"
    Tool results are shown as objects for readability. Most chat templates expect them as **strings**: serialize them with `json.dumps` when you build the dataset.
