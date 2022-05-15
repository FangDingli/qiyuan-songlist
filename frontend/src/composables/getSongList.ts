import baseRequest from '~/utils/request'
import { useSongStore, useSonginfoStore } from '~/store/songTable'
import type { IErrorResponse, ISongInfo } from '../type'

const songlist = useSongStore()
const songInfoStore = useSonginfoStore()

const errorHandler = (data: IErrorResponse) => {
  window.$message.error(data.status + ' ' + data.message)
}

export const getAllData = () => {
  getSongList()
  getLanguageDict()
  getKeywordDict()
}

export const getSongList = async () => {
  songlist.setTableLoading(true)

  const { error, data } = await baseRequest('songList').json()

  if (error.value) {
    errorHandler(data.value)
    songlist.setTableLoading(false)
    return
  }

  data.value.forEach((item: ISongInfo, index: number) => {
    item.original_name = `【${index + 1}】${item.original_name}`
  });
  songlist.setSonglist(data.value)
  songlist.setTableLoading(false)
}

export const getLanguageDict = async () => {
  const { error, data } = await baseRequest('languageDict').json()
  if (error.value) {
    errorHandler(data.value)
    return
  }

  songInfoStore.setLanguageList = data.value
}

export const getKeywordDict = async () => {
  const { error, data } = await baseRequest('keywordDict').json()
  if (error.value) {
    errorHandler(data.value)
    return
  }

  songInfoStore.setLanguageList = data.value
}