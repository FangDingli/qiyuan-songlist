<script lang="ts" setup>
import { useSonglistStore } from '~/store'

const store = useSonglistStore()

// store.getSonglist()
</script>

<template>
  <table
    class="w-full ws-nowrap"
    style="background-color: rgba(var(--color-1), 0.7)"
    text="20px lt-sm:16px"
    border="0 rounded-5"
  >
    <thead>
      <tr class="rainbow_linear_text">
        <th class="songlist_theader">歌名</th>
        <th class="songlist_theader">歌手</th>
        <th class="songlist_theader">语种</th>
        <th class="songlist_theader">类型</th>
        <th class="songlist_theader">歌切</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in store.listDisplay" :key="index" class="color-4 song_item">
        <td>
          <span>{{ item.title }}</span>
        </td>
        <td>
          <span>{{ item.singer }}</span>
        </td>
        <td>
          <span>{{ item.language }}</span>
        </td>
        <td>
          <span>{{ item.keywords }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.songlist_theader {
  padding: 8px;
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid var(--color-4);
}
.song_item:hover {
  background-color: rgba(var(--color-3), 0.5);
}
</style>
