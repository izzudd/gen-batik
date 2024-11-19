<script lang="ts" setup>
const { image } = useRoute().query as { image: string }

const setBackgroundPattern = (imageUrl?: string) => {
  const root = document.documentElement.style
  root.backgroundImage = imageUrl ? `url(${imageUrl})` : ''
  root.backgroundRepeat = imageUrl ? 'repeat' : 'initial'
}

onMounted(() => setBackgroundPattern(image))
onUnmounted(() => setBackgroundPattern())
</script>

<template>
  <div class="h-screen w-full" @click="$router.back()" />
</template>