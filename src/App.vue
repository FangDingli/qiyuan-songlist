<script lang="ts" setup>
import { darkTheme, useOsTheme } from 'naive-ui'
import { currentTheme, setCurrentTheme } from '~/utils'

const osThemeRef = useOsTheme()
setCurrentTheme(osThemeRef.value === 'light' ? null : darkTheme)

/* let homePageStyle: HTMLStyleElement | undefined

const updateHomePageStyle = (value: boolean) => {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}

watch(
  () => location.pathname,
  () => updateHomePageStyle(location.pathname === '/'),
  { immediate: true }
) */
</script>

<template>
  <Suspense>
    <NConfigProvider class="h-full" :theme="currentTheme">
      <NaiveProvider>
        <RouterView></RouterView>
      </NaiveProvider>
    </NConfigProvider>
  </Suspense>
</template>

<style>
#app {
  scroll-behavior: smooth;
}
</style>
