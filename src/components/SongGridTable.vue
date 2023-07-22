<script lang="ts" setup>
import { useSonglistStore } from '~/store'
// import { useMessage } from 'naive-ui'
import { arrRandChoice } from '~/composables/useSongFilter'

// const message = useMessage()

const store = useSonglistStore()

store.getSonglist()
/* const props = withDefaults(defineProps<{ songs: SongBaseTrait[] | null }>(), {
  songs: () => [],
}) */

let copySource = ref<string>('')

const { copy, copied } = useClipboard({
  source: copySource,
  legacy: true,
})

const handleTableItemClick = (name: string, singer: string) => {
  const temp = `点歌 ${name} ${singer}`
  copySource.value = temp.length > 20 ? `点歌 ${name}` : temp

  copy()

  if (copied) {
    window.$message.success(`${name} 复制成功，快去直播间点歌吧！`)
  }
}

const handleRandomClick = () => {
  const temp = arrRandChoice(store.songlistState.listAll)
  handleTableItemClick(temp.title, temp.singer)
}

defineExpose({
  handleRandomClick,
})
</script>

<template>
  <div bg="transparent" class="color-4" grid="~ cols-1" text="20px lt-sm:16px">
    <div
      grid="~ cols-[1fr_6fr_4fr_2fr_2fr_1fr] gap-2 lt-sm:cols-[1fr_6fr_4fr_2fr] lt-sm:gap-0"
      class="h-50px text-18px font-bold rainbow_linear_text"
    >
      <div class="pl-5% self-center"><span class="">#</span></div>
      <div class="self-center"><span class="">歌曲名称</span></div>
      <div class="self-center"><span class="">歌手</span></div>
      <div class="self-center" lt-sm="hidden"><span class="">语言</span></div>
      <div class="self-center" lt-sm="hidden"><span class="">风格</span></div>
      <div class="self-center"><span class="">切片</span></div>
    </div>
    <div v-if="store.listDisplay.value.length">
      <div
        v-for="item in store.listDisplay.value"
        :key="item.title"
        grid="~ cols-[1fr_6fr_4fr_2fr_2fr_1fr] lt-sm:cols-[1fr_6fr_4fr_2fr] gap-2"
        text="16px"
        border="0 rounded-2"
        class="m-y-1 p-y-1 transition song_item"
        @click="handleTableItemClick(item.title, item.singer)"
      >
        <div class="pl-5%">{{ item.index }}</div>
        <div class="truncate">{{ item.title }}</div>
        <div class="truncate">{{ item.singer }}</div>
        <div class="sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
          {{ item.vdReady }}
        </div>
        <div class="sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden"></div>
        <div lt-sm="text-12px pl-5%">{{ item.language }}</div>
        <div class="truncate" lt-sm="text-12px">{{ item.keywords }}</div>
        <div lt-sm="hidden">{{ item.vdReady }}</div>
      </div>
    </div>
    <div v-else class="color-4 text-18px text-center">查不到捏~</div>
  </div>
</template>

<style scoped>
.theader {
  color: transparent;
  background: -webkit-linear-gradient(120deg, var(--vp-c-brand) 30%, var(--vp-c-brand-next));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.song_item:hover {
  background-color: rgba(var(--color-1), 0.5);
}
</style>
