/**
 * 手动同步兜底数据:把手动下载的远端 JSON(浏览器访问
 * https://qylive.pages.dev/songs.json 另存)映射为本地结构,写入 src/data/songs.json。
 *
 * 用法:npm run sync [远端json路径](缺省读取根目录 remote-songs.json)
 * 完成后提交 src/data/songs.json 即更新页面兜底数据。
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { mapRemoteSongs } from '../src/utils/mapRemoteSongs.ts'

/** 依次查找:命令行参数 → remote-songs.json → songs.json(手动下载后放根目录即可) */
const candidates = [process.argv[2], 'remote-songs.json', 'songs.json'].filter(Boolean)
const input = candidates.find((p) => existsSync(p))

if (!input) {
  console.error('用法:npm run sync [远端json路径];或把下载的 json 放到根目录(remote-songs.json 或 songs.json)')
  process.exit(1)
}

const raw = JSON.parse(readFileSync(input, 'utf8'))
const mapped = mapRemoteSongs(raw)

writeFileSync(
  new URL('../src/data/songs.json', import.meta.url),
  JSON.stringify(mapped, null, 2) + '\n',
  'utf8',
)
console.log(`✓ 已写入 src/data/songs.json:共 ${mapped.songs.length} 首,数据日期 ${mapped.updatedAt}`)
console.log('  记得提交并推送,让兜底数据上线。')
