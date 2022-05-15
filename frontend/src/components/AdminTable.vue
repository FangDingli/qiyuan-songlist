<template>
  <div class="w-100%% h-100%">
    <NDataTable
      :columns="columns"
      :data="songs"
      :row-key="rowData => rowData.id"
      :virtualScroll="needVirtualScroll"
      :maxHeight="tableHeight"
      @update:checked-row-keys="handleSelection"
    ></NDataTable>
  </div>
</template>

<script lang="ts" setup>
import { useSongStore } from '~/store/songTable'
import { NDataTable, NTag, NButton } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, toRefs, ref } from 'vue'
import type { ISongInfo } from '~/type'

const songlist = useSongStore()

const props = withDefaults(
  defineProps<{
    needVirtualScroll: boolean
    songs: ISongInfo[]
    tableHeight: number | string
  }>(),
  {
    needVirtualScroll: true,
    tableHeight: '100%',
  }
)

const { songs, tableHeight } = toRefs(props)

const handleSelection = (rowkeys: number[]) => {
  console.log(rowkeys)
}

const columns = ref<DataTableColumns<ISongInfo>>([
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
  /* {
      title: '操作',
      key:'options'
      render(row:ISongInfo){
        return h(
          NButton,
          {text:true},
          {default:()=>'删除'}
        )
      }
    }, */
])

/* if (props.needVirtualScroll) {
  columns.value.unshift({
    type: 'selection',
  })
  columns.value.push(
    {
      title: '操作',
      key:'options'
      render(row:ISongInfo){
        return [
          h(
            NButton,
            {text:true},
            {default=>''}
          )
        ]
      }
    },
  )
} */
</script>
