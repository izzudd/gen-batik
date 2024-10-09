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

onMounted(() => {
  const queueEventSource = new EventSource('/api/queue');
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
      <h1 class="text-4xl font-bold mb-2">Buat Batik</h1>
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
        <button class="flex items-center"><Icon name="heroicons:sparkles" /></button>
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