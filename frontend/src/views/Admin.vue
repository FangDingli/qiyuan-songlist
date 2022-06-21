<template>
  <div class="flex flex-col h-98vh">
    <div class="h-60% flex">
      <div class="w-50% h-100% flex overflow-x-hidden overflow-y-scroll">
        <div
          class="h-100% w-100% flex-shrink-0 transition-all duration-300"
          :class="{ '-ml-100%': searchMode }"
          ref="tableContainer"
        >
          <AdminTable
            :songs="songlist.songlist"
            @addSongsToEditTable="addSongsToEditTable"
            @deleteSong="deleteSong"
            ref="originTable"
          ></AdminTable>
        </div>
        <div class="h-100% w-100% flex-shrink-0 transition-all duration-300" ref="tableContainer">
          <AdminTable :songs="searchResult" @addSongsToEditTable="addSongsToEditTable"></AdminTable>
        </div>
      </div>

      <div class="w-50% h-100% overflow-y-scroll" ref="tableContainer">
        <AdminTable :songs="editableList" editTable></AdminTable>
      </div>
    </div>
    <div class="h-10% flex">
      <div class="w-50%">
        <div class="w-50% mt-6">
          <NInput
            :placeholder="`编号、歌名、歌手名搜索，总歌曲数：${songlist.songlist.length}`"
            v-model:value="inputVal"
            @keyup.enter="handleSearch"
          ></NInput>
        </div>
        <div class="mt-6">
          <NButton type="primary" @click="addSongModalComp.modalShow = true">新增歌曲</NButton>
        </div>
      </div>
      <div class="w-50%">
        <div class="flex">
          <NButton secondary type="info" class="mr-5 ml-5" @click="uploadEditTable"
            >确认提交</NButton
          >
          <NButton secondary type="error" @click="editableList = []">清空全部</NButton>
        </div>
        <br />
        <div class="flex items-center">
          <div class="">统一追加歌曲分类：</div>
          <NSelect
            class="w-400px"
            v-model:value="editKeywordsSelect"
            placeholder="请选择"
            multiple
            :options="songInfo.keywordDict"
          ></NSelect>
          <NButton
            :loading="editSelectLoading"
            secondary
            type="primary"
            @click="editKeywordsSelectConfirm"
            >应用</NButton
          >
          <div class="w-300px">(不用怕重复，会自动去重)</div>
        </div>
        <div class="flex items-center mt-4">
          <div class="">统一设置歌曲语种：</div>
          <NSelect
            class="w-400px"
            v-model:value="languaeSelected"
            placeholder="请选择"
            :options="songInfo.languageDict"
          ></NSelect>
          <NButton
            :loading="editSelectLoading"
            secondary
            type="primary"
            @click="editLanguageSelectConfirm"
            >应用</NButton
          >
        </div>
      </div>
    </div>
  </div>
  <AddSongModal
    ref="addSongModalComp"
    :languageOptions="songInfo.languageDict"
    :keywordOptions="songInfo.keywordDict"
  ></AddSongModal>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { NButton, useMessage, NInput, NSelect, useDialog } from 'naive-ui'
import baseRequest from '~/utils/request'
import AdminTable from '../components/AdminTable.vue'
import AddSongModal from '../components/AddSongModal.vue'
import { useSongStore, useSonginfoStore } from '~/store/songTable'
import { getAllData } from '../composables/getSongList'
import { getToken } from '../utils'
import type { ISongInfo } from '~/type'
import { useRouter } from 'vue-router'

const songlist = useSongStore()
const songInfo = useSonginfoStore()
const dialog = useDialog()
const router = useRouter()

const originTable = ref()

window.$message = useMessage()
const message = useMessage()

let editableList = ref<ISongInfo[]>([])

const addSongModalComp = ref()

let editSelectLoading = ref(false)
let editKeywordsSelect = ref<string[]>([])
const editKeywordsSelectConfirm = () => {
  editSelectLoading.value = true
  editableList.value.forEach(item => {
    const temp = [...item.editKeywords, ...editKeywordsSelect.value]
    item.editKeywords = Array.from(new Set(temp))
  })
  message.success('操作成功')
  editSelectLoading.value = false
}
const addSongsToEditTable = (songs: ISongInfo[]) => {
  editableList.value.push(...songs)
}

const uploadEditTable = () => {
  const d = dialog.warning({
    content: '确认提交所有改动？',
    positiveText: '确认!',
    negativeText: '我点错了!',
    onPositiveClick: async () => {
      d.loading = true
      const token = getToken()
      const { error, data } = await baseRequest('songList', {
        beforeFetch({ options }) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
          editableList.value.forEach(item => {
            item.keyword = item.editKeywords.join('；')
          })
          options.body = JSON.stringify(editableList.value)
        },
      })
        .put()
        .json()
      if (error.value) {
        message.error(data.value.status + ' ' + data.value.message, { duration: 5000 })
        if (data.value.status == 401) {
          router.push('/login')
        }
      } else {
        message.success('操作成功', { duration: 3000 })
      }
      return true
    },
  })
}

let languaeSelected = ref('')
const editLanguageSelectConfirm = () => {
  editSelectLoading.value = true
  editableList.value.forEach(item => {
    item.language = languaeSelected.value
  })
  message.success('操作成功')
  editSelectLoading.value = false
}

const deleteSong = (song: ISongInfo) => {
  const d = dialog.warning({
    content: `确认删除${song.original_name}?`,
    positiveText: '确认!',
    negativeText: '我点错了!',
    onPositiveClick: async () => {
      d.loading = true
      const token = getToken()
      const { error, data } = await baseRequest(`songList/${song.id}`, {
        beforeFetch({ options }) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        },
      })
        .delete()
        .json()
      if (error.value) {
        message.error(data.value.status + ' ' + data.value.message, { duration: 5000 })
        if (data.value.status == 401) {
          router.push('/login')
        }
      } else {
        message.success('操作成功', { duration: 3000 })
      }
      return true
    },
  })
}

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

onMounted(() => {
  getAllData()
})
</script>
