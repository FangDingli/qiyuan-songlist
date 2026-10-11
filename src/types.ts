/** 歌曲原始结构,与远端数据源(qylive)字段一致,直接消费不做转换 */
export interface Song {
  title: string
  singer: string
  lang: string
  genre?: string
  style?: string
  /** 点歌需要的 SuperChat 金额,空串/0/缺省表示无 SC */
  sc?: number | string
  /** 运行时按行序生成(1 起),仅用作 key 与随机排序,与外部编号无关 */
  id: number
}

/** 筛选 tag:kind 区分语种/类型两个维度 */
export interface FilterTag {
  name: string
  count: number
  kind: 'language' | 'genre'
}
