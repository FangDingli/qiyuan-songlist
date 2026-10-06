import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

/** excel 里语种写法不统一时,在这里归一化 */
const LANGUAGE_ALIAS = {
  英文: '英语',
}

/** 默认读取根目录下的 songlist.xlsx,也可传入其他路径: npm run convert -- <excel路径> */
const DEFAULT_INPUT = 'songlist.xlsx'

const input = process.argv[2] ?? DEFAULT_INPUT
if (!input) {
  console.error('用法:npm run convert -- <excel文件路径>(缺省读取根目录 songlist.xlsx)')
  process.exit(1)
}
if (!existsSync(input)) {
  console.error(`找不到文件:${input}`)
  process.exit(1)
}

const wb = XLSX.readFile(input)
const ws = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })

const songs = []
for (const row of rows) {
  const title = String(row['歌名'] ?? '').trim()
  const artist = String(row['歌手'] ?? '').trim()
  if (!title) continue

  const rawLanguage = String(row['语种'] ?? '').trim()
  const language = LANGUAGE_ALIAS[rawLanguage] ?? (rawLanguage || '未知')
  const genres = String(row['类型'] ?? '')
    .split(/[;；]/)
    .map((s) => s.trim())
    .filter(Boolean)

  songs.push({ id: songs.length + 1, title, artist, language, genres: genres.length ? genres : ['未知'] })
}

const updatedAt = statSync(input).mtime.toISOString().slice(0, 10)
const outPath = fileURLToPath(new URL('../src/data/songs.json', import.meta.url))
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify({ updatedAt, songs }, null, 2) + '\n', 'utf8')

console.log(`✓ 已写入 ${outPath}:共 ${songs.length} 首,数据日期 ${updatedAt}`)
