# Links & Datasets

Everything worth bookmarking about function calling. *Links checked 2026-11-01.* For benchmarks, see [Benchmarks](benchmarks.md). To try models live, go to **[toolcalling.ai](https://toolcalling.ai/)**.

## Official docs

| Provider | Link |
|---|---|
| OpenAI | [Function calling](https://developers.openai.com/api/docs/guides/function-calling) |
| Anthropic | [Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) |
| Google Gemini | [Function calling](https://ai.google.dev/gemini-api/docs/function-calling) · [generateContent](https://ai.google.dev/gemini-api/docs/generate-content/function-calling) |
| Mistral | [Function calling](https://docs.mistral.ai/capabilities/function_calling/) |
| Cohere | [Tool use](https://docs.cohere.com/v2/docs/tool-use-overview) |
| AWS Bedrock | [Tool use](https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html) |
| Ollama | [Tool calling](https://docs.ollama.com/capabilities/tool-calling) |
| vLLM | [Tool calling](https://docs.vllm.ai/en/latest/features/tool_calling.html) |
| Hugging Face | [Chat templates & tools](https://huggingface.co/docs/transformers/chat_extras) |
| MCP | [Specification](https://modelcontextprotocol.io/specification/latest) · [SDKs](https://modelcontextprotocol.io/docs/sdk) · [Announcement](https://www.anthropic.com/news/model-context-protocol) |

More providers on [Providers Compared](providers.md).

## Training datasets

| Dataset | Content | License |
|---|---|---|
| [xlam-function-calling-60k](https://huggingface.co/datasets/Salesforce/xlam-function-calling-60k) (APIGen) | 60k verified query/tools/answer triples, 3,673 APIs | CC-BY-4.0, gated |
| [APIGen-MT-5k](https://huggingface.co/datasets/Salesforce/APIGen-MT-5k) | 5k multi-turn agent trajectories | CC-BY-NC-4.0 |
| [glaive-function-calling-v2](https://huggingface.co/datasets/glaiveai/glaive-function-calling-v2) | ~113k synthetic single- and multi-turn chats | Apache-2.0 |
| [hermes-function-calling-v1](https://huggingface.co/datasets/NousResearch/hermes-function-calling-v1) | Hermes `<tool_call>` format + JSON mode | Apache-2.0 |
| [hermes_reasoning_tool_use](https://huggingface.co/datasets/interstellarninja/hermes_reasoning_tool_use) | Tool use with reasoning traces | Apache-2.0 |
| [ToolACE](https://huggingface.co/datasets/Team-ACE/ToolACE) | ~11k dialogues over 26k synthesized APIs | Apache-2.0 |
| [Toucan-1.5M](https://huggingface.co/datasets/Agent-Ark/Toucan-1.5M) | 1.5M trajectories from real MCP servers | Apache-2.0 |
| [When2Call](https://huggingface.co/datasets/nvidia/When2Call) | Call / ask / refuse decisions | CC-BY-4.0 |
| [xlam-irrelevance-7.5k](https://huggingface.co/datasets/MadeAgents/xlam-irrelevance-7.5k) | No-call (irrelevance) examples | CC-BY-4.0 |
| [argilla/apigen-function-calling](https://huggingface.co/datasets/argilla/apigen-function-calling) | xLAM 60k + Synth-APIGen merged for SFT | CC-BY-4.0 |
| [Nemotron-Agentic-v1](https://huggingface.co/datasets/nvidia/Nemotron-Agentic-v1) · [Nemotron-Post-Training-v1](https://huggingface.co/datasets/nvidia/Nemotron-Post-Training-Dataset-v1) | NVIDIA agentic and tool-calling SFT data | CC-BY-4.0 |
| [Agent-FLAN](https://huggingface.co/datasets/internlm/Agent-FLAN) | Agent tuning data incl. negative samples | Apache-2.0 |
| [APIBench](https://huggingface.co/datasets/gorilla-llm/APIBench) | Original Gorilla API-call data | Apache-2.0 |
| [ToolBench](https://github.com/OpenBMB/ToolBench) | 16k+ RapidAPI APIs, ~126k solution paths (download via repo) | see repo |

Always check the license before commercial use.

## Open function-calling models

| Model | Notes |
|---|---|
| [Qwen3](https://huggingface.co/Qwen/Qwen3-8B) · [Qwen3.5](https://huggingface.co/Qwen/Qwen3.5-9B) · [Qwen3.6](https://huggingface.co/Qwen/Qwen3.6-35B-A3B) · [Qwen3-Coder](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct) | Apache-2.0, native Hermes-style tools ([guide](https://qwen.readthedocs.io/en/latest/framework/function_call.html)) |
| [Llama 3.1](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) · [3.3](https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct) · [4 Scout](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct) | Llama licenses; [prompt format](https://dev.meta.ai/llama/docs/model-cards-and-prompt-formats/llama3_1) |
| [Mistral 7B v0.3](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3) · [Small 3.2](https://huggingface.co/mistralai/Mistral-Small-3.2-24B-Instruct-2506) · [Ministral 3](https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512) · [Large 3](https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512) | Native function calling |
| [gpt-oss-20b / 120b](https://huggingface.co/openai/gpt-oss-20b) | Apache-2.0, harmony format with built-in tools |
| [xLAM-2](https://huggingface.co/Salesforce/Llama-xLAM-2-8b-fc-r) (1B-70B) | Multi-turn function calling; CC-BY-NC-4.0 |
| [Hammer 2.1](https://huggingface.co/MadeAgents/Hammer2.1-7b) | On-device function calling; CC-BY-NC-4.0 |
| [ToolACE-2.5-8B](https://huggingface.co/Team-ACE/ToolACE-2.5-Llama-3.1-8B) | Trained on ToolACE data |
| [FunctionGemma 270M](https://huggingface.co/google/functiongemma-270m-it) | Tiny on-device function caller |
| [Hermes 3](https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B) · [Hermes 4](https://huggingface.co/NousResearch/Hermes-4-70B) | Hermes format ([repo](https://github.com/NousResearch/Hermes-Function-Calling)) |
| [Kimi K2](https://huggingface.co/moonshotai/Kimi-K2-Instruct) · [GLM-4.5](https://huggingface.co/zai-org/GLM-4.5) | Large agentic / tool-use models |
| [Granite 3.3](https://huggingface.co/ibm-granite/granite-3.3-8b-instruct) | Apache-2.0, native tools |
| [Functionary](https://huggingface.co/meetkai/functionary-small-v3.2) · [NexusRaven-V2](https://huggingface.co/Nexusflow/NexusRaven-V2-13B) · [Gorilla OpenFunctions v2](https://huggingface.co/gorilla-llm/gorilla-openfunctions-v2) · [watt-tool-70B](https://huggingface.co/watt-ai/watt-tool-70B) · [Arch-Function](https://huggingface.co/katanemo/Arch-Function-7B) | Earlier and specialized function callers |

## Fine-tuning tooling

| Tool | Tool-calling data docs |
|---|---|
| TRL | [SFTTrainer](https://huggingface.co/docs/trl/sft_trainer) · [dataset formats (tools)](https://huggingface.co/docs/trl/dataset_formats) |
| Axolotl | [Conversation format with tools](https://docs.axolotl.ai/docs/dataset-formats/conversation.html) |
| LLaMA-Factory | [Data format (function_call / observation)](https://github.com/hiyouga/LlamaFactory/blob/main/data/README.md) |
| Unsloth | [Tool-calling guide](https://unsloth.ai/docs/basics/tool-calling-guide-for-local-llms) · [datasets guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/datasets-guide) |
| torchtune | [Messages](https://meta-pytorch.org/torchtune/main/basics/messages.html) (no longer actively maintained) |
| OpenAI (hosted) | [Supervised fine-tuning](https://developers.openai.com/api/docs/guides/supervised-fine-tuning) · [Cookbook: fine-tuning for function calling](https://developers.openai.com/cookbook/examples/fine_tuning_for_function_calling) |
| Google Vertex AI (hosted) | [Supervised tuning](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tuning/supervised-tuning) · [prepare data (functionCall)](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tuning/supervised-tuning/prepare-data) |
| Amazon Bedrock (hosted) | [Custom models](https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models.html). Nova 2 SFT [does not support tool sections](https://docs.aws.amazon.com/bedrock/latest/userguide/nova-2-sft-data-prep.html); [workaround](https://aws.amazon.com/blogs/machine-learning/customize-amazon-nova-models-to-improve-tool-usage/) |
| Together AI (hosted) | [Data preparation](https://docs.together.ai/docs/fine-tuning/data-preparation) |
| Mistral (hosted, legacy) | [Fine-tuning](https://docs.mistral.ai/capabilities/finetuning/) |

## Frameworks & libraries

| Library | Link |
|---|---|
| OpenAI Agents SDK | [Tools](https://openai.github.io/openai-agents-python/tools/) |
| Claude Agent SDK | [Overview](https://code.claude.com/docs/en/agent-sdk/overview) |
| LangChain | [Tools](https://docs.langchain.com/oss/python/langchain/tools) |
| LlamaIndex | [Tools](https://developers.llamaindex.ai/python/framework/module_guides/deploying/agents/tools/) |
| Vercel AI SDK | [Tools and tool calling](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling) |
| Pydantic AI | [Tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/) |
| instructor | [Structured outputs via tools](https://python.useinstructor.com/) |
| Outlines · XGrammar · llguidance | [Outlines](https://dottxt-ai.github.io/outlines/latest/) · [XGrammar](https://xgrammar.mlc.ai/docs/) · [llguidance](https://github.com/guidance-ai/llguidance): constrained decoding |

## Key papers

**Foundations**

- [ReAct](https://arxiv.org/abs/2210.03629)
- [Toolformer](https://arxiv.org/abs/2302.04761)
- [Gorilla](https://arxiv.org/abs/2305.15334)
- [ToolAlpaca](https://arxiv.org/abs/2306.05301)
- [ToolLLM](https://arxiv.org/abs/2307.16789)
- [Tool Learning survey](https://arxiv.org/abs/2405.17935)

**Data synthesis**

- [APIGen](https://arxiv.org/abs/2406.18518)
- [ToolACE](https://arxiv.org/abs/2409.00920)
- [xLAM](https://arxiv.org/abs/2409.03215)
- [Hammer](https://arxiv.org/abs/2410.04587)
- [APIGen-MT](https://arxiv.org/abs/2504.03601)
- [Toucan](https://arxiv.org/abs/2510.01179)
- [Kimi K2](https://arxiv.org/abs/2507.20534)
- [Granite FC](https://arxiv.org/abs/2407.00121)
- [Hermes 3](https://arxiv.org/abs/2408.11857)
- [Llama 3 (tool-use section)](https://arxiv.org/abs/2407.21783)
- [Qwen3](https://arxiv.org/abs/2505.09388)

**RL for tool use**

- [ToolRL](https://arxiv.org/abs/2504.13958)
- [Nemotron-Research-Tool-N1](https://arxiv.org/abs/2505.00024)

**Evaluation**

- [BFCL](https://proceedings.mlr.press/v267/patil25a.html)
- [τ-bench](https://arxiv.org/abs/2406.12045)
- [τ²-bench](https://arxiv.org/abs/2506.07982)
- [API-Bank](https://arxiv.org/abs/2304.08244)
- [T-Eval](https://arxiv.org/abs/2312.14033)
- [TaskBench](https://arxiv.org/abs/2311.18760)
- [StableToolBench](https://arxiv.org/abs/2403.07714)
- [ToolSandbox](https://arxiv.org/abs/2408.04682)
- [NESTFUL](https://arxiv.org/abs/2409.03797)
- [ComplexFuncBench](https://arxiv.org/abs/2501.10132)
- [ACEBench](https://arxiv.org/abs/2501.12851)
- [When2Call](https://arxiv.org/abs/2504.18851)
- [MCP-Bench](https://arxiv.org/abs/2508.20453)
- [MCP-Universe](https://arxiv.org/abs/2508.14704)
- [MCPMark](https://arxiv.org/abs/2509.24002)
- [MCP-Atlas](https://arxiv.org/abs/2602.00933)

**Constrained decoding**

- [Outlines](https://arxiv.org/abs/2307.09702)
- [XGrammar](https://arxiv.org/abs/2411.15100)
