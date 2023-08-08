<script lang="ts" setup>
import { useSonglistStore } from '~/store'
import {
  useFilterByLanguage,
  useFilterBySearchbar,
  useFilterByType,
  afterFilter,
} from '~/composables/useSongFilter'
import { shuffle } from '~/utils'

const songlistStore = useSonglistStore()

const currActiveBtn = ref<string>('')

const searchValue = ref<string>('')

const emit = defineEmits(['random'])

const handleFilterBtnClick = (name: string) => {
  if (!currActiveBtn.value.length || currActiveBtn.value !== name) {
    currActiveBtn.value = name
  } else {
    currActiveBtn.value = ''
  }
}

const handleRandomClick = () => {
  emit('random')
}

const handleShuffleClick = () => {
  afterFilter(shuffle(songlistStore.originList.value))
}

watchDebounced(currActiveBtn, () => {
  if (currActiveBtn.value.length) {
    const isLanguage = songlistStore.songlistState.languageOpts.findIndex(
      n => n === currActiveBtn.value,
    )
    if (isLanguage !== -1) {
      useFilterByLanguage(currActiveBtn.value)
    } else {
      useFilterByType(currActiveBtn.value)
    }
  } else {
    useFilterBySearchbar('')
  }
})

watchDebounced(searchValue, () => {
  useFilterBySearchbar(searchValue.value)
})

defineExpose({
  currActiveBtn,
})
</script>

<template>
  <div class="mb-10px">
    <div grid="~ cols-[1fr_1fr_1fr_1fr] gap-4 lt-sm:gap-1">
      <FilterButton
        v-for="item in songlistStore.songlistState.languageOpts"
        :key="item"
        :text="item"
        :is-active="currActiveBtn === item"
        @click="handleFilterBtnClick(item)"
      ></FilterButton>
      <FilterButton
        v-for="item in songlistStore.songlistState.typeOpts"
        :key="item"
        :text="item"
        :is-active="currActiveBtn === item"
        @click="handleFilterBtnClick(item)"
      ></FilterButton>
    </div>
    <div m="y-20px" grid="~ cols-[2fr_10fr_2fr] lt-sm:cols-[4fr_8fr_4fr] gap-4 lt-sm:gap-1">
      <FilterButton text="打乱顺序" @click="handleShuffleClick"></FilterButton>
      <input
        v-model.trim="searchValue"
        type="text"
        placeholder="输入歌名或歌手搜索"
        border="0 transparent rd-10px"
        outline="none"
        text="16px"
        style="background-color: rgba(var(--color-3), 0.85)"
        class="h-36px lh-36px fw-400 p-x-20px search_input"
      />
      <FilterButton text="随机一首" @click="handleRandomClick"></FilterButton>
    </div>
  </div>
</template>

<style scoped>
.search_input {
  color: rgb(var(--color-4));
}
.search_input::placeholder {
  color: rgb(var(--color-4));
}
</style>
