import { ComfyUIClient } from "comfy-ui-client";
import { randomUUID } from "crypto";

type State = 'start' | 'done';

let queueService: ReturnType<typeof initQueueService> | null = null;

export default function useQueueService() {
  if (!queueService) {
    queueService = initQueueService();
  }
  return queueService;
}

function initQueueService() {
  const listeners: ((length: number, state: State, error?: unknown) => void)[] = [];
  const queueLength = {value: 0};

  function listen(listener: (length: number, state: State, error?: unknown) => void) {
    listeners.push(listener);
  }

  function notifyAndUpdate(state: State, error?: unknown, increment: number = 0) {
    queueLength.value += increment;
    listeners.forEach(watcher => watcher(queueLength.value, state, error));
  }

  async function addTask(task: (client: ComfyUIClient) => Promise<void>) {
    notifyAndUpdate('start', undefined, 1);
    try {
      const { comfyUrl } = useRuntimeConfig();
      const client = new ComfyUIClient(comfyUrl, randomUUID());
      await client.connect();
      await task(client);
      notifyAndUpdate('done', undefined, -1);
    } catch (error) {
      notifyAndUpdate('done', error, -1);
    }
  }

  return { listen, addTask };
}
