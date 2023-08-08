import { useSonglistStore } from '~/store'

const songlistStore = useSonglistStore()

export function arrRandChoice<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const afterFilter = (result: SongBaseTrait[]) => {
  songlistStore.songlistState.listAll = result
  songlistStore.songlistState.pageNum = 1
  songlistStore.listDisplay.value = []
  songlistStore.loadMore()
}

export const useFilterBySearchbar = (searchStr: FilterHandlerParam2) => {
  const result: SongBaseTrait[] = []

  if (!searchStr || searchStr === '') {
    // songlistStore.listDisplay.value = [...songlistStore.songlistState.listAll]
    songlistStore.resetSonglistAll()
  } else {
    songlistStore.originList.value.forEach(item => {
      const str = item.index + item.title + item.singer
      if (str.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1) {
        result.push(item)
      }
    })

    afterFilter(result)
  }
}

export const useFilterByLanguage = (searchStr: FilterHandlerParam2) => {
  const result: SongBaseTrait[] = []

  if (!searchStr || searchStr === '') {
    songlistStore.resetSonglistAll()
  } else {
    songlistStore.originList.value.forEach(item => {
      if (item.language.indexOf(searchStr) !== -1) {
        result.push(item)
      }
    })

    afterFilter(result)
  }
}

export const useFilterByType = (searchStr: FilterHandlerParam2) => {
  const result: SongBaseTrait[] = []

  if (!searchStr || searchStr === '') {
    songlistStore.resetSonglistAll()
  } else {
    songlistStore.originList.value.forEach(item => {
      if (item.keywords.indexOf(searchStr) !== -1) {
        result.push(item)
      }
    })

    afterFilter(result)
  }
}

type FilterTableDataAction = 'searchbar' | 'languageSelect' | 'typeSelect'
type FilterHandlerParam2 = string | undefined | null

export const tableFilterHandler: Record<FilterTableDataAction, (b: FilterHandlerParam2) => void> = {
  searchbar: (b: FilterHandlerParam2) => useFilterBySearchbar(b),
  languageSelect: (b: FilterHandlerParam2) => useFilterByLanguage(b),
  typeSelect: (b: FilterHandlerParam2) => useFilterByType(b),
}
