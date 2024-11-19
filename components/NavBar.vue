<template>
  <div class="shadow-lg sticky top-0 backdrop-blur-xl bg-white/20 z-[999]">
    <div class="container mx-auto px-2 py-2 flex justify-between items-center">
      <NuxtLink to="/" class="text-2xl">
        <span class="font-bold">Gen</span><span>Batik</span>
      </NuxtLink>
      <nav class="flex gap-2 items-center">
        <NuxtLink to="/" class="text-lg hover:underline hidden md:block">Galeri</NuxtLink>
        <NuxtLink to="/about" class="text-lg ml-4 hover:underline hidden md:block">Tentang</NuxtLink>
        <NuxtLink to="/generate" class="text-lg ml-4 bg-black text-white py-2 px-4 flex items-center gap-1 hover:underline hover:bg-gray-700">
          <span>Buat Pola</span>
          <Icon name="heroicons:sparkles-solid"/>
        </NuxtLink>
      </nav>
    </div>
    <nav class="flex gap-2 py-1 items-center justify-center bg-black/10 md:hidden">
      <NuxtLink to="/" class="text-lg hover:underline">Galeri</NuxtLink>
      <NuxtLink to="/about" class="text-lg ml-4 hover:underline">Tentang</NuxtLink>
    </nav>
  </div>
</template>