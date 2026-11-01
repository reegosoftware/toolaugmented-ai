# FAQ

??? question "Is function calling the same as tool calling or tool use?"
    Yes. The terms differ by vendor; the mechanism is the same. See [What is Function Calling](concepts.md).

??? question "Does the model run my function?"
    No. It outputs a name and arguments. Your code runs the function and sends the result back ([Using Function Calling](usage.md)).

??? question "How many tools can I give a model?"
    Accuracy usually drops as the list grows, and cost rises with every tool definition. Keep about 20-30 relevant tools per request. Beyond that, use [tool search](function-pivoting-aka-tool-search.md) or split them across sub-agents. Provider hard limits are on [Providers Compared](providers.md).

??? question "Why does the model invent argument values?"
    Missing instructions to ask for unknown values, vague descriptions, or no enums. Fix the [schema](best-practices-for-schema.md) and the [system prompt](best-practices-for-system-instruction.md), and train on clarification examples ([Adversarial cases](adversarial-user-cases.md)).

??? question "Tool calling or structured outputs?"
    If you always want one JSON object, use structured outputs. If the model must decide what to do, use tools. See [Structured Outputs vs Tools](structured-outputs.md).

??? question "Can I use function calling with open-source models?"
    Yes. Use a model with a native tool template and serve it with a tool-call parser (vLLM, Ollama, TGI, llama.cpp). See [Fine-Tuning Guide § Using your model](fine-tuning.md#6-using-your-fine-tuned-model).

??? question "How much data do I need to fine-tune?"
    With a model that already supports tools, a few thousand high-quality, diverse samples often give large gains on your domain. Models trained from scratch on the format used tens of thousands or more (e.g. the 60k xLAM set). Diversity beats volume. See [The Recipe](recipe.md).

??? question "How do I know which model is best for my tools?"
    Run your own schema in the [toolcalling.ai workspace](https://app.toolcalling.ai/), check the community [leaderboard](https://toolcalling.ai/leaderboard) built from blind Arena votes, and see the public [benchmarks](benchmarks.md).

??? question "Is MCP a replacement for function calling?"
    No. MCP standardizes how tools are **discovered and served**. Underneath, the model still uses function calling ([MCP](mcp.md)).

??? question "How do I stop prompt injection through tool results?"
    You can't fully prevent it in the prompt. Limit what tools can do, require confirmation for risky actions, and treat outputs as data ([Security](security.md)).
