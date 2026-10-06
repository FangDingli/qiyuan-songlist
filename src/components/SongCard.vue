<script setup lang="ts">
import type { Song } from '@/types'

defineProps<{
  song: Song
  /** 展示编号:当前列表顺序中的序号(从 1 开始),与歌曲 id 解耦,防止观众记住编号映射 */
  no: number
  highlighted?: boolean
}>()

defineEmits<{
  (e: 'order', song: Song): void
}>()

/** 分类 tag 配色,从预设色板的浅色底 + 深色字组合中按 key 稳定取色 */
const TAG_PALETTE = [
  { bg: '#E6F4FF', fg: '#0958D9' }, // blue
  { bg: '#F9F0FF', fg: '#722ED1' }, // purple
  { bg: '#E6FFFB', fg: '#08979C' }, // cyan
  { bg: '#F6FFED', fg: '#389E0D' }, // green
  { bg: '#FFF0F6', fg: '#C41D7F' }, // magenta
  { bg: '#FFF7E6', fg: '#D46B08' }, // orange
  { bg: '#FFFBE6', fg: '#D48806' }, // gold
  { bg: '#F0F5FF', fg: '#1D39C4' }, // geekblue
]

function colorOf(key: string) {
  let hash = 0
  for (const ch of key) hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) >>> 0
  return TAG_PALETTE[hash % TAG_PALETTE.length]
}

function colorStyle(key: string) {
  const c = colorOf(key)
  return { backgroundColor: c.bg, color: c.fg }
}
</script>

<template>
  <button
    type="button"
    class="song-card"
    :data-song-id="song.id"
    @click="$emit('order', song)"
  >
    <!-- 大编号水印 -->
    <span
      class="absolute right-16px top-6px text-52px lh-1 font-900 select-none pointer-events-none text-[rgb(var(--text-primary)/0.06)]"
    >
      {{ String(no).padStart(2, '0') }}
    </span>

    <!-- hover 复制提示遮罩 -->
    <span
      class="card-overlay absolute inset-0 flex-center bg-[rgb(var(--brand)/0.15)] backdrop-blur-2px"
    >
      <span class="text-brand-strong font-bold text-sm">点击复制点歌口令</span>
    </span>

    <div class="relative z-10">
      <div class="flex items-center justify-between gap-8px">
        <h3 class="min-w-0 text-16px lh-24px font-bold text-text-primary truncate" :title="song.title">
          {{ song.title }}
        </h3>
        <span class="shrink-0 text-13px font-bold text-brand-strong tracking-wide">
          {{ song.language }}
        </span>
      </div>
      <div class="mt-8px flex items-center justify-between gap-8px">
        <p class="min-w-0 text-13px text-text-secondary truncate" :title="song.artist">{{ song.artist }}</p>
        <div class="shrink-0 flex gap-6px">
          <span v-for="genre in song.genres" :key="genre" class="song-tag" :style="colorStyle(genre)">
            {{ genre }}
          </span>
        </div>
      </div>
    </div>

    <!-- 随机点歌命中的呼吸描边 -->
    <span
      v-if="highlighted"
      class="absolute inset-0 rounded-2xl border-2 border-brand pointer-events-none animate-ping-slow"
    ></span>
  </button>
</template>

<style scoped>
.card-overlay {
  opacity: 0;
  transition: opacity 0.2s var(--ease-out);
}
.song-card:hover .card-overlay {
  opacity: 1;
}

.animate-ping-slow {
  animation: ping-slow 1.2s var(--ease-out) infinite;
}
@keyframes ping-slow {
  0% {
    opacity: 0.9;
  }
  70%,
  100% {
    opacity: 0;
  }
}
</style>
