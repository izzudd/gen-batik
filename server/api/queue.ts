import useQueueService from "../services/queueService";

export default defineEventHandler(event => {
  const eventStream = createEventStream(event);
  const queue = useQueueService(useStorage('state'));

  queue.listen((length, state, error) => {
    eventStream.push(JSON.stringify({ length, state, error }));
  });

  return eventStream.send()
})