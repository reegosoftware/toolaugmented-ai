# Function Call

A function call is a request from the model to the calling system (the app using the LLM API) to run a function.

## 1. Single function call

The user's query requires exactly one function call.

> _"What is the weather like in Tokyo?"_

## 2. Multiple parallel function calls

The user's query requires several independent function calls, made at once.

> _"What is the weather like in Tokyo and Paris?"_

- Same tool, many args: _"Convert 10, 20, 30 USD to EUR"_ means 3 parallel calls, or 1 call if the parameter takes an array.

## 3. Multiple consecutive function calls

The user's query requires functions to be called in sequence, because a later call depends on an earlier call's output.

> _"Create an appointment for XYZ on day A or B."_
>> (First, the model needs to check XYZ's availability on day A and day B.)

- IDs and values must come from the earlier output; never invent them.

## 4. Parallel then consecutive

The model fans out lookups, compares the results, then acts.

> _"Find the cheapest of hotels A, B and C, and book it."_

## 5. Conditional call

The next call depends on a tool result.

> _"If it rains tomorrow, cancel my picnic booking."_

## 6. Loop / pagination

The model follows `next_page` (or a cursor) until done, and knows when to stop. It must not call again when the output hasn't changed.

## 7. Retry and fallback

- **Retry**: on a validation error, fix the args and retry once. Never loop forever.
- **Fallback**: if the primary tool fails, use an alternative tool or explain the failure.

## 8. Zero-argument call

A tool with no parameters is called with `{}`, e.g. `get_current_time()`.

## 9. No function call

The user's query does not require a function call. Either the query is answered from knowledge, or no available tool supports the action.

> _"What are the signs of the rain?"_

> _"Book me a flight."_ (no flight tool)
>> The model says it can't do this, and never invents a tool.
