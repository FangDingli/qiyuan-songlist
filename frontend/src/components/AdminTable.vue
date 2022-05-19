<template>
  <div class="w-100%% h-100%">
    <NDataTable :columns="columns" :data="songs" :row-key="rowData => rowData.id"></NDataTable>
  </div>
</template>

<script lang="ts" setup>
import { useSongStore, useSonginfoStore } from '~/store/songTable'
import { NDataTable, NTag, NButton, NInput, NSelect } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, toRefs, ref } from 'vue'
import type { ISongInfo } from '~/type'

const emits = defineEmits(['addSongsToEditTable', 'deleteSong'])
const songInfo = useSonginfoStore()

const props = withDefaults(
  defineProps<{
    needVirtualScroll?: boolean
    songs: ISongInfo[]
    tableHeight?: number | string
    editTable?: boolean
  }>(),
  {
    needVirtualScroll: true,
    tableHeight: '100%',
    editTable: false,
  }
)

const { songs, tableHeight } = toRefs(props)

let checkedKeys: number[] = []
const handleSelection = (rowkeys: number[]) => {
  checkedKeys = rowkeys
}
const addCheckedToEdit = () => {
  let addSongs: ISongInfo[] = []
  checkedKeys.forEach(item => {
    addSongs.push(songs.value.find(n => n.id === item)!)
  })
  addSongsToEditTable(addSongs)
}
const addSongsToEditTable = (songs: ISongInfo[]) => {
  emits('addSongsToEditTable', songs)
}

let columns = ref<DataTableColumns<ISongInfo>>([])

if (!props.editTable) {
  columns.value = [
    /* {
      type: 'selection',
    }, */
    {
      title: '歌名',
      key: 'original_name',
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
      title: '操作',
      key: 'options',
      render(row: ISongInfo) {
        return [
          h(
            NButton,
            {
              // text: true,
              // tag: 'a',
              color: '#A9F',
              class: 'mr-1',
              onClick: () => {
                addSongsToEditTable([row])
              },
            },
            { default: () => '→' }
          ),
          h(
            NButton,
            {
              text: true,
              tag: 'a',
              color: 'red',
              onClick: () => {
                emits('deleteSong', row)
              },
            },
            { default: () => '删除' }
          ),
        ]
      },
    },
  ]
} else {
  columns.value = [
    {
      title: '歌名',
      key: 'original_name',
      width: '20%',
      render(row: ISongInfo, index: number) {
        return h(
          NInput,
          {
            value: row.original_name,
            onUpdateValue: v => {
              songs.value[index].original_name = v
            },
          },
          { default: () => row.original_name }
        )
      },
    },
    {
      title: '歌手',
      key: 'singer',
      width: '20%',
      render(row: ISongInfo, index: number) {
        return h(
          NInput,
          {
            value: row.singer,
            onUpdateValue: v => {
              songs.value[index].singer = v
            },
          },
          { default: () => row.singer }
        )
      },
    },
    {
      title: '语种',
      key: 'language',
      render(row: ISongInfo, index: number) {
        return h(NSelect, {
          value: row.language,
          onUpdateValue: (v: string) => {
            songs.value[index].language = v
          },
          options: songInfo.languageDict,
        })
      },
    },
    {
      title: '分类',
      key: 'keyword',
      render(row: ISongInfo, index: number) {
        return h(NSelect, {
          value: row.editKeywords,
          multiple: true,
          onUpdateValue: (v: string[]) => {
            songs.value[index].editKeywords = v
          },
          options: songInfo.keywordDict,
        })
      },
    },
    {
      title: '操作',
      key: 'action',
      render(row, index) {
        return h(
          NButton,
          {
            text: true,
            color: 'red',
            onClick: () => {
              songs.value.splice(index, 1)
            },
          },
          { default: () => '移除' }
        )
      },
    },
  ]
}

defineExpose({
  addCheckedToEdit,
})
</script>
