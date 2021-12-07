<template>
  <div class="header_container">
    <div class="logo_container">
      <img :src="logo" alt="" />
    </div>

    <div class="input_container">
      <NInputGroup>
        <NInput
          :placeholder="'歌名或歌手搜索，总歌曲数：' + props.dataList.length"
          v-model:value="inputValue"
          @keyup.enter="handleSearch"
        ></NInput>
        <NButton ghost @click="handleSearch" v-show="!randomMode">
          <template #icon>
            <i class="iconfont icon-sousuo"></i>
          </template>
        </NButton>
        <NButton ghost @click="resetRandomMode" v-show="randomMode">
          <template #icon>
            <i class="iconfont icon-chongzhi"></i>
          </template>
        </NButton>
        <NButton ghost @click="handleRandom">
          <template #icon>
            <i class="iconfont icon-touzi"></i>
          </template>
        </NButton>
      </NInputGroup>
    </div>

    <div style="width: 10%"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { NInput, NButton, NInputGroup } from 'naive-ui'
import { getRandomNum } from '../utils'
import logo from '../assets/qiyuan.jpg'
import { useStore } from 'vuex'
import type { StateProps, TableData } from '../store'

const store = useStore<StateProps>()

const props = defineProps<{ dataList: TableData[] }>()
const emit = defineEmits(['searchMode'])

let inputValue = ref<string>('')
const handleSearch = () => {
  store.commit('setLoading', true)
  const temp: TableData[] = []
  if (inputValue.value === '') {
    emit('searchMode', false)
  } else {
    const patt = new RegExp(inputValue.value, 'i')
    props.dataList.map(item => {
      if (patt.test(item.original_name) || patt.test(item.singer)) {
        temp.push(item)
      }
    })
    store.commit('setSonglistSearched', temp)
    emit('searchMode', true)
  }
  store.commit('setLoading', false)
}

let randomMode = ref<boolean>(false)
const handleRandom = () => {
  store.commit('setLoading', true)
  store.commit('setSonglistSearched', [props.dataList[getRandomNum(0, props.dataList.length - 1)]])
  emit('searchMode', true)
  store.commit('setLoading', false)
  randomMode.value = true
}

const resetRandomMode = () => {
  emit('searchMode', false)
}

watch(inputValue, val => {
  if (val.length === 0) {
    handleSearch()
  }
})
</script>

<style>
.header_container {
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.logo_container {
  width: 10%;
}
.logo_container img {
  height: 100%;
}
.input_container {
  display: flex;
  align-items: center;
  width: 65%;
}
</style>
