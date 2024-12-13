<script lang="ts" setup>
import '~/assets/css/main.css'

useHead({ 
  title: 'GenBatik | AI Batik Generator',
  script: [{ src: "https://medama.izzudd.my.id/script.js", defer: true }],
})
</script>

<template>
  <NavBar />
  <div class="container mx-auto px-2 mt-16 pb-8">
    <NuxtPage />
  </div>
</template>
