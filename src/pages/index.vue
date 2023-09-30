<script lang="ts" setup>
import { useSonglistStore } from '~/store'
import type SongGridTable from '../components/SongGridTable.vue'
import type FilterBox from '../components/FilterBox.vue'
import { arrRandChoice } from '~/composables/useSongFilter'
import Danmaku from '../components/Danmaku.vue'

const store = useSonglistStore()

let scrollElement = $ref<HTMLElement | null>(null)

const songGridComp = $ref<InstanceType<typeof SongGridTable>>()

const handleRandomClick = () => {
  songGridComp?.handleRandomClick()
}

useInfiniteScroll(
  $$(scrollElement),
  () => {
    if (scrollElement && store.songlistState.total > 0) {
      store.loadMore()
    }
  },
  { distance: 100 },
)

const triggerInfiniteScroll = (trigger: boolean) => {
  if (trigger) {
    scrollElement = document.getElementById('scrollContainer')?.firstChild as HTMLElement
  } else {
    scrollElement = null
  }
}

const setCurrentTheme = () => {
  const isMobile = useMediaQuery('(max-width: 639.9px)')

  useFetch('/theme.json')
    .get()
    .json()
    .then(res => {
      let theme = {} as any
      if (isMobile.value) {
        theme = arrRandChoice(res.data.value.mobile) as any
      } else {
        theme = arrRandChoice(res.data.value.pc) as any
      }
      Object.keys(theme).forEach(item => {
        document.documentElement.style.setProperty(item, theme[item])
      })
    })
}

watch(
  () => store.listDisplay.value.length,
  () => {
    console.log('store.listDisplay.value.length')
    // DOM节点过多后这个动画会导致页面卡顿严重
    if (store.listDisplay.value.length >= 400) {
      const htmlRoot = document.getElementsByTagName('html')[0]
      htmlRoot.style.animation = 'none'
    }
    // 触底后依然在无限触发 useInfiniteScroll
    if (store.listDisplay.value.length >= store.songlistState.listAll.length) {
      triggerInfiniteScroll(false)
    } else {
      triggerInfiniteScroll(true)
    }
  },
)

const filterBoxComp = $ref<InstanceType<typeof FilterBox>>()
const currActiveBtn = $computed(() => filterBoxComp?.currActiveBtn)

onMounted(() => {
  setCurrentTheme()
  triggerInfiniteScroll(true)
})
</script>

<template>
  <Danmaku></Danmaku>
  <NScrollbar id="scrollContainer" class="min-h-full songlist_main_container">
    <div pos="fixed lt-sm:absolute z-2 top-20px left-20px">
      <BiliLink></BiliLink>
    </div>
    <div
      pos="fixed lt-sm:absolute z-2 top-20px right-20px"
      flex="~ col justify-center items-center"
      class="color-6"
    >
      <a href="https://pome.vip/Wh7OjJyc" target="_blank" class="color-6">
        <div i-uil-parking-square class="w-40px h-40px cursor-pointer"></div>
      </a>

      匿名提问箱
    </div>
    <div class="w-80% m-x-auto" lt-sm="w-full">
      <Head :active-btn="currActiveBtn"></Head>
      <FilterBox ref="filterBoxComp" @random="handleRandomClick"></FilterBox>
      <div class="b-rd-10px" style="background-color: rgba(var(--color-3), 0.85)">
        <SongGridTable ref="songGridComp"></SongGridTable>
      </div>
      <div style="background-color: rgba(var(--color-3), 0.85)" class="text-18px text-center">
        <a
          href="https://space.bilibili.com/23598218"
          target="_blank"
          class="color-5 text-shadow-lg no-underline"
          >Powerd by © 归墟丶 2022 - PRESENT</a
        >
      </div>
      <div class="m-y-10px text-18px text-center">
        <a href="https://beian.miit.gov.cn" target="_blank" class="color-5 text-shadow-lg"
          >浙ICP备2022014652号</a
        >
      </div>
    </div>
  </NScrollbar>
</template>

<style>
.songlist_main_container {
  background-color: rgba(var(--color-1), 0.5);
}
.songlist_main_container .n-scrollbar-content::before {
  background-image: var(--bgi);
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
  content: '';
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  width: 100%;
  will-change: transform;
  z-index: -1;
}
.songlist_main_container .n-scrollbar-content {
  position: relative;
}
</style>
