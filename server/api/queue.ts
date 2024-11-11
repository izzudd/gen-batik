import useQueueService from "../services/queueService";

export default defineEventHandler(event => {
  const eventStream = createEventStream(event);
  const queue = useQueueService();

  queue.listen((length, state, id, error) => {
    eventStream.push(JSON.stringify({ length, state, id, error: !!error }));
  });

  return eventStream.send()
})