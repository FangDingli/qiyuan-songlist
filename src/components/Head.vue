<script lang="ts" setup>
import { useStatusStore, useSonglistStore } from '~/store'

const stateStore = useStatusStore()

const songlistStore = useSonglistStore()

stateStore.getState()

const props = withDefaults(defineProps<{ activeBtn: string }>(), {
  activeBtn: '',
})
</script>

<template>
  <div>
    <div text="center" class="m-t-40px m-b-20px">
      <img
        class="b-rd-50%"
        lt-sm="w-164px h-164px"
        :src="stateStore.state.avatarImg + '@256w_256h.webp'"
        alt=""
      />
    </div>
    <div class="rainbow_linear_text font-semibold" text="36px center shadow">
      栖苑太困辽 与她的 <br />
      {{ songlistStore.songlistState.listAll.length }} 首{{ props.activeBtn }}歌
    </div>
    <div style="color: var(--vp-c-brand)" class="font-semibold m-y-20px" text="18px center">
      last update: {{ songlistStore.songlistState.lastUpdate }}
    </div>
  </div>
</template>

<style scoped>
.image_bg {
  background-image: linear-gradient(-45deg, var(--vp-c-brand-light) 30%, var(--vp-c-brand-next));
  filter: blur(120px);
}
</style>
