export interface Song {
  /** 编号,按当前数据的行序生成 */
  id: number
  title: string
  artist: string
  language: string
  /** 类型,「流行;苦情」等多值拆成数组 */
  genres: string[]
  /** 点歌需要的 SuperChat 金额,无 SC 为 null */
  sc: number | null
}

export interface SonglistData {
  /** 数据的更新日期 */
  updatedAt: string
  songs: Song[]
}

/** 筛选 tag:kind 区分语种/类型两个维度 */
export interface FilterTag {
  name: string
  count: number
  kind: 'language' | 'genre'
}

/** 远端(qylive)的单条歌曲原始结构 */
export interface RemoteSong {
  title?: unknown
  singer?: unknown
  lang?: unknown
  genre?: unknown
  style?: unknown
  sc?: unknown
}
