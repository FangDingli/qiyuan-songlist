import baseRequest from '~/utils/request'
import { useSongStore, useSonginfoStore } from '~/store/songTable'
import type { IErrorResponse, ISongInfo, ISongLanguage, ISongkeyword } from '../type'

const errorHandler = (data: IErrorResponse) => {
  window.$message.error(data.status + ' ' + data.message)
}

export const getSongList = async () => {
  const songlist = useSongStore()
  songlist.setTableLoading(true)

  const { error, data } = await baseRequest('songList').json()

  if (error.value) {
    errorHandler(data.value)
    songlist.setTableLoading(false)
    return
  }

  data.value.forEach((item: ISongInfo, index: number) => {
    item.displayName = `【${index + 1}】${item.original_name}`
    item.editKeywords = item.keyword!.split('；')
  });
  songlist.setSonglist(data.value)
  songlist.setTableLoading(false)
}

export const getLanguageDict = async () => {
  const songInfoStore = useSonginfoStore()
  const { error, data } = await baseRequest('languageDict').json()
  if (error.value) {
    errorHandler(data.value)
    return
  }

  data.value.forEach((item: ISongLanguage) => {
    item.value = item.language
    item.label = item.language
  })

  data.value.sort((a: ISongLanguage, b: ISongLanguage) => a.sortNum - b.sortNum)

  songInfoStore.setLanguageList(data.value)
}

export const getKeywordDict = async () => {
  const songInfoStore = useSonginfoStore()
  const { error, data } = await baseRequest('keywordDict').json()
  if (error.value) {
    errorHandler(data.value)
    return
  }
  data.value.forEach((item: ISongkeyword) => {
    item.value = item.keyword
    item.label = item.keyword
  })

  data.value.sort((a: ISongkeyword, b: ISongkeyword) => a.sortNum - b.sortNum)

  songInfoStore.setKeywordList(data.value)
}

export const getAllData = () => {
  getSongList()
  getLanguageDict()
  getKeywordDict()
}
