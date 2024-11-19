<script lang="ts" setup>
interface BatikGallery {
  images: string[]
  hasMore: boolean
}

const page = ref(1);
const images = ref<string[]>([]);
const isLoading = ref(false);
const observer = ref<IntersectionObserver | null>(null);
const loadingTrigger = ref<HTMLElement | null>(null);
const appUrl = useRuntimeConfig().public.appUrl;

const fetchImages = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  
  const { data } = await useFetch<BatikGallery>('/api/images', {
    params: { page: page.value, limit: 12 }
  });

  if (data.value) {
    images.value.push(...data.value.images);
    if (data.value.hasMore) {
      page.value++;
    } else {
      observer.value?.disconnect();
    }
  }
  isLoading.value = false;
};

onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      fetchImages();
    }
  });

  if (loadingTrigger.value) {
    observer.value.observe(loadingTrigger.value);
  }
});

onUnmounted(() => {
  observer.value?.disconnect();
});

// Initial load
fetchImages();
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
        v-for="imageUrl in images" 
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
          class="absolute bottom-2 right-2 bg-white/40 backdrop-blur-lg px-2 py-1 rounded hidden group-hover:block z-10 border border-black/20">
          <Icon name="heroicons:arrow-down-tray"/> Unduh pola
        </NuxtLink>
      </div>
    </div>
    <!-- Loading trigger element -->
    <div ref="loadingTrigger" class="h-4 mt-4"></div>
    <div v-if="isLoading" class="text-center py-4">
      Loading more images...
    </div>
  </div>
</template>

<style lang="postcss">
picture img {
  @apply w-full h-full object-cover object-center;
}
</style>