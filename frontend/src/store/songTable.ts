import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ISongInfo, ISongLanguage, ISongkeyword } from '../type'

export const useSongStore = defineStore('songTable', () => {

  let songlist = ref<ISongInfo[]>([])
  const setSonglist = (list: ISongInfo[]) => {
    songlist.value = list
  }


  let tableLoading = ref<boolean>(false)
  const setTableLoading = (state: boolean) => { tableLoading.value = state }


  let searchedList = ref<ISongInfo[]>([])
  const setSearchedList = (list: ISongInfo[]) => {
    searchedList.value = list
  }

  let adminSearchedList = ref<ISongInfo[]>([])
  const setAdminSearchedList = (list: ISongInfo[]) => {
    adminSearchedList.value = list
  }

  let adminEditList = ref<ISongInfo[]>([])
  const addAdminEditList = (list: ISongInfo[]) => {
    adminEditList.value = list
  }

  return { songlist, setSonglist, tableLoading, setTableLoading, searchedList, setSearchedList }
})

export const useSongAdminStore = defineStore('songAdmin', () => { })

export const useSonginfoStore = defineStore('songInfo', () => {

  let languageDict = ref<ISongLanguage[]>([])
  const setLanguageList = (list: ISongLanguage[]) => {
    languageDict.value = list
  }

  let keywordDict = ref<ISongkeyword[]>([])
  const setKeywordList = (list: ISongkeyword[]) => {
    keywordDict.value = list
  }

  return { languageDict, setLanguageList, keywordDict, setKeywordList }

})