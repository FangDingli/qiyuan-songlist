import type { Song } from '@/types'

/** 展示用 tag:genre 与 style 合并、拆分、去重;两者皆空时归为「未知」 */
export function songTags(song: Song): string[] {
  const tags = [...new Set(
    [song.genre, song.style]
      .flatMap((v) => (typeof v === 'string' ? v.split(/[;；,，、]/) : []))
      .map((s) => s.trim())
      .filter(Boolean),
  )]
  return tags.length ? tags : ['未知']
}

/**
 * 给歌曲数据补上运行时 id(行序,1 起)。
 * 接受打包内置或远端拉取的原样 JSON,结构不符或无有效条目时抛错。
 */
export function withIds(raw: unknown): Song[] {
  if (!Array.isArray(raw)) throw new Error('歌曲数据应为数组')
  const songs = raw
    .filter((it): it is Song => !!it && typeof it === 'object' && String((it as Song).title ?? '').trim() !== '')
    .map((it, i) => ({ ...it, title: it.title.trim(), id: i + 1 }))
  if (!songs.length) throw new Error('歌曲数据没有有效条目')
  return songs
}
