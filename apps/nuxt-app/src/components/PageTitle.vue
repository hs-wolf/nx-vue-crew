<script setup lang="ts"></script>

<template>
  <div class="flex flex-col">
    <h1 class="text-2xl">{{ $t('key') }}</h1>
    <NuxtImg
      src="/nuxt-logo.png"
      alt="Nuxt Logo"
      width="1200"
      height="600"
      sizes="sm:100vw md:100vw lg:100vw"
      format="webp"
      quality="80"
    />
  </div>
</template>
