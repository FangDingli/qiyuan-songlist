export interface ISongInfo {
  id?: number | string
  displayName?: string
  original_name: string
  singer: string
  language?: string
  keyword?: string
  editKeywords: string[]
}

export interface ISongLanguage {
  language: string
  sortNum: number,
  value?: string,
  label?: string
}

export interface ISongkeyword {
  id: number
  keyword: string
  sortNum: number
  value?: string,
  label?: string
}

export interface IErrorResponse {
  status: number,
  message: string
}