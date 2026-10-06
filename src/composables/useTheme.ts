import { computed, ref, watch } from 'vue'

export type ThemeMode = 'auto' | 'light' | 'dark'

const STORAGE_KEY = 'songlist-theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')

function loadMode(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'light' || saved === 'dark' ? saved : 'auto'
}

// 模块级单例:整个应用共享一个主题状态
const mode = ref<ThemeMode>(loadMode())
const systemDark = ref(media.matches)

media.addEventListener('change', (e) => {
  systemDark.value = e.matches
})

const resolved = computed<'light' | 'dark'>(() =>
  mode.value === 'auto' ? (systemDark.value ? 'dark' : 'light') : mode.value,
)

watch(
  resolved,
  (value) => {
    document.documentElement.classList.toggle('dark', value === 'dark')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', value === 'dark' ? '#161623' : '#EEEAFF')
  },
  { immediate: true },
)

function setMode(next: ThemeMode) {
  mode.value = next
  if (next === 'auto') localStorage.removeItem(STORAGE_KEY)
  else localStorage.setItem(STORAGE_KEY, next)
}

/** 循环切换:跟随系统 → 亮色 → 暗色 */
function cycleMode() {
  setMode(mode.value === 'auto' ? 'light' : mode.value === 'light' ? 'dark' : 'auto')
}

export function useTheme() {
  return { mode, resolved, cycleMode }
}
