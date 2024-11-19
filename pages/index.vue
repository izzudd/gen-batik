<script lang="ts" setup>
interface BatikGallery {
  imageUrls: string[]
  isLoading: boolean
}

const { data: galleryImages, status } = useFetch<string[]>('/api/images');
</script>

<template>
  <div>
    <div class="text-center mb-20">
      <h1 class="text-4xl font-bold mb-2">Galeri</h1>
      <p class="text-lg text-gray-800">Jelajahi koleksi motif batik yang diciptakan oleh model kami.</p>
      <p class="italic text-gray-600">Klik pada gambar untuk pratinjau pola berulang</p>
    </div>
    <div class="grid lg:grid-cols-3 gap-2 md:gap-4 grid-cols-2">
      <NuxtLink 
        v-for="imageUrl in galleryImages" 
        class="relative" 
        :to="`/preview?image=${imageUrl}`"
      >
        <div class="w-full aspect-square bg-gray-200 animate-pulse"></div>
        <img loading="lazy" :src="imageUrl" class="absolute top-0 left-0 z-10">
      </NuxtLink>
    </div>
  </div>
</template>