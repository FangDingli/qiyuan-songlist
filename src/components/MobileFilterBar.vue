<script setup lang="ts">
import TagPill from './TagPill.vue'
import type { FilterTag } from '@/types'

defineProps<{
  keyword: string
  tags: FilterTag[]
  selectedTag: { kind: FilterTag['kind']; name: string } | null
}>()

const emit = defineEmits<{
  (e: 'update:keyword', value: string): void
  (e: 'toggleTag', kind: FilterTag['kind'], name: string): void
}>()
</script>

<template>
  <!-- 移动端吸顶紧凑条:小搜索框 + 不带数量的 tag,横向滚动,尽量少占空间 -->
  <div class="px-12px py-8px">
    <div class="relative">
      <div
        class="i-carbon-search absolute left-10px top-1/2 -translate-y-1/2 text-brand text-14px pointer-events-none"
      ></div>
      <input
        type="search"
        :value="keyword"
        placeholder="搜索歌名、歌手..."
        class="w-full h-36px px-10px pl-30px rounded-lg bg-[rgb(var(--bg-base))] text-13px text-text-primary outline-none transition-shadow duration-200 placeholder:text-text-secondary focus:shadow-[0_0_0_2px_rgb(var(--brand)/0.4)]"
        @input="emit('update:keyword', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="hide-scrollbar mt-8px flex gap-6px overflow-x-auto pb-1px">
      <TagPill
        v-for="tag in tags"
        :key="tag.kind + tag.name"
        class="shrink-0"
        :label="tag.name"
        :selected="!!selectedTag && selectedTag.kind === tag.kind && selectedTag.name === tag.name"
        @toggle="emit('toggleTag', tag.kind, tag.name)"
      />
    </div>
  </div>
</template>
