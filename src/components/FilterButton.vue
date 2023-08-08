<script lang="ts" setup>
interface Props {
  isActive?: boolean
  text: string
}
const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  text: '',
})
</script>

<template>
  <div
    class="h-36px flex-center transition b-rd-8px cursor-pointer fw-400 text-16px filter_btn"
    :style="
      props.isActive
        ? 'background-color: rgba(var(--color-2), 0.6)'
        : 'background-color: rgba(var(--color-4), 0.6)'
    "
  >
    {{ props.text }}
  </div>
</template>

<style scoped>
.filter_btn:hover {
  background-color: rgba(var(--color-2), 0.6) !important;
}
</style>
