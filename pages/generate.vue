<script lang="ts" setup>
const currentQueue = ref(0);
const prompt = ref('');
const generatedImageLink = ref();
const generating = ref(false);

const generateBatik = async (event: Event) => {
  generatedImageLink.value = undefined;
  generating.value = true;
  event.preventDefault();
  generatedImageLink.value = await $fetch('/api/generate', { query: { prompt: prompt.value } });
  generating.value = false;
};

const generateRandomPrompt = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'earth'];
  const object = ['flower', 'leaf', 'tree', 'dragon', 'bird', 'fish', 'line and dot', 'cloud', 'abstract pattern', 'geometric'];

  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
  const randomObject = object[Math.floor(Math.random() * object.length)];
  prompt.value = `batik with ${randomColor1} color ${randomObject} in ${randomColor2} background`;
}

onMounted(() => {
  const queueEventSource = new EventSource(`${useRuntimeConfig().app.baseURL}/api/queue`);
  queueEventSource.onmessage = (event) => {
    const { length, state, error } = JSON.parse(event.data);
    console.log({ length, state, error });
    currentQueue.value = length;
  };
})
</script>

<template>
  <div>
    <div class="text-center mb-16">
      <h1 class="text-4xl font-bold mb-2">Buat Pola<Icon name="heroicons:sparkles-solid" class="text-yellow-400"/></h1>
      <p class="text-lg italic text-gray-600">Buat motif batikmu sendiri cukup dengan deskripsi singkat.</p>
    </div>
    <form @submit="generateBatik" class="flex justify-center items-center">
      <div class="max-w-prose w-full flex border-b border-gray-300 p-2">
        <input 
          type="text" 
          class="flex-grow text-lg" 
          v-model="prompt"
          placeholder="Masukkan deskripsi motif batik di sini..." 
          required
        />
        <span class="flex items-center gap-2">
          <button type="submit" class="flex items-center"><Icon class="flex items-center" name="heroicons:sparkles" size="1.5rem" /></button>
          <button type="button" @click="generateRandomPrompt()"><Icon class="flex items-center" name="mdi:dice-multiple" size="1.5rem" /></button>
        </span>
      </div>
    </form>
    <div class="flex justify-center mt-4 flex-col items-center">
      <div class="max-w-full w-[512px] aspect-square">
        <div class="w-full aspect-square bg-gray-200 animate-pulse" v-if="generating"></div>
        <img loading="lazy" :src="generatedImageLink">
      </div>
      <span v-if="currentQueue" class="text-gray-600 text-sm mt-4">sedang ada {{ currentQueue }} proses dalam antrean</span>
    </div>
  </div>
</template>