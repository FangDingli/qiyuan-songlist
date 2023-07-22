import type { MessageProviderInst } from 'naive-ui'

export {}

declare global {
  interface Window {
    $message: MessageProviderInst
  }

  interface SongBaseTrait {
    index: number
    title: string
    singer: string
    language: string
    keywords: string
    vdReady: string
  }
}
