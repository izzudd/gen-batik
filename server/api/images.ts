import storageService from "../services/storageService";

export default defineEventHandler(async event => {
  const storage = storageService(useStorage('data'));
  const ids = await storage.getIds();

  return ids.map(id => `${process.env.NITRO_APP_BASE_URL || ''}/generated/${id}`);
})