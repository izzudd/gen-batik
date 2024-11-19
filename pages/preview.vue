<script lang="ts" setup>
const { image } = useRoute().query as { image: string }

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
  setBackgroundPattern(image)
  window.addEventListener('mousemove', updateMousePosition)
})

onUnmounted(() => {
  setBackgroundPattern()
  window.removeEventListener('mousemove', updateMousePosition)
})
</script>

<template>
  <div class="h-screen w-full cursor-none" @click="$router.back()">
    <div class="text-center fixed bottom-12 left-0 w-full">
      <span class="bg-white/20 px-4 py-2 backdrop-blur-lg text-white rounded-full">Klik di manapun untuk kembali ke halaman utama</span>
    </div>
    <div
      class="fixed pointer-events-none w-36 h-36 rounded-full animate-pulse"
      :style="{
        left: mousePos.x + 'px',
        top: mousePos.y + 'px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
      }"
    />
    <Icon
      name="heroicons:arrow-left-20-solid"
      class="fixed pointer-events-none text-black w-12 h-12"
      :style="{
        left: mousePos.x + 'px',
        top: mousePos.y + 'px',
        transform: 'translate(-50%, -50%)'
      }"
    />
  </div>
</template>