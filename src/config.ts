import type { Song } from '@/types'
import { songTags } from '@/utils/songs'

/** 站点文案与点歌口令格式,按需修改 */
export const siteConfig = {
  title: '栖苑的歌单',
  subtitle: '点击卡片复制点歌口令,回到直播间粘贴即可点歌',
  /** 主播头像(侧栏唱片机中心),加载失败时回退为音符图标 */
  avatar: 'https://i0.hdslb.com/bfs/face/71c6847721a32fbddb97eebcfe873f54ec2a38bd.jpg',
  /** 页面背景图:移动端与宽屏各一张,留空则显示纯色背景。
   *  图片铺在固定层上,不随页面滚动;建议移动端用竖图、宽屏用横图 */
  backgroundImages: {
    mobile: '/bg/mobile_v1.png',
    desktop: '/bg/desktop_v1.jpg',
  },
  /** 可用占位符:{title} {singer} {lang} {tags} */
  orderTemplate: '点歌 {title} {singer}',
}

export function formatOrder(song: Song): string {
  return siteConfig.orderTemplate
    .replaceAll('{title}', song.title)
    .replaceAll('{singer}', song.singer)
    .replaceAll('{lang}', song.lang)
    .replaceAll('{tags}', songTags(song).join('、'))
}
