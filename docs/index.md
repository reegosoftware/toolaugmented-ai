---
title: Function Calling / Tool Calling Reference
---

# Tool Augmented AI

**Everything about function calling, aka tool calling, aka tool use, in one place.** How it works, how to use it with every major provider, how to build training data, how to fine-tune a model for it, and how to evaluate it.

!!! tip "Try it live: [toolcalling.ai](https://toolcalling.ai/)"

    **Don't just read about function calling. Run it.**

    Bring your JSON schema and a prompt, run a real function call, and see which tools the model picks and with which arguments. Then go to the **Arena**: two anonymous models answer the same tool-calling task, and you **vote** for the better one. Every blind vote feeds the community **leaderboard** of which models really get tool calling right.

    [:material-rocket-launch: Open the workspace](https://app.toolcalling.ai/){ .md-button .md-button--primary }
    [:material-sword-cross: Vote in the Arena](https://app.toolcalling.ai/arena){ .md-button }
    [:material-trophy: Leaderboard](https://toolcalling.ai/leaderboard){ .md-button }

    - **Workspace**: build and debug function calls; catch vague descriptions, missing enums, and guessed defaults before your users do.
    - **Arena**: blind, pairwise comparison of models on real tool-calling tasks.
    - **Leaderboard**: models ranked by community votes. Free to start.

## Start here

<div class="grid cards" markdown>

-   :material-school: **Learn**

    ---

    What function calling is, the request/response loop, and how every provider differs.

    [What is Function Calling](concepts.md) · [Using it](usage.md) · [Providers](providers.md) · [MCP](mcp.md)

-   :material-database-cog: **Build training data**

    ---

    The end-to-end recipe: coverage matrix, every edge and advanced case, dataset mix, quality gates.

    [The Recipe](recipe.md) · [Training Data](best-practices-for-training-data.md)

-   :material-tune: **Fine-tune and serve**

    ---

    Chat templates, loss masking, LoRA, DPO/RL, then serving your model with tool parsing.

    [Fine-Tuning Guide](fine-tuning.md)

-   :material-chart-bar: **Evaluate and benchmark**

    ---

    Metrics, offline benchmarks, and live head-to-head voting at toolcalling.ai.

    [Evaluation](evaluation.md) · [Benchmarks](benchmarks.md)

</div>

## What is function calling?

Function calling connects a language model to the outside world: live data, APIs, databases, and actions. The model reads the user's message, chooses a function, and fills in its arguments as JSON. It can also turn unstructured or noisy input (natural language, web pages, documents) into structured data. The model **never runs the function itself**: it proposes a call, your code runs it, and the model uses the result. See [What is Function Calling](concepts.md).

## Recipe at a glance

1. **Scenario**: pick a domain and the user's role. Expose only the tools that role may use ([Best Practices](best-practices.md)).
2. **Schema**: write 3-8 tools, plus 2-5 similar **distractor** tools ([Schema](best-practices-for-schema.md)).
3. **System prompt**: tone, policies, defaults, confirmation rules, and out-of-scope behavior ([System Instruction](best-practices-for-system-instruction.md)).
4. **Seed conversations**: one per combination of the taxonomies below ([The Recipe](recipe.md)).
5. **Variants**: 4-5 per seed ([Variants](variants.md)).
6. **Validate**: run the quality gates, balance the mix, and deduplicate ([Training Data](best-practices-for-training-data.md)).
7. **Fine-tune and serve** ([Fine-Tuning Guide](fine-tuning.md)).
8. **Evaluate** per slice, on held-out unseen tools ([Evaluation](evaluation.md)), and benchmark live at [toolcalling.ai](https://toolcalling.ai/).

## Dataset taxonomy

To train a model for tool calling, cover every value of each taxonomy below in your conversation examples. [The Recipe](recipe.md) turns this into a coverage matrix.

### 1. Turn
- `single turn`: one user message, one final answer.
- `multiple turns`: follow-up questions and back-and-forth ([Turn](turn.md)).

### 2. Function Call
- `single call`: exactly one function call.
- `multiple parallel calls`: several independent calls at once.
- `multiple consecutive calls`: calls in sequence; a later one depends on an earlier result.
- `no call`: nothing to call, or no tool supports the request.
- Advanced: conditional calls, loops/pagination, retry, fallback, and cross-turn reuse ([Function Call](function-call.md)).

### 3. Adversarial User Cases ([details](adversarial-user-cases.md))
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

### 5. Major Domains
- **Data Extraction**: noisy natural language to JSON, where the data is buried in unstructured text.
- **Web Scraping**: HTML/XML to JSON
- **Business and Sales**
- **Finance**
- **Education**
- **Healthcare**: scheduling, records lookup, triage support.
- **Text Analysis**: sentiment analysis, entity extraction, text classification
- **Developer tools**: code search, CI, ticketing, databases
- **Personal assistant**: calendar, email, travel, smart home
