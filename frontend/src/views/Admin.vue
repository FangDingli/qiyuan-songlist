<template>
  <div class="flex flex-col h-98vh">
    <div class="h-10%">
      <NButton type="primary">添加</NButton>
      <div class="w-50%">
        <NInput
          :placeholder="`编号、歌名、歌手名搜索，总歌曲数：${songlist.songlist.length}`"
          v-model:value="inputVal"
          @keyup.enter="handleSearch"
        ></NInput>
      </div>
    </div>
    <div class="h-89% flex">
      <div class="w-50% h-100% flex overflow-x-hidden overflow-y-scroll">
        <div
          class="h-100% w-100% flex-shrink-0 transition-all duration-300"
          :class="{ '-ml-100%': searchMode }"
          ref="tableContainer"
        >
          <AdminTable :songs="songlist.songlist" :tableHeight="tableHeight + 'px'"></AdminTable>
        </div>
        <div class="h-100% w-100% flex-shrink-0 transition-all duration-300" ref="tableContainer">
          <AdminTable :songs="searchResult" :tableHeight="tableHeight + 'px'"></AdminTable>
        </div>
      </div>

      <div class="h-100% w-50%" ref="tableContainer">
        <AdminTable :songs="editableList" :needVirtualScroll="false"></AdminTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { NButton, useMessage, NInput } from 'naive-ui'
import { useResizeObserver, refDebounced } from '@vueuse/core'
import AdminTable from '../components/AdminTable.vue'
import { useSongStore } from '~/store/songTable'
import { getSongList, getLanguageDict } from '../composables/getSongList'
import type { ISongInfo } from '~/type'

const songlist = useSongStore()

window.$message = useMessage()

let editableList = ref<ISongInfo[]>([])

let inputVal = ref('')
let searchMode = ref(false)
let searchResult = ref<ISongInfo[]>([])
const handleSearch = () => {
  if (inputVal.value.length === 0) {
    searchMode.value = false
  } else {
    let resultList: ISongInfo[] = []
    const searchReg = new RegExp(inputVal.value, 'i')
    songlist.songlist.forEach(item => {
      if (searchReg.test(item.original_name) || searchReg.test(item.singer)) {
        resultList.push(item)
      }
    })
    searchResult.value = resultList
    searchMode.value = true
  }
}
watch(inputVal, val => {
  if (val.length == 0) {
    searchMode.value = false
  }
})

const tableContainer = ref<HTMLDivElement | null>(null)
let tableHeight = ref<number>(0)

let resizeHeight = ref(0)
tableHeight = refDebounced(resizeHeight, 1000)

onMounted(() => {
  tableHeight.value = tableContainer.value!.clientHeight
  getSongList()
  getLanguageDict()
  useResizeObserver(tableContainer, entries => {
    const entry = entries[0]
    resizeHeight.value = entry.contentRect.height
  })
})
</script>
