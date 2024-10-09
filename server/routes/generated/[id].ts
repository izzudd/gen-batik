import storageService from "~/server/services/storageService";

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ status: 400, message: 'Missing id' });
  const rawImage = await storageService(useStorage('data')).getImage(id);
  return new Blob([rawImage], { type: 'image/png' });
})