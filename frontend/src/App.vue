<template>
  <!-- <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">1</main> -->
  <NConfigProvider :theme="currTheme" style="height: 99vh">
    <NMessageProvider>
      <NLayout embedded style="height: 99vh">
        <router-view></router-view>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NLayout, NConfigProvider, darkTheme, useOsTheme, NMessageProvider } from 'naive-ui'

const osTheme = useOsTheme()
const currTheme = computed(() => (osTheme.value === 'dark' ? darkTheme : null))
</script>
