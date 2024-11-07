<script lang="ts" setup>
const { data: images, status } = useFetch('/api/images');
</script>

<template>
  <div>
    <div class="text-center mb-20">
      <h1 class="text-4xl font-bold mb-2">Galeri</h1>
      <p class="text-lg text-gray-800">Jelajahi koleksi motif batik yang diciptakan oleh model kami.</p>
      <p class="italic text-gray-600">Klik pada gambar untuk pratinjau pola berulang</p>
    </div>
    <div class="grid lg:grid-cols-3 gap-4 grid-cols-2">
      <NuxtLink v-for="image in images" class="relative" :to="`/preview?image=${image}`">
        <div class="w-full aspect-square bg-gray-200 animate-pulse"></div>
        <img loading="lazy" :src="image" class="absolute top-0 left-0">
      </NuxtLink>
    </div>
  </div>
</template>