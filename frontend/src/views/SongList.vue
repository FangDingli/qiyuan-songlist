<template>
  <div class="h-5% min-h-50px">
    <SongListHeader :searchMode="isSearchMode" @setSearchMode="setSearchMode"></SongListHeader>
  </div>
  <!-- 不加 overflow-y-scroll 会出现右侧滚动条   改成 hidden 的话最后一条数据会在太下面显示不出  好像是因为表头的原因 神奇 -->
  <div class="flex w-100% h-93% max-h-93% overflow-x-hidden overflow-y-scroll" ref="tableContainer">
    <div
      class="w-100% transition-all duration-500 ease flex-shrink-0"
      :class="{ '-ml-100%': isSearchMode }"
    >
      <SongsTable :songs="songlist.songlist" :tableHeight="tableHeight + 'px'"></SongsTable>
    </div>
    <div class="w-100% transition-all duration-500 ease flex-shrink-0">
      <SongsTable :songs="songlist.searchedList" :tableHeight="tableHeight + 'px'"></SongsTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useSongStore } from '~/store/songTable'
import { useResizeObserver, refDebounced } from '@vueuse/core'
import { getSongList } from '../composables/getSongList'
import SongListHeader from '../components/SongListHeader.vue'
import SongsTable from '../components/SongsTable.vue'

const songlist = useSongStore()

const isSearchMode = ref(false)
const setSearchMode = (val: boolean) => {
  isSearchMode.value = val
}

const tableContainer = ref<HTMLDivElement | null>(null)
let tableHeight = ref<number>(0)

let resizeHeight = ref(0)
tableHeight = refDebounced(resizeHeight, 1000)
watch(tableHeight, () => {
  console.log(tableHeight.value)
})

onMounted(() => {
  tableHeight.value = tableContainer.value!.clientHeight
  getSongList()
  useResizeObserver(tableContainer, entries => {
    const entry = entries[0]
    resizeHeight.value = entry.contentRect.height
  })
})
</script>
