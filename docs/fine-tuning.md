# Fine-Tuning Guide

How to fine-tune a model for function calling, from data to deployment, including the advanced techniques that make the difference between a model that works in a demo and one that works in production. To build the dataset, start with [The Recipe](recipe.md).

## 1. Should you fine-tune?

| Fine-tune when | Don't, when |
|---|---|
| You need a small, cheap, fast, or on-prem model | A frontier API already passes your eval |
| Tools are domain-specific and prompting isn't enough | You have under ~500 good examples and no way to generate more |
| You need a strict output format or policy behavior | Your tools change every week (fix the descriptions instead) |
| Latency or cost of long tool lists hurts | The failures are in the tools, not the model |

First run your [evaluation](evaluation.md) with prompting alone, on the base model and on a frontier model. Fine-tuning has to beat that.

## 2. Pick a base model

- Prefer an **instruct model that already has a native tool-calling chat template** (e.g. Qwen3, Llama 3.1+, Mistral, Hermes, xLAM, Hammer). Teaching a new format from scratch takes far more data.
- Check: **context length** (tool lists are long), **license**, and **serving support** (does vLLM/Ollama have a tool-call parser for its format?).
- Size: 1-8B models are good at single and parallel calls after tuning. Long multi-step agentic tasks benefit from larger models.
- See [open function-calling models](resources.md#open-function-calling-models).

## 3. Data format

Store samples in the neutral **`messages` + `tools`** format and let the model's chat template render them, so the training text matches exactly what the server will produce at inference.

```json
{
  "tools": [{"type": "function", "function": {"name": "get_weather", "description": "...", "parameters": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]}}}],
  "messages": [
    {"role": "system", "content": "You are a weather assistant."},
    {"role": "user", "content": "Weather in Oslo?"},
    {"role": "assistant", "tool_calls": [{"type": "function", "function": {"name": "get_weather", "arguments": {"city": "Oslo"}}}]},
    {"role": "tool", "name": "get_weather", "content": "{\"temp_c\": 3, \"condition\": \"snow\"}"},
    {"role": "assistant", "content": "It's 3°C and snowing in Oslo."}
  ]
}
```

Render and inspect it **before** training:

```python
from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained("Qwen/Qwen3-8B")
text = tok.apply_chat_template(sample["messages"], tools=sample["tools"], tokenize=False)
print(text)  # check: tools block, <tool_call> tags, tool role, EOS after each assistant turn
```

!!! warning "Format must match serving"
    The single most common failure: training renders calls one way (e.g. `<tool_call>{...}</tool_call>`) while the inference server's parser expects another. Then the calls come back as plain text. Train with the same template and parser you will serve with.

Format notes:

- **Arguments**: templates differ. Some expect a dict, some a JSON string. Follow the template.
- **Call ids**: keep them if the template renders them; generate unique ones per sample.
- **Thinking models**: keep the reasoning format (e.g. `<think>`) consistent, and decide whether reasoning is kept or stripped on earlier turns, the same way the template does.

## 4. Training setup

**Loss masking.** Train only on **assistant tokens**: text and tool calls. Mask the system prompt, user turns, and tool results. Otherwise the model learns to predict tool outputs and invents them at inference. In TRL, use `assistant_only_loss=True` (it needs a template with generation markers), or a custom collator.

**A starting point** for LoRA SFT on a 7-8B model. Tune it on your eval:

| Setting | Start with |
|---|---|
| Method | LoRA / QLoRA (r = 16-64, alpha = 2r, all linear layers); full fine-tuning if you have the data and compute |
| Learning rate | 1e-4 to 2e-4 (LoRA), 5e-6 to 2e-5 (full) |
| Epochs | 2-3; watch for the eval score dropping |
| Max length | Long enough for the full tool list + conversation; **never truncate** away the tools or the call |
| Packing | Only with per-sample attention masking; otherwise samples leak into each other |
| Batch | Effective 32-128 sequences |

```python
from datasets import load_dataset
from trl import SFTConfig, SFTTrainer
from peft import LoraConfig

ds = load_dataset("json", data_files="train.jsonl")["train"]  # columns: messages, tools
trainer = SFTTrainer(
    model="Qwen/Qwen3-8B",
    train_dataset=ds,
    args=SFTConfig(output_dir="out", num_train_epochs=2, learning_rate=1e-4,
                   assistant_only_loss=True, max_length=8192, bf16=True),
    peft_config=LoraConfig(r=32, lora_alpha=64, target_modules="all-linear"),
)
trainer.train()
```

Axolotl, LLaMA-Factory, Unsloth, and torchtune support the same `messages` + `tools` data. See [Resources](resources.md#fine-tuning-tooling).

## 5. Advanced techniques

### Data that generalizes

- **Shuffle and sample tool lists**: random order, random subsets, 0 to 50+ tools per sample. Otherwise the model learns positions instead of descriptions.
- **Distractors and irrelevance**: near-duplicate tools, plus samples where **no** tool fits. That trains the model to abstain.
- **Schema augmentation**: rename functions and params, paraphrase descriptions, swap the naming case. Same intent, different surface.
- **Argument diversity**: dates, units, unicode, numbers as words, nested objects, arrays, optional params left out.
- **Every assistant turn is a target**: multi-turn and multi-step trajectories teach state, follow-ups, and recovery.
- **Failure trajectories**: inject tool errors, empty results, and timeouts, and show the right recovery ([Tool Output](best-practices-for-tool-output.md)).
- **Clarification turns**: missing or ambiguous args lead to a question, not a guess ([Adversarial cases](adversarial-user-cases.md)).
- **Multilingual**: the user writes in other languages, while args and enums stay canonical.

### Synthetic data pipeline

Generate at scale, then filter hard. This is the approach of APIGen, ToolACE, and others:

1. **Sample** tools (real APIs, or synthesized ones across domains) and a scenario.
2. **Generate** queries and trajectories with a strong model, using personas, the adversarial cases, and the call patterns.
3. **Format check**: the JSON parses, the args validate, and every id matches.
4. **Execution check**: run the calls against real or **deterministic mock** tools; reject anything that crashes or comes back empty when it shouldn't.
5. **Semantic check**: an LLM judge confirms the calls and the answer actually solve the query, without hallucinated values.
6. **Deduplicate and decontaminate**: remove near-duplicates and anything overlapping your eval or the public benchmarks.

!!! note "Distillation"
    Distilling trajectories from a provider's model may be restricted by its terms of service. Check before you do it.

### Beyond SFT

- **Preference tuning (DPO / ORPO / KTO)**: pairs of *chosen* (correct call) vs *rejected* (wrong tool, hallucinated arg, unneeded call, missing clarification). This targets the exact mistakes SFT leaves behind. Mine the rejected samples from your SFT model's eval failures.
- **RL with verifiable rewards (e.g. GRPO)**: the reward checks the format, the function name, argument match (AST), and final task state in a simulated environment, with a penalty for extra calls. This works well for multi-step agentic tasks where many different trajectories are correct.
- **Curriculum**: single, then parallel, then consecutive, then long-horizon and adversarial.
- **Keep general skills**: mix in 10-30% general instruction and chat data to avoid catastrophic forgetting. Re-check chat quality after tuning.
- **Large toolsets**: train with long tool lists, or train a retriever plus the model on the [tool search](function-pivoting-aka-tool-search.md) pattern.

### After training

- **Merge LoRA** (or serve the adapter) and **re-evaluate after quantization**: tool-call formatting is fragile at low bit-widths.
- Evaluate **per slice** and on **unseen tools** ([Evaluation](evaluation.md)). Then mine the failures, add data, and repeat.

## 6. Using your fine-tuned model

### Serve with vLLM (OpenAI-compatible)

```bash
vllm serve ./out-merged \
  --enable-auto-tool-choice \
  --tool-call-parser hermes   # pick the parser that matches your chat template (e.g. hermes, mistral, llama3_json, pythonic)
```

Then use **any** OpenAI-compatible client with the loop from [Using Function Calling](usage.md#2-run-the-loop):

```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")
resp = client.chat.completions.create(model="./out-merged", messages=messages, tools=tools)
print(resp.choices[0].message.tool_calls)
```

### Serve with Ollama

Import the GGUF with a Modelfile whose `TEMPLATE` renders `.Tools` and tool calls the same way as training, then call `/api/chat` with `tools`.

### Raw transformers (no server)

```python
inputs = tok.apply_chat_template(messages, tools=tools, add_generation_prompt=True, return_tensors="pt")
out = model.generate(inputs.to(model.device), max_new_tokens=512)
text = tok.decode(out[0][inputs.shape[1]:], skip_special_tokens=False)
# parse e.g. <tool_call>{...}</tool_call> with a JSON parser, run the tool,
# append {"role": "tool", ...} and generate again
```

### Hosted fine-tuning

- **OpenAI** and **Google Vertex AI** accept tool calls in supervised fine-tuning data (OpenAI: `tools` + assistant `tool_calls`; Vertex: `functionCall` / `functionResponse` parts).
- **Amazon Bedrock Nova 2** SFT doesn't support tool sections; AWS's workaround puts the tools in the prompt text.
- Mistral's hosted fine-tuning API is now legacy.

See [Resources](resources.md#fine-tuning-tooling) for the links.

!!! tip "Benchmark your model"
    Run your own schemas in the [toolcalling.ai workspace](https://app.toolcalling.ai/), and check the community [leaderboard](https://toolcalling.ai/leaderboard) to see which models your fine-tuned model has to beat.
