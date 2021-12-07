<template>
  <div class="header">
    <Header :dataList="songList" @searchMode="changeSearchMode"></Header>
  </div>
  <div class="songs_list" ref="songListContainer">
    <div class="songlist_all" :class="{ ml: searchMode }">
      <SongTable :dataList="songList" :tableHeight="containerHeight"></SongTable>
    </div>
    <div class="songlist_searched">
      <SongTable :dataList="searchedList" :tableHeight="containerHeight"></SongTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { commonGet } from '../api'
import { useRect } from '../composables/useRect'
import { Debounced } from '../utils/index'
import SongTable from '../components/SongTable.vue'
import Header from '../components/Header.vue'
import { useStore } from 'vuex'
import type { StateProps, TableData } from '../store'

const store = useStore<StateProps>()

const searchedList = computed(() => store.getters.getSonglistSearched)

let searchMode = ref<boolean>(false)
const changeSearchMode = (val: boolean) => {
  searchMode.value = val
}

let songList = ref<TableData[]>([])
commonGet('/getSongList', {}).then(res => {
  console.log(res)
  songList.value = res as TableData[]
  store.commit('setLoading', false)
  getTableRect()
})

const songListContainer = ref<HTMLDivElement>()
let containerHeight = ref<string>('100%')
const getTableRect = () => {
  containerHeight.value = useRect(songListContainer).height.toString() + 'px'
  console.log(containerHeight.value)
}
onMounted(() => {
  window.onresize = Debounced.use(getTableRect, 500, true)
})
</script>

<style>
.header {
  /* width: 100%; */
  height: 8vh;
  background-color: #a8a0fa;
}
.songs_list {
  width: 200%;
  overflow-x: hidden;
  height: 92vh;
  /* background-color: rgb(207, 59, 195); */
  display: flex;
}
.songlist_all,
.songlist_searched {
  width: 50%;
  transition: all 0.3s ease;
}
.ml {
  margin-left: -50%;
}
</style>
