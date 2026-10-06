<script setup lang="ts">
defineProps<{
  label: string
  count?: number
  selected: boolean
}>()

defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<template>
  <button type="button" class="tag-pill" :class="{ 'tag-pill-selected': selected }" @click="$emit('toggle')">
    {{ label }}
    <span v-if="count !== undefined" class="ml-4px text-12px opacity-60">{{ count }}</span>
  </button>
</template>
