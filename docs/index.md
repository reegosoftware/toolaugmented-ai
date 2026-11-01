# Tool Augmented AI

## Function/Tool Calling

Augmenting Large Language Models (LLMs) with Function Calls is a crucial technique that enables the integration of diverse data sources and enhances their performance. This process involves converting unstructured or noisy input data, such as natural language text, web pages, or even sensor readings into structured formats like JSON.

## How to test Function/Tool Calling?

To test your JSON schema and conversations, please visit the webpage [Function Calling Tool](https://toolcalling.ai/)

## Fine Tuning a Model for Function Calling
To train a model to have Tool Calling capability, it's a best practice to cover the conversation examples with below taxonomies/domains.

### 1. Turn
- `single turn`: The user asks only one question and leave the conversation.
- `multiple turns`: The user asks follow-up questions, there's back and forth between the user and the assistant.

### 2. Function Call
- `single call`: The user asks a question which requires only one function call in a row.
- `multiple parallel calls`: The user asks a question which requires multiple function calls in a row.
- `multiple consecutive calls`: The user asks a question which requires one/multiple function calls consecutively in a row.
- `no call`: The user asks a question which does not require a function call at all.

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
- etc

### 4. Major Domains:
- **Data Extraction**: Noisy, Natural Language to JSON. Where the data is hidden in a huge unstructured data.
- **Web Scraping**: HTML/XML to JSON
- **Business and Sales**
- **Finance**
- **Education**
- **Healthcare**: Diagnose diseases, and generate treatment plans.
- **Text Analysis**: Sentiment analysis, Entity extraction, and text classification

## Super Recipe
For the full end-to-end recipe, including the coverage matrix, edge and advanced cases, dataset mix, quality gates and evaluation, see [Super Recipe](super-recipe.md).
