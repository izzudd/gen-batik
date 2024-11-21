<script lang="ts" setup>
const { image } = useRoute().query as { image: string }
const appUrl = useRuntimeConfig().public.appUrl

const img = useImage()
const backgroundImage = computed(() => {
  const imgUrl = img(`${appUrl}${image}`, { width: 256, format: 'jpg' })
  return imgUrl
})

const setBackgroundPattern = (imageUrl?: string) => {
  const root = document.documentElement.style
  root.backgroundImage = imageUrl ? `url(${imageUrl})` : ''
  root.backgroundRepeat = imageUrl ? 'repeat' : 'initial'
}

const mousePos = reactive({ x: 0, y: 0 })
const updateMousePosition = (event: MouseEvent) => {
  mousePos.x = event.clientX
  mousePos.y = event.clientY
}

onMounted(() => {
  setBackgroundPattern(backgroundImage.value)
  window.addEventListener('mousemove', updateMousePosition)
})

onUnmounted(() => {
  setBackgroundPattern()
  window.removeEventListener('mousemove', updateMousePosition)
})
</script>

<template>
  <div class="h-screen w-full">
    <div class="text-center fixed bottom-0 left-0 w-full z-[999]">
      <NuxtLink 
        :to="image"
        target="_blank"
        download
        class="block mb-2 w-fit mx-auto bg-white/40 backdrop-blur-lg px-2 py-1 rounded z-10 border border-black/20">
        <Icon name="heroicons:arrow-down-tray"/> Unduh pola
      </NuxtLink>
      <div class="bg-black/40 text-white py-1 backdrop-blur-lg">Klik di manapun untuk kembali ke halaman utama</div>
    </div>
    <div
      class="fixed w-36 h-36 rounded-full animate-pulse flex items-center justify-center"
      @click="$router.back()"
      :style="{
        left: mousePos.x + 'px',
        top: mousePos.y + 'px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
      }">
    </div>
  </div>
</template>
