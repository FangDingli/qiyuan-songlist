export interface ISongInfo {
  id: number | string
  original_name: string
  singer: string
  language?: string
  keyword?: string[]
}

export interface ISongLanguage {
  language: string
  sortNum: number
}

export interface ISongkeyword {
  id: number
  keyword: string
  sortNum: number
}

export interface IErrorResponse {
  status: number,
  message: string
}