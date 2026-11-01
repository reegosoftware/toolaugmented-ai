# Tool Augmented AI

The function calling / tool calling reference: concepts, provider comparison, usage, training-data recipe, fine-tuning, evaluation, and resources. Live at https://toolaugmented.ai. Try models live at https://toolcalling.ai.

## Develop
```bash
pip install mkdocs-material
mkdocs serve            # http://127.0.0.1:8000
mkdocs build --strict   # same check as CI
```

## Publish
Pushing to `main` deploys to GitHub Pages via `.github/workflows/build-and-deploy.yml`.

The previous readthedocs-theme version is kept on the `legacy-readthedocs` branch.
