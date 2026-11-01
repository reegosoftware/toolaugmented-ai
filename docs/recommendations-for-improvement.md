# Recommendations for Improvement

## Parameter documentation

Enhance function signatures with explicit parameter documentation, including the type, purpose, and any default values.

## Error handling

- To help the LLM handle an error after a bad call, describe how to handle certain types of errors in the function or parameter descriptions.
- Return errors with a machine-readable code and a `hint` ([Tool Output](best-practices-for-tool-output.md)).

## Close the loop

- Run the [evaluation](evaluation.md), find the weakest slice, and add seeds and variants for it.
