# GenBatik

**AI batik pattern generator.** Describe a motif in plain language and GenBatik renders a seamless batik tile you can preview as a repeating pattern and download.

- **Live site:** https://genbatik.ub.ac.id
- **Model:** [izzudd/sd-batik-llava](https://huggingface.co/izzudd/sd-batik-llava) on Hugging Face
- **Paper:** [Prompt Conditioned Batik Pattern Generation Using LoRA Weighted Diffusion Model With Classifier-Free Guidance](https://ieeexplore.ieee.org/document/10817602) (IEEE Access, vol. 13, 2025)
- **Author:** [Daffa Izzuddin](https://izzudd.my.id)

## Why

Traditional batik is preserved through classification research, but pattern *creation* is still done by hand. GenBatik is the deployment side of a research pipeline that fine-tunes a latent diffusion model on 20,000 batik images with LLaVA-generated captions, then conditions generation on free-form text. The result replicates existing motifs but also combines them into new, expert-reviewed designs. The web app makes that model usable by batik artists, manufacturers, and anyone exploring motifs.

## Features

- **Text-to-pattern generation** — prompts in English or Indonesian; the server prefixes `batik with` when the prompt doesn't mention batik.
- **Seamless tiles** — every generation is sampled with seamless tiling enabled, so the tile repeats without visible seams.
- **Repeating preview** — clicking a result sets it as the page background so you can inspect the repeat.
- **Gallery** — infinite-scroll feed of everything generated on the deployment.
- **Queue with live status** — requests are serialised through a single GPU worker; clients watch progress over Server-Sent Events.
- **Bot protection** — Cloudflare Turnstile is validated server-side before a job is queued.
- **Download** — the generated PNG is downloadable directly.

## Model

[`izzudd/sd-batik-llava`](https://huggingface.co/izzudd/sd-batik-llava) is the model this app was built around: a `StableDiffusionPipeline` fine-tuned on the batik dataset, with the denoising U-Net tuned on LLaVA-captioned prompts — the best configuration in the paper, measured by FID and Inception Score.

The ComfyUI workflow shipped in [`workflow/workflow.json`](workflow/workflow.json) uses the fine-tuned U-Net as follows:

1. Load `sd-batik-llava.safetensors` (UNETLoader) and the SD 1.5 base checkpoint.
2. Blend them with `ModelMergeSimple` at ratio `0.75`, keeping SD 1.5's CLIP and VAE.
3. Enable seamless tiling on the merged model and on the VAE (`ComfyUI-seamless-tiling`).
4. Sample at 512×512 — 60 steps, CFG 7.5, `euler_ancestral` — with a random seed per request.
5. Decode through the circular VAE, run a Real-ESRGAN ×4 pass, then export a 512×512 PNG.

## Architecture

```
Browser ── Nuxt 3 (Vue + Tailwind)
             │  POST /api/generate ─── Turnstile check ─── QueueService
             │  GET  /api/queue ────── SSE job state
             │  GET  /api/images ───── paginated gallery
             │  GET  /generated/:id ── stored PNG
             ▼
        ComfyUI over SSH tunnel (autossh, localhost:$COMFY_PORT)
             ▼
        sd-batik-llava U-Net merged with SD 1.5 ──► PNG written to ./comfy-output
```

The Nitro server keeps the queue in memory and images on the filesystem (`unstorage` `fs` driver). It never exposes ComfyUI to the public internet: `entrypoint.sh` opens an `autossh` tunnel to the GPU host using `workflow/comfy.pem`, and the app connects to `localhost:$COMFY_PORT`.

## Repository layout

```
components/        NavBar
pages/             index (gallery), generate, preview, about
server/api/        generate, queue (SSE), images, check
server/routes/     generated/[id] image streaming
server/services/   queueService (serial job queue), storageService (fs)
workflow/          index.json + workflow.json (ComfyUI API workflow) + comfy.pem
nuxt.config.ts     Turnstile, image, runtime config
entrypoint.sh      autossh tunnel + node server
```

### The `workflow/` contract

`workflow` is mandatory and contains exactly two files besides the SSH key:

- `index.json` — three keys pointing at node IDs in `workflow.json`:
  - `input`: the node whose `inputs.text` receives the prompt (a `CLIPTextEncode`).
  - `sampler`: the sampler node; its `seed` is randomised per request (`KSampler`).
  - `output`: the node that holds the resulting image (`SaveImage`).
- `workflow.json` — the ComfyUI workflow exported with **Export (API)**, not the regular save.

Swapping models means swapping these two files; no TypeScript changes are required.

## Requirements

- Node.js 20+ and Yarn 4 (`corepack enable`)
- A ComfyUI instance on a machine you can reach over SSH (or locally, for development)
- The model and workflow assets listed below

## Setup

### 1. ComfyUI assets

Place the files where the workflow expects them:

| File referenced in `workflow.json` | Destination |
| --- | --- |
| `sd-batik-llava.safetensors` | `ComfyUI/models/unet/sd-batik-llava.safetensors` |
| `SD1.5/v1-5-pruned-emaonly.ckpt` | `ComfyUI/models/checkpoints/SD1.5/v1-5-pruned-emaonly.ckpt` |
| `RealESRGAN_x4.pth` | `ComfyUI/models/upscale_models/RealESRGAN_x4.pth` |

The model ships in diffusers format, so pull the U-Net weights and rename them:

```bash
hf download izzudd/sd-batik-llava unet/diffusion_pytorch_model.safetensors --local-dir ./sd-batik-llava
mv ./sd-batik-llava/unet/diffusion_pytorch_model.safetensors "$COMFY/models/unet/sd-batik-llava.safetensors"
```

Install the custom nodes that provide `SeamlessTile` and `MakeCircularVAE`:

```bash
git clone https://github.com/spinagon/ComfyUI-seamless-tiling "$COMFY/custom_nodes/ComfyUI-seamless-tiling"
```

Then start ComfyUI on the port you configure as `COMFY_PORT`.

### 2. App

```bash
cp .env.example .env     # then fill it in
yarn install
yarn dev                 # http://localhost:3000
```

`yarn dev` skips the SSH tunnel and expects ComfyUI on `localhost:$COMFY_PORT`. In Docker, `entrypoint.sh` opens the tunnel for you.

## Configuration

- `COMFY_PORT` — ComfyUI port; used for the SSH tunnel and as the app's upstream port
- `SSH_SERVER` — GPU host running ComfyUI
- `SSH_USER` — SSH user on that host
- `SSH_PORT` — SSH port (default 22)
- `APP_URL` — public URL of the app; also allowlisted for Nuxt Image
- `NUXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (browser widget)
- `NUXT_TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key (server-side validation)

`workflow/comfy.pem` is the private key used by `autossh`. It is gitignored — copy it into place on the deployment, never commit it.

## Deployment

```bash
docker compose up -d --build
```

The container builds with Yarn 4, installs `openssh-client` and `autossh`, opens the tunnel, and serves Nitro on port 3000 (mapped to `2370` in `docker-compose.yml`). Generated images live in `./comfy-output`, mounted into the container so they survive restarts. `export.py` flattens that directory into `comfy-export/` as flat `<id>.png` files if you need the raw assets.

Only one generation runs at a time by design — the queue lives in memory, so run one app instance per ComfyUI worker.

## Citation

```bibtex
@article{10817602,
  author  = {Wahid, Rahmatulloh Daffa Izzuddin and Yudistira, Novanto and Dewi, Candra
             and Sari, Irawati Nurmala and Pradhikta, Dyanningrum and Fatmawati},
  journal = {IEEE Access},
  title   = {Prompt Conditioned Batik Pattern Generation Using LoRA Weighted
             Diffusion Model With Classifier-Free Guidance},
  year    = {2025},
  volume  = {13},
  pages   = {2436--2448},
  doi     = {10.1109/ACCESS.2024.3523494}
}
```

## License

[MIT](LICENSE) © 2025 Rahmatulloh Daffa Izzuddin Wahid

The research paper and the model weights are licensed separately: the paper is published under CC BY-NC-ND, and the weights derive from Stable Diffusion 1.5, so check those terms before commercial use.
