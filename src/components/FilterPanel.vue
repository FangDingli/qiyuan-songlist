<script setup lang="ts">
import TagPill from './TagPill.vue'
import type { FilterTag } from '@/types'

defineProps<{
  keyword: string
  tags: FilterTag[]
  selectedTag: { kind: FilterTag['kind']; name: string } | null
  total: number
  filteredCount: number
}>()

const emit = defineEmits<{
  (e: 'update:keyword', value: string): void
  (e: 'toggleTag', kind: FilterTag['kind'], name: string): void
  (e: 'shuffle'): void
  (e: 'random'): void
}>()
</script>

<template>
  <div class="flex flex-col gap-14px">
    <div class="relative">
      <div
        class="i-carbon-search absolute left-14px top-1/2 -translate-y-1/2 text-brand text-16px pointer-events-none"
      ></div>
      <input
        type="search"
        :value="keyword"
        placeholder="搜索歌名、歌手..."
        class="w-full h-44px px-14px pl-40px rounded-xl bg-[rgb(var(--bg-base))] text-14px text-text-primary outline-none transition-shadow duration-200 placeholder:text-text-secondary focus:shadow-[0_0_0_2px_rgb(var(--brand)/0.4)]"
        @input="emit('update:keyword', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex gap-10px">
      <button type="button" class="btn-soft flex-1" @click="emit('shuffle')">
        <div class="i-carbon-shuffle text-15px"></div>
        打乱顺序
      </button>
      <button type="button" class="btn-soft flex-1" @click="emit('random')">
        <div class="i-carbon-face-add text-15px"></div>
        随机点歌
      </button>
    </div>

    <p class="text-12px text-text-secondary">
      {{ filteredCount === total ? `共 ${total} 首` : `筛选出 ${filteredCount} / ${total} 首` }}
    </p>

    <div class="flex flex-wrap gap-8px">
      <TagPill
        v-for="tag in tags"
        :key="tag.kind + tag.name"
        :label="tag.name"
        :count="tag.count"
        :selected="!!selectedTag && selectedTag.kind === tag.kind && selectedTag.name === tag.name"
        @toggle="emit('toggleTag', tag.kind, tag.name)"
      />
    </div>
  </div>
</template>
