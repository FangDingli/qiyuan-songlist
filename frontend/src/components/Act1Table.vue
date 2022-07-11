<template>
  <div class="lt-sm:w-100% w-80% mx-auto h-100%">
    <NDataTable
      :columns="createColumn()"
      :data="songs"
      :row-key="rowData => rowData.id"
      :loading="songlist.tableLoading"
      virtualScroll
      :maxHeight="tableHeight"
      @update:checked-row-keys="handleCheck"
    ></NDataTable>
  </div>
</template>

<script lang="ts" setup>
import { useSongStore } from '~/store/songTable'
import { NDataTable, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, onMounted, toRefs } from 'vue'
import type { ISongInfo } from '~/type'

const songlist = useSongStore()

const props = defineProps<{
  songs: ISongInfo[]
  tableHeight: number | string
  showFullCol?: boolean
}>()

const { songs, tableHeight } = toRefs(props)

const emit = defineEmits(['handleSelectSongs'])

const handleCheck = (rowKey: number[]) => {
  emit('handleSelectSongs', rowKey)
}

const createColumn = (): DataTableColumns<ISongInfo> => {
  let colarr: DataTableColumns<ISongInfo> = [
    {
      type: 'selection',
    },
    {
      title: '歌名',
      key: 'displayName',
    },
    {
      title: '歌手',
      key: 'singer',
      render(row: ISongInfo) {
        return h(
          NTag,
          {
            color: { borderColor: '#C073E4', color: 'rgba(182,200,255,.4)', textColor: '#C073E4' },
          },
          { default: () => row.singer }
        )
      },
    },
    {
      title: '语种',
      key: 'language',
    },
    {
      title: '分类',
      key: 'keyword',
    },
    {
      title: '演唱状态',
      key: 'sts',
      render(row) {
        return h(
          NTag,
          {
            type: row.sts === 0 ? 'info' : 'error',
          },
          {
            default: () => (row.sts === 0 ? '未唱' : '已唱'),
          }
        )
      },
    },
  ]

  return colarr
}
</script>
