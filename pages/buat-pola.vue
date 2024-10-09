<script lang="ts" setup>
const currentQueue = ref(0);
const prompt = ref('');
const generatedImageLink = ref();
const counter = ref(0);

const generateBatik = (event: Event) => {
  generatedImageLink.value = undefined;
  event.preventDefault();
  currentQueue.value = 0;
  generatedImageLink.value = `https://picsum.photos/512/512?${counter.value++}`;
};
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
        />
        <button><Icon name="heroicons:sparkles" /></button>
      </div>
    </form>
    <div class="flex justify-center mt-4">
      <div class="relative max-w-full w-[512px] aspect-square" v-if="generatedImageLink">
        <div class="w-full aspect-square bg-gray-200 animate-pulse"></div>
        <img loading="lazy" :src="generatedImageLink" class="absolute top-0 left-0">
      </div>
      <span v-if="currentQueue" class="text-gray-600 text-sm">anda urutan ke-{{ currentQueue }} dalam antrean</span>
    </div>
  </div>
</template>