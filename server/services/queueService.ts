import type { Storage } from 'unstorage';

type State = 'start' | 'done';

let ququeService: ReturnType<typeof initQueueService> | null = null;

export default function useQueueService(storage: Storage) {
  if (!ququeService) {
    ququeService = initQueueService(storage);
  }
  return ququeService;
}

function initQueueService(storage: Storage) {
  let listeners: ((length: number, state: State, error?: unknown) => void)[] = [];

  function listen(listener: (length: number, state: State, error?: unknown) => void) {
    listeners.push(listener);
  }

  async function notifyAndUpdate(state: State, error?: unknown, increment: number = 0) {
    const queueLength = await storage.getItem<number>('queueLength') || 0;
    await storage.setItem('queueLength', queueLength + increment);
    listeners.forEach(watcher => watcher(queueLength, state, error));
  }

  async function addTask(task: () => Promise<void>) {
    await notifyAndUpdate('start', undefined, 1);
    try {
      await task();
      await notifyAndUpdate('done', undefined, -1);
    } catch (error) {
      await notifyAndUpdate('done', error, -1);
    }
  }

  return { listen, addTask };
}
