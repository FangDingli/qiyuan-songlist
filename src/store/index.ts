import { useRequest } from '~/composables/useRequest'

interface ThemeJson {
  name: string
  color1: string
  color2: string
  color3: string
  color4: string
  color5: string
}

export const useThemeStore = createGlobalState(() => {
  const theme = $ref<ThemeJson>({
    name: 'bgi-w-magic',
    color1: '#516DA6',
    color2: '#88A2F2',
    color3: '#211C40',
    color4: '#F2B2AC',
    color5: '#9B44F2',
  })

  const currTheme = computed(() => theme)

  return { currTheme }
})

interface SonglistStateProps {
  listAll: SongBaseTrait[]
  // listDisplay: SongBaseTrait[]
  typeOpts: string[]
  languageOpts: string[]
  theader: string[]
  isLoading: boolean
  pageNum: number
  pageSize: number
  total: number
  lastUpdate: string
}

export const useSonglistStore = createGlobalState(() => {
  const songlistState = shallowReactive<SonglistStateProps>({
    listAll: [],
    // listDisplay: [],
    typeOpts: [],
    languageOpts: [],
    theader: [],
    isLoading: false,
    pageNum: 1,
    pageSize: 50,
    total: 0,
    lastUpdate: 'N/A',
  })

  const listDisplay = ref<SongBaseTrait[]>([])

  const originList = ref<SongBaseTrait[]>([])

  const loadMore = () => {
    if (songlistState.total && listDisplay.value.length < songlistState.total) {
      listDisplay.value.push(
        ...songlistState.listAll.slice(
          (songlistState.pageNum - 1) * songlistState.pageSize,
          songlistState.pageNum * songlistState.pageSize,
        ),
      )
      songlistState.pageNum++
    }
  }

  const resetSonglistAll = () => {
    // listDisplay.value = songlistState.listAll
    songlistState.listAll = [...originList.value]
    songlistState.pageNum = 1
    listDisplay.value = []
    loadMore()
  }

  const getSonglist = async () => {
    songlistState.isLoading = true

    const { data } = await useRequest('/songlist').get().json()

    if (data.value.code === 200) {
      const rows: [string[]] = data.value.data.excelData
      songlistState.lastUpdate = data.value.data.lastUpdate
      if (rows[0][0] === '歌名') {
        songlistState.theader = rows[0]
      }

      rows.splice(0, 1)

      const list: SongBaseTrait[] = []
      const typeOpts: string[] = []
      const languageOpts: string[] = []
      rows.forEach(item => {
        item[3].split('；').forEach(ele => {
          if (ele.length) {
            const typeIndex = typeOpts.findIndex(n => n === ele)
            if (typeIndex === -1) {
              typeOpts.push(ele)
            }
          }
        })
        const languageIndex = languageOpts.findIndex(n => n === item[2])
        if (languageIndex === -1) {
          languageOpts.push(item[2])
        }
        list.push({
          // index: index + 1,
          title: item[0],
          singer: item[1],
          language: item[2],
          keywords: item[3],
          vdReady: item[4],
        })
      })

      originList.value = [...list]
      songlistState.listAll = list
      songlistState.total = list.length
      songlistState.languageOpts = languageOpts
      songlistState.typeOpts = typeOpts
      // loadMore()
    }

    songlistState.isLoading = false
  }

  return { songlistState, listDisplay, originList, getSonglist, loadMore, resetSonglistAll }
})

interface Status {
  liveStatus: 0 | 1
  avatarImg: string
}

export const useStatusStore = createGlobalState(() => {
  const state = reactive<Status>({
    liveStatus: 0,
    avatarImg: 'https://i1.hdslb.com/bfs/face/b8a3c1b5a1882d2eb186a49b361a5e4524c9ef36.jpg',
  })

  const getState = async () => {
    const { data } = await useRequest('/info').get().json()
    if (data.value.code === 200) {
      state.avatarImg = data.value.data.face
      state.liveStatus = data.value.data.liveStatus
      const icon = useFavicon()
      icon.value = state.avatarImg + '@76w_76h.webp'
    }
  }

  return { state, getState }
})
