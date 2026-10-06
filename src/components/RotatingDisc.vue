<script setup lang="ts">
import { ref } from 'vue'
import { siteConfig } from '@/config'

const failed = ref(false)
</script>

<template>
  <a
    href="https://space.bilibili.com/303246676"
    target="_blank"
    rel="noopener noreferrer"
    title="访问主播主页"
    class="block cursor-pointer transition-opacity duration-200 hover:opacity-80"
  >
    <div class="flex-center p-8px">
      <div
        class="relative w-140px h-140px rounded-full border-3 border-brand-light flex-center animate-disc motion-reduce:animate-none"
      >
        <div class="w-110px h-110px rounded-full bg-brand-soft border-4 border-bg-card flex-center overflow-hidden">
          <img
            v-if="!failed"
            :src="siteConfig.avatar"
            class="w-full h-full rounded-full object-cover"
            alt="主播头像"
            referrerpolicy="no-referrer"
            @error="failed = true"
          />
          <div v-else class="i-carbon-music text-36px text-brand"></div>
        </div>
        <div class="absolute top-8px left-1/2 -translate-x-1/2 w-10px h-10px rounded-full bg-brand"></div>
      </div>
    </div>
  </a>
</template>

<style scoped>
.animate-disc {
  animation: disc-spin 12s linear infinite;
}
@keyframes disc-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
