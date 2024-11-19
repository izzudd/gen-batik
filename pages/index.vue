<script lang="ts" setup>
interface BatikGallery {
  imageUrls: string[]
  isLoading: boolean
}

const { data: galleryImages, status } = useFetch<string[]>('/api/images');
const appUrl = useRuntimeConfig().public.appUrl;
</script>

<template>
  <div>
    <div class="text-center mb-20">
      <h1 class="text-4xl font-bold mb-2">Galeri</h1>
      <p class="text-lg text-gray-800">Jelajahi koleksi motif batik yang diciptakan oleh model kami.</p>
      <p class="italic text-gray-600">Klik pada gambar untuk pratinjau pola berulang</p>
    </div>
    <div class="grid lg:grid-cols-3 gap-2 md:gap-4 grid-cols-2">
      <div 
        v-for="imageUrl in galleryImages" 
        class="group relative" 
      >
        <NuxtLink :to="`/preview?image=${imageUrl}`">
          <div class="w-full aspect-square bg-gray-200 animate-pulse"></div>
          <NuxtPicture loading="lazy" :src="`${appUrl}${imageUrl}`" class="absolute top-0 left-0 w-full h-full" />
        </NuxtLink>
        <NuxtLink 
          :to="imageUrl"
          target="_blank"
          download
          class="absolute bottom-2 right-2 bg-white/40 backdrop-blur-lg px-2 py-1 rounded lg:hidden group-hover:block z-10">
          <Icon name="heroicons:arrow-down-tray"/> Unduh pola
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
picture img {
  @apply w-full h-full object-cover object-center;
}
</style>