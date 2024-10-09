<script lang="ts" setup>
const images = ref(getRandomImages(10));

function getRandomImages(n: number): string[] {
  const images = [];
  for (let i = 0; i < n; i++) {
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomString = Array.from({ length: 8 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    images.push(`https://picsum.photos/512/512?${randomString}`);
  }
  return images;
}
</script>

<template>
  <div>
    <div class="text-center mb-20">
      <h1 class="text-4xl font-bold mb-2">Galeri</h1>
      <p class="text-lg italic text-gray-600">Jelajahi koleksi motif batik yang diciptakan oleh model kami.</p>
    </div>
    <div class="grid lg:grid-cols-3 gap-4 grid-cols-2">
      <div v-for="image in images" class="relative">
        <div class="w-full aspect-square bg-gray-200 animate-pulse"></div>
        <img loading="lazy" :src="image" class="absolute top-0 left-0">
      </div>
    </div>
  </div>
</template>