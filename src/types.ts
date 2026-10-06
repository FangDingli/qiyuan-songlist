export interface Song {
  /** 编号,由转换脚本按 excel 行序生成 */
  id: number
  title: string
  artist: string
  language: string
  /** 类型,excel 中以「;」分隔的多值 */
  genres: string[]
}

export interface SonglistData {
  /** 数据文件的更新日期,来自 excel 的修改时间 */
  updatedAt: string
  songs: Song[]
}

/** 筛选 tag:kind 区分语种/类型两个维度 */
export interface FilterTag {
  name: string
  count: number
  kind: 'language' | 'genre'
}
