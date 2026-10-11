<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useElementSize, useWindowSize, useWindowScroll } from '@vueuse/core'
import rawText from '@/data/songs.json?raw'
import type { Song } from '@/types'
import { formatOrder, siteConfig } from '@/config'
import { songTags, withIds } from '@/utils/songs'
import SongCard from '@/components/SongCard.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import MobileFilterBar from '@/components/MobileFilterBar.vue'
import RotatingDisc from '@/components/RotatingDisc.vue'
import { useClipboard } from '@/composables/useClipboard'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'

// 内置数据:构建时打包原样远端 JSON,保证首屏瞬间渲染;挂载后异步拉取远端最新数据替换
const songs = shallowRef<Song[]>(withIds(JSON.parse(rawText)))
const updatedAt = ref('')

onMounted(async () => {
  // 远端数据经 CF Worker 缓存后从同源 /api/songs.json 提供,失败时静默保持内置数据
  try {
    const res = await fetch('/api/songs.json', { cache: 'no-cache' })
    if (!res.ok) return
    songs.value = withIds(await res.json())
    updatedAt.value = new Date().toISOString().slice(0, 10)
  } catch {
    /* 拉取失败不影响页面,保留内置数据 */
  }
})

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
// 单选筛选:全局最多选中一个 tag,再点同款取消,点其他替换
const selectedTag = ref<{ kind: 'language' | 'genre'; name: string } | null>(null)

// 打乱:每次点击重新生成一次全量随机序,之后随筛选增删顺序保持稳定
const shuffled = ref(false)
const randomRank = ref(new Map<number, number>())
// 打乱动画:网格短暂进入 shuffling 状态,卡片带错峰抖动入场
const shuffling = ref(false)
let shuffleTimer: ReturnType<typeof setTimeout> | undefined

const highlightId = ref<number | null>(null)

/** 统计维度取值及数量,按数量降序 */
function countBy(get: (s: Song) => string | string[]): Array<[string, number]> {
  const counter = new Map<string, number>()
  for (const song of songs.value) {
    const keys = get(song)
    for (const key of Array.isArray(keys) ? keys : [keys]) {
      counter.set(key, (counter.get(key) ?? 0) + 1)
    }
  }
  return [...counter.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh'))
}

const languages = computed(() => countBy((s) => s.lang))
const genres = computed(() => countBy((s) => songTags(s)))

const tags = computed(() => [
  ...languages.value.map(([name, count]) => ({ name, count, kind: 'language' as const })),
  ...genres.value.map(([name, count]) => ({ name, count, kind: 'genre' as const })),
])

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  const sel = selectedTag.value
  const list = songs.value.filter((song) => {
    if (kw && !song.title.toLowerCase().includes(kw) && !song.singer.toLowerCase().includes(kw)) return false
    if (sel) {
      if (sel.kind === 'language' ? song.lang !== sel.name : !songTags(song).includes(sel.name)) return false
    }
    return true
  })
  if (!shuffled.value) return list
  return [...list].sort((a, b) => (randomRank.value.get(a.id) ?? 0) - (randomRank.value.get(b.id) ?? 0))
})

const hasActiveFilters = computed(() => keyword.value.trim() !== '' || selectedTag.value !== null)

function toggleTag(kind: 'language' | 'genre', name: string) {
  const cur = selectedTag.value
  selectedTag.value = cur && cur.kind === kind && cur.name === name ? null : { kind, name }
}

function clearFilters() {
  keyword.value = ''
  selectedTag.value = null
}

function shuffle() {
  const ids = songs.value.map((s) => s.id)
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }
  randomRank.value = new Map(ids.map((id, idx) => [id, idx]))
  shuffled.value = true
  // 瞬时回顶:列表整体换血,平滑滚动反而拖沓
  window.scrollTo(0, 0)
  // 播放一轮错峰抖动动画,表现随机感
  shuffling.value = true
  clearTimeout(shuffleTimer)
  shuffleTimer = setTimeout(() => (shuffling.value = false), 900)
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

const showBackTop = computed(() => scrollY.value > winH.value * 0.6)

/** 侧栏与页脚的数据说明:拉取过远端才显示更新日期 */
const dataMeta = computed(
  () => (updatedAt.value ? `数据更新于 ${updatedAt.value} · ` : '') + `共 ${songs.value.length} 首`,
)

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ---------- 移动端紧凑筛选条:滚过原面板且向上滑动时出现 ---------- */
const MOBILE_BAR_TOP = 52 // 移动端吸顶栏高度

const mobilePanelRef = ref<HTMLElement | null>(null)
const lastScrollY = ref(0)
const scrollingUp = ref(false)

watch(scrollY, (y) => {
  const delta = y - lastScrollY.value
  if (Math.abs(delta) > 2) scrollingUp.value = delta < 0
  lastScrollY.value = y
})

const mobilePanelOutOfView = computed(() => {
  void scrollY.value
  const el = mobilePanelRef.value
  return el ? el.getBoundingClientRect().bottom < MOBILE_BAR_TOP : false
})

const showMobileBar = computed(() => mobilePanelOutOfView.value && scrollingUp.value)

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
  setTimeout(() => {
    if (highlightId.value === song.id) highlightId.value = null
  }, 4000)
}
</script>

<template>
  <!-- 固定背景层:position:fixed 不随页面滚动。
       背景图在 src/config.ts 的 siteConfig.backgroundImages 里配置,移动端与宽屏各一张;
       过渡层(bg-scrim)半透明叠在图上柔化背景,亮暗模式各自取色 -->
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
    <div class="absolute inset-0 bg-[rgb(var(--bg-scrim)/var(--bg-scrim-a))] backdrop-blur-4px"></div>
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
            <p class="mt-8px text-12px text-text-secondary">{{ dataMeta }}</p>
          </div>

          <div class="surface-card p-20px">
            <FilterPanel
              v-model:keyword="keyword"
              :tags="tags"
              :selected-tag="selectedTag"
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
        <!-- 移动端筛选区:普通文档流,滚出视口后由紧凑吸顶条接管 -->
        <div ref="mobilePanelRef" class="lg:hidden mb-16px surface-card p-16px">
          <FilterPanel
            v-model:keyword="keyword"
            :tags="tags"
            :selected-tag="selectedTag"
            :shuffled="shuffled"
            :total="songs.length"
            :filtered-count="filtered.length"
            @toggle-tag="toggleTag"
            @shuffle="shuffle"
            @random="randomPick"
          />
        </div>

        <!-- 移动端紧凑筛选条:向下滚动隐藏,向上滑动出现 -->
        <Transition name="bar">
          <div
            v-if="showMobileBar"
            class="lg:hidden fixed left-0 right-0 z-40 bg-[rgb(var(--bg-card)/0.95)] backdrop-blur-xl border-b border-border"
            :style="{ top: `${MOBILE_BAR_TOP}px` }"
          >
            <MobileFilterBar
              v-model:keyword="keyword"
              :tags="tags"
              :selected-tag="selectedTag"
              @toggle-tag="toggleTag"
            />
          </div>
        </Transition>

        <!-- 虚拟滚动网格:外层撑起总高度,内层按滚动位置平移 -->
        <div
          v-if="filtered.length"
          ref="gridRef"
          class="relative"
          :class="{ 'grid-shuffling': shuffling }"
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
                :style="{ '--i': (ri * 2 + ci) % 8 }"
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
          <p class="mt-4px">{{ dataMeta }}</p>
        </footer>
      </main>
    </div>

    <!-- 回到顶部:滚动超过一屏后出现 -->
    <Transition name="toast">
      <button
        v-if="showBackTop"
        type="button"
        class="back-to-top"
        title="回到顶部"
        @click="backToTop"
      >
        <div class="i-carbon-arrow-up"></div>
      </button>
    </Transition>

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
