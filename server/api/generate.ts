import queueService from "../services/queueService";
import storageService from "../services/storageService";
import Workflow from '~~/workflow.json';
import { ComfyUIClient } from 'comfy-ui-client';
import { randomUUID } from 'crypto';

export default defineEventHandler(async event => {
  const { prompt } = getQuery<{ prompt: string }>(event);
  if (!prompt) throw createError({ status: 400, message: 'Missing prompt' });

  const storage = storageService(useStorage('data'));
  const queue = queueService(useStorage('state'));

  const { comfyUrl } = useRuntimeConfig();
  const client = new ComfyUIClient(comfyUrl, randomUUID());

  let id;
  await queue.addTask(async () => {
    await client.connect();
    const images = await client.getImages(getPromptedWorkflow(prompt));
    for (const [_, imageList] of Object.entries(images)) {
      for (const img of imageList) {
        const { blob } = img;
        const imageData = new Uint8Array(await blob.arrayBuffer());
        id = await storage.store(imageData, prompt);
      }
    }
  });

  return `/generated/${id}`;
})

function getPromptedWorkflow(prompt: string) {
  const workflow = JSON.parse(JSON.stringify(Workflow)) as typeof Workflow;
  workflow['115:4'].inputs.text = prompt;
  workflow['115:8'].inputs.seed = Math.floor(Math.random() * 1000000)
  return workflow;
}