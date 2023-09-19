<script lang="ts" setup>
import VueDanmaku from 'vue3-danmaku'
import { LiveWS } from 'bilibili-live-ws/browser'

interface FormatDm {
  type: 'text' | 'emoticon' | 'richContent'
  imgsrc?: string
  content: string
}

const danmakuComp = $ref<any>()
const danmus = $ref([])

const dmMsgHandler = (msgRow: any) => {
  const { info } = msgRow
  const dmInfoDetail = JSON.parse(info[0][15].extra)
  const formatDm: FormatDm = {
    type: 'text',
    content: info[1],
  }
  if (!dmInfoDetail.emots) {
    if (dmInfoDetail.emoticon_unique && dmInfoDetail.emoticon_unique.length) {
      formatDm.type = 'emoticon'
      formatDm.imgsrc = info[0][13].url
      formatDm.content = info[1]
    }
  } else {
    formatDm.type = 'richContent'
    formatDm.content = richHandler(dmInfoDetail)
  }

  return formatDm
}

const richHandler = (danmu: any) => {
  const { content, emots } = danmu
  let result: string[] = []
  let start = 0
  let end = 0
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '[') {
      start = i
    } else if (content[i] === ']') {
      end = i + 1
      result.push(content.slice(start, end))
      start = 0
      end = 0
    } else {
      if (start === 0) {
        result.push(content[i])
      }
    }
  }

  let richContent = ''
  result.forEach(item => {
    if (item.includes('[') && item.length > 1) {
      richContent += `<img width="62" src="${emots[item].url}" alt="${item}" />`
    } else {
      richContent += item
    }
  })

  return richContent
}

onMounted(() => {
  // https://github.com/simon300000/bilibili-live-ws/issues/401#issuecomment-1703788943
  // useFetch('https://api.bilibili.com/x/frontend/finger/spi')
  const live = new LiveWS(10049827, {
    uid: 0,
  })

  live.on('error', e => {
    console.log(e)
  })

  live.on('open', () => {
    window.$message.success('直播间弹幕连接成功')
  })

  live.on('DANMU_MSG', data => {
    // console.log(data)
    const content = dmMsgHandler(data)
    // console.log(content)
    danmakuComp?.insert(content)
    danmakuComp.play()
  })
})
</script>

<template>
  <Teleport to="body">
    <VueDanmaku
      ref="danmakuComp"
      v-model:danmus="danmus"
      useSlot
      class="w-full h-30vh top-0 left-0"
      style="position: fixed"
    >
      <template #dm="{ danmu }">
        <div v-if="danmu.type === 'text'">
          <span text="16px">{{ danmu.content }}</span>
        </div>
        <div v-if="danmu.type === 'emoticon'">
          <NImage :src="danmu.imgsrc" width="62" :alt="danmu.content"> </NImage>
        </div>
        <div v-if="danmu.type === 'richContent'" v-html="danmu.content"></div>
      </template>
    </VueDanmaku>
  </Teleport>
</template>
