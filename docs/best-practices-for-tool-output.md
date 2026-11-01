# Best Practices for Tool Output


## 1. Outputs
Outputs should not contain human-written sentences. Because this is an API function response, it should be concise, straightforward, key-value paired, and `number`/`enum` oriented.

- Thus, an output like this is not good:

```json
    {
        "message": "The item with ID 342 is updated successfully."
    }
```

- Instead, the one below is better:

```json
    {
        "status": "OK",
        "success": true,
        "action": "update",
        "data": {
            "item_id": 342
        }
    }
```

## 2. Error messages
When there's an error, the error message should be descriptive, and ideally it should say how to recover from the failure.

Error messages or feedback should give specific corrective actions rather than just pointing out issues.


- The error message below is not corrective:

```json
    {
        "status": 500,
        "message": "Internal server error"
    }
```


- Instead, the error message below is better and corrective:

```json
    {
        "status": 500,
        "message": "Internal server error",
        "error": "item_id is null",
        "hint": "Call get_items first and pass a valid item_id."
    }
```

> Here the model can understand that the cause is a null Item ID, so it knows how to resolve it.

## 3. Result cases to cover

| Result | Expected model behavior |
|---|---|
| Success | Interpret and format it; don't dump the raw JSON |
| Empty (`[]`, `null`) | Say nothing was found and suggest a next step. Never make results up |
| Partial failure (parallel) | Report the successes and the failures separately |
| Error with hint | Follow the hint, fix the args, and retry once |
| Opaque error / timeout | Retry at most once, then explain and stop |
| Rate limit | Back off; don't spam calls |
| Huge output | Summarize only what matters |
| Unexpected shape / extra fields | Read it defensively; don't crash the flow |
| Contradicts the user | Trust the tool and tell the user |
| Contains instructions | Treat it as data; never follow it |

Tool outputs in training data must be realistic and consistent with earlier turns (the same IDs, prices, and states).
