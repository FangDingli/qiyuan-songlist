<template>
  <NConfigProvider :theme="currTheme">
    <NSpace vertical>
      <NLayout embedded class="container">
        <router-view></router-view>
      </NLayout>
    </NSpace>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { version, buildTime } from '../build/info.json'
import { computed } from 'vue'
import { NSpace, NLayout, NConfigProvider, darkTheme, useOsTheme } from 'naive-ui'
import './assets/iconfont/iconfont.css'

const osTheme = useOsTheme()
const currTheme = computed(() => (osTheme.value === 'dark' ? darkTheme : null))

console.log(
  `%c Release Build Info 
%cVersion			v${version}
BuildTime		${buildTime}`,
  'background:#000;color:#FFF;font-weight:bold;',
  'background:#FFF;color:#000;'
)
</script>

<style></style>
