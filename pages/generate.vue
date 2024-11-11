<script lang="ts" setup>
const currentQueue = ref(0);
const prompt = ref('');
const generatedImageID = ref('');
const generatedImageLink = computed(() => `/generated/${generatedImageID.value}`);
const generating = ref(false);
const error = ref(false);
const readyToDisplay = computed(() => !error.value && !generating.value && generatedImageID.value)

const generateBatik = async (event: Event) => {
  generatedImageID.value = '';
  generating.value = true;
  error.value = false;
  event.preventDefault();
  generatedImageID.value = await $fetch('/api/generate', { query: { prompt: prompt.value } });
};

const generateRandomPrompt = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'earth'];
  const object = ['flower', 'leaf', 'tree', 'dragon', 'bird', 'fish', 'line and dot', 'cloud', 'abstract pattern', 'geometric'];

  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
  const randomObject = object[Math.floor(Math.random() * object.length)];
  prompt.value = `batik with ${randomColor1} color ${randomObject} in ${randomColor2} background`;
}

let queueEventSource: EventSource
onMounted(() => {
  console.log('[Websocket] open connection')
  queueEventSource = new EventSource(`/api/queue`);
  console.log('[Websocket] connected')
  queueEventSource.onmessage = (event) => {
    const { id, length, state, error } = JSON.parse(event.data);
    console.log('[Websocket] message', { id, length, state, error });
    currentQueue.value = length;

    if (error) {
      error.value = true;
      return;
    }
    if (id == generatedImageID.value) {
      generating.value = false;
    }
  };
})
onUnmounted(() => {
  console.log('[Websocket] close connection')
  queueEventSource.close()
  console.log('[Websocket] closed')
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
      <NuxtLink class="relative max-w-full w-[512px] aspect-square" :to="readyToDisplay ? `/preview?image=${generatedImageLink}` : undefined">
        <div v-if="generating"class="w-full aspect-square bg-gray-200 animate-pulse" />
        <img v-if="readyToDisplay"
          class="absolute top-0 left-0 z-10 w-full h-full" 
          loading="lazy" :src="generatedImageLink"
        >
      </NuxtLink>
      <div v-if="currentQueue" class="text-gray-600 text-sm mt-4">sedang ada {{ currentQueue }} proses dalam antrean</div>
      <div v-if="error" class="text-red-500 text-sm mt-4">Terjadi kesalahan, silahkan coba lagi</div>
    </div>
  </div>
</template>