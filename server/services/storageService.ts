import type { Storage } from 'unstorage';

/**
 * Initializes the storage service with the given storage instance.
 * @param storage - The storage instance to use.
 * @returns An object containing storage methods.
 */
export default function(storage: Storage) {
  return {
    /**
     * Stores an image and its prompt.
     * @param image - The image data as a Uint8Array.
     * @param prompt - The prompt associated with the image.
     * @returns A unique identifier for the stored image.
     */
    store: async (image: Uint8Array, prompt: string) => {
      const id = Date.now().toString();
      await storage.setItemRaw(`${id}:image.png`, image);
      await storage.setItem(`${id}:prompt`, prompt);
      return id;
    },

    /**
     * Retrieves all stored image IDs.
     * @returns An array of image IDs.
     */
    getIds: async () => {
      const keys = await storage.getKeys();
      const uniqueIds = new Set(keys.map(key => key.split(':')[0]));
      return Array.from(uniqueIds).sort().toReversed();
    },

    /**
     * Retrieves the image data for a given ID.
     * @param id - The unique identifier of the image.
     * @returns The image data as a Uint8Array.
     */
    getImage: async (id: string) => {
      return storage.getItemRaw(`${id}:image.png`) as unknown as Uint8Array;
    },

    /**
     * Retrieves the prompt for a given image ID.
     * @param id - The unique identifier of the image.
     * @returns The prompt as a string.
     */
    getPrompt: async (id: string) => {
      return storage.getItem(`${id}:prompt`) as unknown as string;
    },
  }
}