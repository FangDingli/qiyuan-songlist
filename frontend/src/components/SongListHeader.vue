<template>
  <div class="flex justify-between h-100% bg-qiyuan">
    <div class="h-100% flex-shrink-0">
      <img :src="logo" class="h-100%" alt="" />
    </div>
    <div class="w-60% flex items-center">
      <NInputGroup>
        <NInput
          :placeholder="`编号、歌名、歌手名搜索，总歌曲数：${songlist.songlist.length}`"
          v-model:value="inputVal"
          @keyup.enter="handleSearch"
        ></NInput>
        <NButton @click="handleSearch">
          <template #icon>
            <div i-ion-search-outline style="color: #1a1a1a"></div>
          </template>
        </NButton>
        <NButton @click="handleRandom">
          <template #icon>
            <div i-ion-dice-outline style="color: #1a1a1a"></div>
          </template>
        </NButton>
        <NButton v-show="searchMode" @click="emit('setSearchMode', false)">
          <template #icon>
            <div i-ion-reload style="color: #1a1a1a"></div>
          </template>
        </NButton>
      </NInputGroup>
    </div>
    <div class="flex-shrink h-100% w-5%">
      <div class="h-100% text-xl cursor-pointer" i-ion-logo-github @click="openGithub"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import logo from '~/assets/qiyuan.jpg'
import { NInputGroup, NInput, NButton } from 'naive-ui'
import { toRefs, ref, watch } from 'vue'
import type { ISongInfo } from '~/type'
import { useSongStore } from '~/store/songTable'
import { getRandomNum } from '../utils'

const songlist = useSongStore()

const props = defineProps<{ searchMode: boolean }>()
const { searchMode } = toRefs(props)

const emit = defineEmits(['setSearchMode'])

let inputVal = ref('')

const handleSearch = () => {
  if (inputVal.value.length === 0) {
    emit('setSearchMode', false)
  } else {
    let resultList: ISongInfo[] = []
    const searchReg = new RegExp(inputVal.value, 'i')
    songlist.songlist.forEach(item => {
      if (searchReg.test(item.original_name) || searchReg.test(item.singer)) {
        resultList.push(item)
      }
    })
    songlist.setSearchedList(resultList)
    emit('setSearchMode', true)
  }
}
watch(inputVal, val => {
  if (val.length == 0) {
    emit('setSearchMode', false)
  }
})

const handleRandom = () => {
  songlist.setSearchedList([songlist.songlist[getRandomNum(0, songlist.songlist.length - 1)]])
  setTimeout(() => {
    emit('setSearchMode', true)
  }, 100)
}

const openGithub = () => {
  window.open('https://github.com/FangDingli/qiyuan-songlist')
}
</script>
