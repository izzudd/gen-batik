import storageService from "../services/storageService";

export default defineEventHandler(async event => {
  const { page = 1, limit = 12 } = getQuery(event);
  const storage = storageService(useStorage('data'));
  const ids = await storage.getIds();

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);
  const paginatedIds = ids.slice(start, end);

  return {
    images: paginatedIds.map(id => `/generated/${id}`),
    hasMore: end < ids.length
  };
})