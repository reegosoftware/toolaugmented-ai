# Tool Augmented AI

## Try it live: [toolcalling.ai](https://toolcalling.ai/)

> **Don't just read about function calling. Run it.**
>
> Bring your JSON schema and a prompt, run a real function call, and see which tools the model picks and with which arguments. Then **vote** on the best response, and help everyone see which models really get tool calling right.
>
> **[Run a function call and vote at toolcalling.ai →](https://toolcalling.ai/)**

- **Test your schema**: catch vague descriptions, missing enums, and guessed defaults before your users do.
- **Compare models**: single, parallel, consecutive, and no-call cases, side by side.
- **Vote**: your votes shape a community view of which models handle tool calling best.

---

## Function/Tool Calling

Augmenting Large Language Models (LLMs) with Function Calls is a crucial technique that enables the integration of diverse data sources and enhances their performance. This process involves converting unstructured or noisy input data, such as natural language text, web pages, or even sensor readings, into structured formats like JSON.

## Recipe at a glance

1. **Scenario**: pick a domain and the user's role. Expose only the tools that role may use ([Best Practices](best-practices.md)).
2. **Schema**: write 3-8 tools, plus 2-5 similar **distractor** tools ([Schema](best-practices-for-schema.md)).
3. **System prompt**: tone, policies, defaults, confirmation rules, and out-of-scope behavior ([System Instruction](best-practices-for-system-instruction.md)).
4. **Seed conversations**: one per combination of the taxonomies below.
5. **Variants**: 4-5 per seed ([Variants](variants.md)).
6. **Validate**: run the quality gates, balance the mix, and deduplicate ([Training Data](best-practices-for-training-data.md)).
7. **Evaluate** per slice, on held-out unseen tools. Turn the failures into new seeds ([Evaluation](evaluation.md)).
8. **Try it live**: run your schema at [toolcalling.ai](https://toolcalling.ai/) and vote for the best responses.

## Fine Tuning a Model for Function Calling
To train a model to have Tool Calling capability, it's a best practice to cover the conversation examples with the taxonomies/domains below.

### 1. Turn
- `single turn`: The user asks only one question and leaves the conversation.
- `multiple turns`: The user asks follow-up questions; there's back and forth between the user and the assistant.

### 2. Function Call
- `single call`: The user asks a question that requires only one function call.
- `multiple parallel calls`: The user asks a question that requires several independent function calls at once.
- `multiple consecutive calls`: The user asks a question that requires function calls in sequence, where a later call depends on an earlier output.
- `no call`: The user asks a question that doesn't require a function call, or that no available function supports.
- Advanced: conditional calls, loops/pagination, retry, fallback, and cross-turn reuse ([Function Call](function-call.md)).

### 3. Adversarial User Cases
- _Missing information_
- _Happy path_ vs _Unhappy path_
- _User cancels request_
- _User changes params_
- _User asks params_
- _User rejects providing params_
- _Recover from failure_
- _System pivoting_
- _Toxic user_
- _Noisy input_
- _Conflicting info_, _Multi-intent_, _Out-of-role request_
- _Prompt injection_ from the user or from a tool output
- _Destructive actions_ and _duplicate requests_

### 4. Tool Results
- _Success_, _Empty_, _Partial failure_, _Error with hint_, _Timeout / rate limit_, _Huge output_ ([Tool Output](best-practices-for-tool-output.md))

### 5. Major Domains:
- **Data Extraction**: Noisy natural language to JSON, where the data is hidden in a large amount of unstructured text.
- **Web Scraping**: HTML/XML to JSON
- **Business and Sales**
- **Finance**
- **Education**
- **Healthcare**: Diagnose diseases and generate treatment plans.
- **Text Analysis**: Sentiment analysis, entity extraction, and text classification
