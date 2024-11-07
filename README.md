# GenBatik

## Workflow Directory

The `workflow` directory is mandatory. It contains `index.json` and `workflow.json`.

- `index.json` contains 3 keys that point to node IDs in `workflow.json`:
  - `input`: node where text is inputted (e.g., the text field in `CLIPTextEncode`).
  - `sampler`: sampler used to generate images (e.g., `KSampler`).
  - `output`: node where the image is outputted (e.g., `SaveImage`).
- `workflow.json` contains the ComfyUI workflow exported as an API.
