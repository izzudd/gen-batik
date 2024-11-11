import useQueueService from "../services/queueService";
import storageService from "../services/storageService";
import Workflow from '~~/workflow/workflow.json';
import Target from '~~/workflow/index.json';
import { ComfyUIClient } from "comfy-ui-client";
import { randomUUID } from "crypto";

export default defineEventHandler(async event => {
  const { prompt } = getQuery<{ prompt: string }>(event);
  if (!prompt) throw createError({ status: 400, message: 'Missing prompt' });

  const storage = storageService(useStorage('data'));
  const queue = useQueueService();

  const safePrompt = prompt.toLowerCase().includes('batik') ? prompt : `batik with ${prompt}`;
  console.log('Generating image with prompt:', safePrompt);

  const id = queue.addTask(async (id: string) => {
    const { comfyUrl } = useRuntimeConfig();
    const client = new ComfyUIClient(comfyUrl, randomUUID());
    await client.connect();
    const images = await client.getImages(getPromptedWorkflow(safePrompt));
    const { blob } = images[Target.output][0];
    const imageData = new Uint8Array(await blob.arrayBuffer());
    await storage.store(imageData, safePrompt, id);
  });
  
  return id;
})

function getPromptedWorkflow(prompt: string) {
  const workflow = JSON.parse(JSON.stringify(Workflow)) as typeof Workflow;
  // @ts-ignore
  workflow[Target.input].inputs.text = prompt;
  // @ts-ignore
  workflow[Target.sampler].inputs.seed = Math.floor(Math.random() * 1000000)
  return workflow;
}