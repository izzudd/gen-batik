import useQueueService from "../services/queueService";
import storageService from "../services/storageService";
import Workflow from '~~/workflow/workflow.json';
import Target from '~~/workflow/index.json';

export default defineEventHandler(async event => {
  const { prompt } = getQuery<{ prompt: string }>(event);
  if (!prompt) throw createError({ status: 400, message: 'Missing prompt' });

  const storage = storageService(useStorage('data'));
  const queue = useQueueService();

  console.log('Generating image with prompt)', prompt);

  let id;
  await queue.addTask(async (client) => {
    const images = await client.getImages(getPromptedWorkflow(prompt));
    const { blob } = images[Target.output][0];
    const imageData = new Uint8Array(await blob.arrayBuffer());
    id = await storage.store(imageData, prompt);
  });

  return `/generated/${id}`;
})

function getPromptedWorkflow(prompt: string) {
  const workflow = JSON.parse(JSON.stringify(Workflow)) as typeof Workflow;
  // @ts-ignore
  workflow[Target.input].inputs.text = prompt;
  // @ts-ignore
  workflow[Target.sampler].inputs.seed = Math.floor(Math.random() * 1000000)
  return workflow;
}