<template>
  <div class="h-5% min-h-50px">
    <SongListHeader :searchMode="isSearchMode" @setSearchMode="setSearchMode"></SongListHeader>
  </div>
  <div class="flex h-4% w-80% m-x-auto items-center">
    <NRadioGroup v-model:value="radioValue" @change="handleRadioChange">
      <div class="inline-block mr-4" text="qiyuan 16px">语种：</div>
      <NRadio class="mr-5" label="全部" value="全部"></NRadio>
      <NRadio
        class="mr-8"
        v-for="item in songInfo.languageDict"
        :key="item.sortNum"
        :label="item.label"
        :value="item.value"
      ></NRadio>
    </NRadioGroup>
    <div class="inline-block mr-4 ml-4" text="qiyuan 16px">曲风：</div>
    <NCheckboxGroup v-model:value="checkboxValue" @update:value="handleRadioChange" :min="1">
      <NCheckbox
        class="mr-8"
        v-for="item in songInfo.keywordDict"
        :key="item.sortNum"
        :label="item.label"
        :value="item.value"
      ></NCheckbox>
    </NCheckboxGroup>
  </div>
  <!-- 不加 overflow-y-scroll 会出现右侧滚动条   改成 hidden 的话最后一条数据会在太下面显示不出  好像是因为表头的原因 神奇 -->
  <div class="flex w-100% h-90% overflow-x-hidden overflow-y-scroll" ref="tableContainer">
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
import { useMessage, NRadioGroup, NRadio, NCheckboxGroup, NCheckbox } from 'naive-ui'
import { useSongStore, useSonginfoStore } from '~/store/songTable'
import { useResizeObserver, refDebounced } from '@vueuse/core'
import { getAllData } from '../composables/getSongList'
import SongListHeader from '../components/SongListHeader.vue'
import SongsTable from '../components/SongsTable.vue'
import type { ISongInfo } from '~/type'

const songlist = useSongStore()
const songInfo = useSonginfoStore()

const isSearchMode = ref(false)
const setSearchMode = (val: boolean) => {
  isSearchMode.value = val
}

let radioValue = ref('全部')
let checkboxValue = ref(['流行', '国风', '苦情', '甜歌'])
const handleRadioChange = () => {
  if (radioValue.value === '全部' && checkboxValue.value.length === songInfo.keywordDict.length) {
    isSearchMode.value = false
  } else {
    let resultList: ISongInfo[] = []
    // const searchReg = new RegExp(radioValue.value, 'i')
    // songlist.songlist.forEach(item => {
    //   if (searchReg.test(item.language!) || searchReg.test(item.keyword!)) {
    //     resultList.push(item)
    //   }
    // })
    songlist.songlist.forEach(item => {
      if (item.editKeywords.some(n => checkboxValue.value.includes(n))) {
        if (radioValue.value === '全部') {
          resultList.push(item)
        } else {
          if (radioValue.value === item.language) {
            resultList.push(item)
          }
        }
      }
    })
    songlist.setSearchedList(resultList)
    isSearchMode.value = true
  }
  /* let resultList: ISongInfo[] = []
  // const searchReg = new RegExp(radioValue.value, 'i')
  // songlist.songlist.forEach(item => {
  //   if (searchReg.test(item.language!) || searchReg.test(item.keyword!)) {
  //     resultList.push(item)
  //   }
  // })
  songlist.songlist.forEach(item => {
    if (item.editKeywords.some(n => checkboxValue.value.includes(n))) {
      if (radioValue.value === '全部') {
        resultList.push(item)
      } else {
        if (radioValue.value === item.language) {
          resultList.push(item)
        }
      }
    }
  })
  songlist.setSearchedList(resultList)
  isSearchMode.value = true */
}

const tableContainer = ref<HTMLDivElement | null>(null)
let tableHeight = ref<number>(0)

let resizeHeight = ref(0)
tableHeight = refDebounced(resizeHeight, 1000)
watch(tableHeight, () => {
  console.log(tableHeight.value)
})

onMounted(() => {
  window.$message = useMessage()
  tableHeight.value = tableContainer.value!.clientHeight
  getAllData()
  // getSongList()
  useResizeObserver(tableContainer, entries => {
    const entry = entries[0]
    resizeHeight.value = entry.contentRect.height
  })
})
</script>
