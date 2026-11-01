# Benchmarks

!!! tip "The benchmark that uses *your* tools: [toolcalling.ai](https://toolcalling.ai/)"
    Static benchmarks can't tell you how a model handles your schema, your users, and your edge cases. At [toolcalling.ai](https://toolcalling.ai/), two anonymous models answer the same real tool-calling task in the **Arena** and you vote for the better one. The blind pairwise votes build a live, real-world **leaderboard**.

    [:material-sword-cross: Vote in the Arena](https://app.toolcalling.ai/arena){ .md-button .md-button--primary }
    [:material-trophy: See the leaderboard](https://toolcalling.ai/leaderboard){ .md-button }

## Public benchmarks

*Links checked 2026-11-01.*

### Function calling

| Benchmark | Measures |
|---|---|
| [BFCL V4](https://gorilla.cs.berkeley.edu/leaderboard.html) (Berkeley Function Calling Leaderboard) · [code](https://github.com/ShishirPatil/gorilla/tree/main/berkeley-function-call-leaderboard) · [data](https://huggingface.co/datasets/gorilla-llm/Berkeley-Function-Calling-Leaderboard) · [paper](https://proceedings.mlr.press/v267/patil25a.html) | The de facto standard: AST-checked single and parallel calls, multi-turn stateful calls, irrelevance/abstention, and agentic tasks (web search, memory, format sensitivity). [V3 blog](https://gorilla.cs.berkeley.edu/blogs/13_bfcl_v3_multi_turn.html) · [V4 blog](https://gorilla.cs.berkeley.edu/blogs/15_bfcl_v4_web_search.html) |
| [Nexus Function Calling Leaderboard](https://huggingface.co/spaces/Nexusflow/Nexus_Function_Calling_Leaderboard) | Zero-shot calls to real-world APIs |
| [NESTFUL](https://github.com/IBM/NESTFUL) | Nested call sequences where one call's output feeds the next |
| [ComplexFuncBench](https://github.com/zai-org/ComplexFuncBench) | Multi-step, constrained calls with long context |
| [ACEBench](https://github.com/ACEBench/ACEBench) | Normal, special (incomplete or ill-formed requests), and agent cases; EN/ZH |
| [When2Call](https://github.com/NVIDIA/When2Call) | Deciding between call, ask a follow-up, or say it can't answer |
| [HammerBench](https://github.com/MadeAgents/HammerBench) | Fine-grained function calling in mobile-assistant scenarios |
| [Seal-Tools](https://github.com/fairyshine/Seal-Tools) | Self-instruct tools, including nested calls |
| [T-Eval](https://github.com/open-compass/T-Eval) | Step-by-step: instruct, plan, reason, retrieve, understand, review |
| [API-Bank](https://github.com/AlibabaResearch/DAMO-ConvAI/tree/main/api-bank) | 73 runnable APIs in dialogue: planning, retrieval, calling |
| [ToolHop](https://arxiv.org/abs/2501.02506) | Multi-hop tool use |

### Agentic / multi-turn

| Benchmark | Measures |
|---|---|
| [τ-bench](https://github.com/sierra-research/tau-bench) · [τ²-bench](https://github.com/sierra-research/tau2-bench) · [τ³-bench](https://sierra.ai/resources/research/tau-3-bench) · [leaderboard](https://taubench.com) | Agent + simulated user + tools + domain policies (retail, airline, telecom). Reports **pass^k** reliability |
| [ToolSandbox](https://github.com/apple/ToolSandbox) | Stateful, conversational, interactive evaluation |
| [ToolBench / ToolEval](https://github.com/OpenBMB/ToolBench) · [StableToolBench](https://github.com/THUNLP-MT/StableToolBench) | 16k+ real APIs, pass/win rate; StableToolBench makes it reproducible |
| [TaskBench](https://github.com/microsoft/JARVIS/tree/main/taskbench) | Tool-graph task decomposition and calling |
| [AgentBench](https://github.com/THUDM/AgentBench) | Broad agent evaluation across 8 environments |

### MCP

| Benchmark | Measures |
|---|---|
| [MCP-Atlas](https://labs.scale.com/papers/mcpatlas) · [leaderboard](https://labs.scale.com/leaderboard/mcp_atlas) | 36 real MCP servers, 220 tools, 1,000 tasks |
| [MCP-Bench](https://github.com/Accenture/mcp-bench) | 28 live servers, ~250 tools, multi-server planning |
| [MCP-Universe](https://github.com/SalesforceAIResearch/MCP-Universe) · [site](https://mcp-universe.github.io) | Real servers across maps, finance, browser, repos, and more |
| [MCPMark](https://github.com/eval-sys/mcpmark) · [leaderboard](https://mcpmark.ai) | Realistic create/read/update/delete workflows (Notion, GitHub, Postgres, Playwright, filesystem) |
| [LiveMCPBench](https://github.com/icip-cas/LiveMCPBench) | Navigating a large pool of MCP tools |

## General-purpose leaderboards (secondary)

These rank models on general chat, coding, or vision preference, **not** on tool calling specifically. They're useful context when choosing a base model.

| Leaderboard | Notes |
|---|---|
| [LMArena (now Arena)](https://arena.ai/leaderboard) | Large-scale blind pairwise human votes on general prompts. Formerly Chatbot Arena; renamed Arena in January 2026 ([announcement](https://arena.ai/blog/lmarena-is-now-arena/)) |

For tool calling, prefer the function-calling and agentic benchmarks above and the [toolcalling.ai leaderboard](https://toolcalling.ai/leaderboard).

## Reading benchmark results

- **Match the benchmark to your use.** Single-call AST scores say little about 20-step agents, and the reverse is true too.
- **Look at the sub-scores**: irrelevance, multi-turn, and long context often differ far more than the overall score.
- **pass^k beats pass@1** for production: users don't retry.
- **Contamination**: public test sets leak into training data. Keep a private eval ([Evaluation](evaluation.md)).
- **Format sensitivity**: the same model scores differently with prompt-based vs native tool calling.
- **Then validate on your own tools** in the [toolcalling.ai workspace](https://app.toolcalling.ai/), and check the [community leaderboard](https://toolcalling.ai/leaderboard).
