type State = 'start' | 'done' | 'error';
type Listener = (length: number, state: State, id: string, error?: unknown) => void;
type TaskFn = (id: string) => Promise<void>

class Task {
  executor: TaskFn;
  id: string;
  priority?: number;

  constructor(executor: TaskFn, priority=0) {
    this.executor = executor;
    this.id = `${Date.now().toString()}-${Math.random().toString(36).substring(2, 8)}`;
    this.priority = priority;
  }

  exec() { return this.executor(this.id) }
}

class QueueService {
  listeners: Listener[] = [];
  queueLength = { value: 0 };
  taskQueue: Task[] = [];
  isProcessing = false;

  listen(listener: Listener) {
    this.listeners.push(listener);
  }

  notifyAndUpdate(state: State, id: string, error?: unknown, increment: number = 0) {
    this.queueLength.value += increment;
    this.listeners.forEach(watcher => watcher(this.queueLength.value, state, id, error));
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()!;
      try {
        await task.exec();
        this.notifyAndUpdate('done', task.id, undefined, -1);
      } catch (error) {
        this.notifyAndUpdate('error', task.id, error, -1);
      }
    }
    this.isProcessing = false;
  }

  addTask(taskFn: TaskFn) {
    const task = new Task(taskFn)
    this.notifyAndUpdate('start', task.id, undefined, 1);
    this.taskQueue.push(task);
    this.processQueue();
    return task.id;
  }
}

let queueService: QueueService | null = null;

export default function useQueueService() {
  if (!queueService) {
    queueService = new QueueService();
  }
  return queueService;
}
