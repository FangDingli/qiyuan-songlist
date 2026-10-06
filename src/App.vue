<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementSize, useWindowSize, useWindowScroll } from '@vueuse/core'
import rawText from '@/data/songs.json?raw'
import type { Song, SonglistData } from '@/types'
import { formatOrder, siteConfig } from '@/config'
import SongCard from '@/components/SongCard.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import RotatingDisc from '@/components/RotatingDisc.vue'
import { useClipboard } from '@/composables/useClipboard'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'

const { updatedAt, songs } = JSON.parse(rawText) as SonglistData

const { copy } = useClipboard()
const { toasts, show } = useToast()
const { mode, cycleMode } = useTheme()

/* ---------- 虚拟滚动常量(行高需与 song-card 的 h-90px + 间距一致) ---------- */
const CARD_H = 90
const GAP = 16
const ROW_H = CARD_H + GAP
const CARD_MIN_W = 240
const OVERSCAN = 3

const themeIcon = computed(() =>
  mode.value === 'auto' ? 'i-carbon-contrast' : mode.value === 'light' ? 'i-carbon-sun' : 'i-carbon-moon',
)
const themeTitle = computed(() =>
  mode.value === 'auto' ? '主题:跟随系统(点击切换为亮色)' : mode.value === 'light' ? '主题:亮色(点击切换为暗色)' : '主题:暗色(点击切换为跟随系统)',
)

const keyword = ref('')
const selectedLanguages = ref(new Set<string>())
const selectedGenres = ref(new Set<string>())

// 打乱:每次点击重新生成一次全量随机序,之后随筛选增删顺序保持稳定
const shuffled = ref(false)
const randomRank = ref(new Map<number, number>())

const highlightId = ref<number | null>(null)

/** 统计维度取值及数量,按数量降序 */
function countBy(get: (s: Song) => string | string[]): Array<[string, number]> {
  const counter = new Map<string, number>()
  for (const song of songs) {
    const keys = get(song)
    for (const key of Array.isArray(keys) ? keys : [keys]) {
      counter.set(key, (counter.get(key) ?? 0) + 1)
    }
  }
  return [...counter.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh'))
}

const languages = computed(() => countBy((s) => s.language))
const genres = computed(() => countBy((s) => s.genres))

const tags = computed(() => [
  ...languages.value.map(([name, count]) => ({ name, count, kind: 'language' as const })),
  ...genres.value.map(([name, count]) => ({ name, count, kind: 'genre' as const })),
])

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  const langs = selectedLanguages.value
  const genreSel = selectedGenres.value
  const list = songs.filter((song) => {
    if (kw && !song.title.toLowerCase().includes(kw) && !song.artist.toLowerCase().includes(kw)) return false
    if (langs.size && !langs.has(song.language)) return false
    if (genreSel.size && !song.genres.some((g) => genreSel.has(g))) return false
    return true
  })
  if (!shuffled.value) return list
  return [...list].sort((a, b) => (randomRank.value.get(a.id) ?? 0) - (randomRank.value.get(b.id) ?? 0))
})

const hasActiveFilters = computed(
  () => keyword.value.trim() !== '' || selectedLanguages.value.size > 0 || selectedGenres.value.size > 0,
)

function toggleTag(kind: 'language' | 'genre', name: string) {
  const set = kind === 'language' ? selectedLanguages.value : selectedGenres.value
  if (set.has(name)) set.delete(name)
  else set.add(name)
}

function clearFilters() {
  keyword.value = ''
  selectedLanguages.value = new Set()
  selectedGenres.value = new Set()
}

function shuffle() {
  const ids = songs.map((s) => s.id)
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }
  randomRank.value = new Map(ids.map((id, idx) => [id, idx]))
  shuffled.value = true
}

async function orderSong(song: Song) {
  const text = formatOrder(song)
  const ok = await copy(text)
  show(ok ? `已复制:${text}` : '复制失败,请手动复制', ok ? 'success' : 'error')
}

/* ---------- 窗口级虚拟滚动:把列表按列数切块成行,只渲染视口附近的行 ---------- */
const mainEl = ref<HTMLElement | null>(null)
const { width: mainW } = useElementSize(mainEl)
const { y: scrollY } = useWindowScroll()
const { height: winH } = useWindowSize()

const cols = computed(() => {
  const w = mainW.value
  if (!w) return 4
  return Math.min(5, Math.max(1, Math.floor((w + GAP) / (CARD_MIN_W + GAP))))
})

const rows = computed(() => {
  const list = filtered.value
  const out: Song[][] = []
  for (let i = 0; i < list.length; i += cols.value) out.push(list.slice(i, i + cols.value))
  return out
})

const gridRef = ref<HTMLElement | null>(null)

const firstVisible = computed(() => {
  void rows.value.length
  void cols.value
  // 读取滚动位置建立响应式依赖:滚动时重算可视行
  void scrollY.value
  const el = gridRef.value
  if (!el) return 0
  const scrolled = -el.getBoundingClientRect().top
  const raw = Math.floor(scrolled / ROW_H) - OVERSCAN
  return Math.max(0, Math.min(raw, rows.value.length - 1))
})

const visibleRows = computed(() => {
  const count = Math.ceil(winH.value / ROW_H) + OVERSCAN * 2 + 1
  return rows.value.slice(firstVisible.value, firstVisible.value + count)
})

async function randomPick() {
  const pool = filtered.value
  if (!pool.length) {
    show('当前筛选条件下没有歌曲', 'error')
    return
  }
  const song = pool[Math.floor(Math.random() * pool.length)]
  const ok = await copy(formatOrder(song))
  show(ok ? `选中《${song.title}》,口令已复制` : '复制失败,请手动复制', ok ? 'success' : 'error')
  highlightId.value = song.id
  // 选中卡可能未被虚拟滚动渲染,直接按行列号算出目标位置滚动
  const idx = pool.indexOf(song)
  const rowIdx = Math.floor(idx / cols.value)
  const base = gridRef.value ? gridRef.value.getBoundingClientRect().top + window.scrollY : 0
  window.scrollTo({ top: Math.max(0, base + rowIdx * ROW_H - winH.value / 2 + CARD_H / 2), behavior: 'smooth' })
  setTimeout(() => {
    if (highlightId.value === song.id) highlightId.value = null
  }, 4000)
}
</script>

<template>
  <!-- 固定背景层:position:fixed 不随页面滚动。
       背景图在 src/config.ts 的 siteConfig.backgroundImages 里配置,移动端与宽屏各一张 -->
  <div class="fixed inset-0 -z-10 bg-bg-base" aria-hidden="true">
    <img
      v-if="siteConfig.backgroundImages.mobile"
      :src="siteConfig.backgroundImages.mobile"
      class="w-full h-full object-cover lg:hidden"
      alt=""
    />
    <img
      v-if="siteConfig.backgroundImages.desktop"
      :src="siteConfig.backgroundImages.desktop"
      class="hidden w-full h-full object-cover lg:block"
      alt=""
    />
  </div>

  <div class="min-h-screen">
    <!-- 移动端吸顶栏 -->
    <div
      class="lg:hidden sticky top-0 z-50 bg-[rgb(var(--bg-card)/0.9)] backdrop-blur-xl border-b border-border"
    >
      <div class="flex items-center justify-between gap-12px px-16px h-52px">
        <div class="flex items-center gap-8px min-w-0">
          <div class="i-carbon-music text-brand text-18px shrink-0"></div>
          <h1 class="text-17px lh-24px font-bold text-text-primary truncate">{{ siteConfig.title }}</h1>
          <span class="shrink-0 text-12px text-text-secondary">共 {{ songs.length }} 首</span>
        </div>
        <button type="button" class="theme-toggle shrink-0" :title="themeTitle" @click="cycleMode">
          <div :class="themeIcon"></div>
        </button>
      </div>
    </div>

    <div class="max-w-1720px mx-auto flex gap-24px p-16px md:p-24px">
      <!-- 桌面侧栏 -->
      <aside class="hidden lg:block w-300px shrink-0">
        <div class="sticky top-24px flex flex-col gap-24px">
          <div class="surface-card p-24px relative flex flex-col items-center">
            <button type="button" class="theme-toggle absolute top-16px right-16px" :title="themeTitle" @click="cycleMode">
              <div :class="themeIcon"></div>
            </button>
            <RotatingDisc />
            <h2 class="mt-12px text-18px lh-28px font-bold text-text-primary">{{ siteConfig.title }}</h2>
            <p class="mt-8px text-13px text-text-secondary text-center px-8px">{{ siteConfig.subtitle }}</p>
            <p class="mt-8px text-12px text-text-secondary">数据更新于 {{ updatedAt }} · 共 {{ songs.length }} 首</p>
          </div>

          <div class="surface-card p-20px">
            <FilterPanel
              v-model:keyword="keyword"
              :tags="tags"
              :selected-languages="selectedLanguages"
              :selected-genres="selectedGenres"
              :shuffled="shuffled"
              :total="songs.length"
              :filtered-count="filtered.length"
              @toggle-tag="toggleTag"
              @shuffle="shuffle"
              @random="randomPick"
            />
          </div>
        </div>
      </aside>

      <main ref="mainEl" class="flex-1 min-w-0">
        <!-- 移动端筛选区 -->
        <div class="lg:hidden mb-16px surface-card p-16px">
          <FilterPanel
            v-model:keyword="keyword"
            :tags="tags"
            :selected-languages="selectedLanguages"
            :selected-genres="selectedGenres"
            :shuffled="shuffled"
            :total="songs.length"
            :filtered-count="filtered.length"
            @toggle-tag="toggleTag"
            @shuffle="shuffle"
            @random="randomPick"
          />
        </div>

        <!-- 虚拟滚动网格:外层撑起总高度,内层按滚动位置平移 -->
        <div
          v-if="filtered.length"
          ref="gridRef"
          class="relative"
          :style="{ height: `${rows.length * ROW_H}px` }"
        >
          <div
            class="absolute left-0 right-0 top-0"
            :style="{ transform: `translateY(${firstVisible * ROW_H}px)` }"
          >
            <div
              v-for="(row, ri) in visibleRows"
              :key="row[0].id"
              class="grid gap-16px mb-16px"
              :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }"
            >
              <SongCard
                v-for="(song, ci) in row"
                :key="song.id"
                :song="song"
                :no="(firstVisible + ri) * cols + ci + 1"
                :highlighted="song.id === highlightId"
                @order="orderSong"
              />
            </div>
          </div>
        </div>
        <div v-else class="surface-card py-64px text-center">
          <div class="i-carbon-music text-40px text-brand-light"></div>
          <p class="mt-12px text-14px text-text-secondary">没有找到符合条件的歌曲</p>
          <button
            v-if="hasActiveFilters"
            type="button"
            class="mt-12px text-14px text-brand-strong font-bold bg-transparent border-none cursor-pointer hover:opacity-80"
            @click="clearFilters"
          >
            清除筛选条件
          </button>
        </div>

        <footer class="text-center px-16px pt-8px pb-32px text-12px text-text-secondary">
          <p>
            制作
            <a
              href="https://space.bilibili.com/23598218"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-strong hover:underline underline-offset-2px"
            >归墟丶</a>
            · UI
            <a
              href="https://space.bilibili.com/94843915"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-strong hover:underline underline-offset-2px"
            >来只奶茶</a>
             · with GLM-5.3-Flash
          </p>
          <p class="mt-4px">数据更新于 {{ updatedAt }}</p>
        </footer>
      </main>
    </div>

    <!-- Toast -->
    <div
      class="fixed bottom-24px left-1/2 -translate-x-1/2 z-100 flex flex-col items-center gap-8px pointer-events-none"
    >
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
          :class="t.type === 'error' ? 'bg-error' : 'bg-[rgba(0,0,0,0.85)]'"
        >
          {{ t.text }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
