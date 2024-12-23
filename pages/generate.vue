<script lang="ts" setup>
import { FetchError } from "ofetch";

interface QueueMessage {
  id: string
  length: number
  state: string
  error: boolean
}

const userPrompt = ref('')
const validationToken = ref('')
const turnstile = ref()
const generatedImageId = ref('')
const isGenerating = ref(false)
const errorMessage = ref('')

const generatedImageUrl = computed(() => `/generated/${generatedImageId.value}`)
const canDisplayImage = computed(() => !errorMessage.value && !isGenerating.value && generatedImageId.value)

const generateBatik = async (event: Event) => {
  event.preventDefault()
  generatedImageId.value = ''
  isGenerating.value = true
  errorMessage.value = ''
  
  try {
    generatedImageId.value = await $fetch('/api/generate', { 
      method: 'POST',
      body: { 
        prompt: userPrompt.value,
        token: validationToken.value,
      } 
    })
  } catch (err) {
    if (err instanceof FetchError && err.statusCode === 422)
      errorMessage.value = 'Tolong centang kotak validasi untuk memastkan anda bukan robot'
    else 
      errorMessage.value = 'Terjadi kesalahan pada server, silahkan coba lagi'
    isGenerating.value = false
  }
}

watch(isGenerating, (isGenerating) => {
  if (!isGenerating) turnstile.value?.reset()
})

const queueLength = ref(0)
let queueMonitor: EventSource
const setupQueueMonitoring = () => {
  queueMonitor = new EventSource(`/api/queue`)
  queueMonitor.onmessage = (event) => {
    const { id, length, state, error }: QueueMessage = JSON.parse(event.data)
    queueLength.value = length
    console.log('Queue message', id, length, state, error)

    if (error && id === generatedImageId.value) {
      errorMessage.value = 'Terjadi kesalahan saat membuat batik, silahkan coba lagi beberapa saat lagi'
      return
    }
    if (id === generatedImageId.value && state === 'done') {
      isGenerating.value = false
    }
  }
}

const isServerAvailable = ref(true)
const checkServer = async () => {
  try {
    await $fetch('/api/check')
    isServerAvailable.value = true
  } catch {
    isServerAvailable.value = false
  }
}

let serverCheckInterval: NodeJS.Timeout
const startServerCheck = () => {
  checkServer()
  serverCheckInterval = setInterval(checkServer, 30000) // Check every 30 seconds
}

const generateRandomPrompt = () => {
  const elements = {
    colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'earth'],
    patterns: ['flower', 'leaf', 'tree', 'dragon', 'bird', 'fish', 'line and dot', 'cloud', 'abstract pattern', 'geometric']
  }
  
  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  userPrompt.value = `batik with ${getRandomElement(elements.colors)} color ${getRandomElement(elements.patterns)} in ${getRandomElement(elements.colors)} background`
}

onMounted(() => {
  setupQueueMonitoring()
  startServerCheck()
})
onUnmounted(() => {
  queueMonitor?.close()
  clearInterval(serverCheckInterval)
})
</script>

<template>
  <div>
    <div class="text-center mb-16">
      <h1 class="text-4xl font-bold mb-2">Buat Pola<Icon name="heroicons:sparkles-solid" class="text-yellow-400"/></h1>
      <p class="text-lg italic text-gray-600">Buat motif batikmu sendiri cukup dengan deskripsi singkat.</p>
    </div>
    <form @submit="generateBatik" class="flex justify-center items-center flex-col gap-2" :class="{ 'opacity-50 pointer-events-none': !isServerAvailable }">
      <div class="max-w-prose w-full flex border-b border-gray-300 p-2">
        <input 
          type="text" 
          class="flex-grow text-lg" 
          v-model="userPrompt"
          placeholder="Masukkan deskripsi motif batik di sini..." 
          required
        />
        <span class="flex items-center gap-2">
          <button type="submit" class="flex items-center"><Icon class="flex items-center" name="heroicons:sparkles" size="1.5rem" /></button>
          <button type="button" @click="generateRandomPrompt()"><Icon class="flex items-center" name="mdi:dice-multiple" size="1.5rem" /></button>
        </span>
      </div>
      <NuxtTurnstile v-model="validationToken" ref="turnstile" />
    </form>
    <div v-if="!isServerAvailable" class="text-red-500 text-center mt-4">Server sedang tidak tersedia, silahkan coba beberapa saat lagi</div>
    <div v-if="errorMessage" class="text-red-500 text-center text-sm mt-4">{{ errorMessage }}</div>
    <div class="flex justify-center mt-4 flex-col items-center">
      <NuxtLink class="relative max-w-full w-[512px] aspect-square" :to="canDisplayImage ? `/preview?image=${generatedImageUrl}` : undefined">
        <div v-if="isGenerating"class="w-full aspect-square bg-gray-200 animate-pulse" />
        <img v-if="canDisplayImage"
          class="absolute top-0 left-0 z-10 w-full h-full" :src="generatedImageUrl"
        >
      </NuxtLink>
      <div v-if="queueLength" class="text-gray-600 text-sm mt-4">sedang ada {{ queueLength }} proses dalam antrean</div>
    </div>
  </div>
</template>