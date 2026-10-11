import type { RemoteSong, Song, SonglistData } from '@/types'

/**
 * 把远端(qylive)的歌曲数据映射为本地结构:
 * singer→artist、lang→language、genre+style 合并为 genres、sc 转为数值。
 */
export function mapRemoteSongs(raw: unknown): SonglistData {
  const items: RemoteSong[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as Record<string, unknown>)?.songs)
      ? ((raw as Record<string, unknown>).songs as RemoteSong[])
      : []

  if (!items.length) throw new Error('远端歌曲数据为空或结构不符合预期')

  const songs: Song[] = []
  for (const item of items) {
    const title = String(item.title ?? '').trim()
    if (!title) continue
    const genres = [...new Set(
      [item.genre, item.style]
        .flatMap((v) => (typeof v === 'string' ? v.split(/[;；,，、]/) : []))
        .map((s) => s.trim())
        .filter(Boolean),
    )]
    const sc = typeof item.sc === 'number' ? item.sc : Number(item.sc)
    songs.push({
      id: songs.length + 1,
      title,
      artist: String(item.singer ?? '').trim(),
      language: String(item.lang ?? '').trim() || '未知',
      genres: genres.length ? genres : ['未知'],
      sc: Number.isFinite(sc) && sc > 0 ? sc : null,
    })
  }

  if (!songs.length) throw new Error('远端歌曲数据没有有效条目')
  return { updatedAt: new Date().toISOString().slice(0, 10), songs }
}
