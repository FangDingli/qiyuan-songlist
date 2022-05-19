<template>
  <!-- <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">1</main> -->
  <NConfigProvider :theme="currTheme" style="height: 99vh">
    <NMessageProvider>
      <NDialogProvider>
        <NLayout embedded style="height: 99vh">
          <router-view></router-view>
        </NLayout>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NLayout,
  NConfigProvider,
  darkTheme,
  useOsTheme,
  NMessageProvider,
  NDialogProvider,
} from 'naive-ui'

const osTheme = useOsTheme()
const currTheme = computed(() => (osTheme.value === 'dark' ? darkTheme : null))
</script>
