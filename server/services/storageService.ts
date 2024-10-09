import type { Storage } from 'unstorage';

export default function(storage: Storage) {
  return {
    store: async (image: Uint8Array, prompt: string) => {
      const id = Date.now().toString();
      await storage.setItemRaw(`${id}:image.png`, image);
      await storage.setItem(`${id}:prompt`, prompt);
      return id;
    },
    getIds: async () => {
      const keys = await storage.getKeys();
      const uniqueIds = new Set(keys.map(key => key.split(':')[0]));
      return Array.from(uniqueIds).sort();
    },
    getImage: async (id: string) => {
      return storage.getItemRaw(`${id}:image.png`) as unknown as Uint8Array;
    },
    getPrompt: async (id: string) => {
      return storage.getItem(`${id}:prompt`) as unknown as string;
    },
  }
}