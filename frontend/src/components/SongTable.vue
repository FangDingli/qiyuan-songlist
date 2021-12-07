<template>
  <div class="table_container">
    <NDataTable
      :columns="columns"
      :data="dataList"
      :row-key="rowData => rowData.id"
      virtual-scroll
      :max-height="tableHeight"
      size="small"
      :loading="loading"
    ></NDataTable>
  </div>
</template>

<script setup lang="ts">
import type { TableData } from '@/store'
import { h, toRefs, computed } from 'vue'
import { NDataTable, NTag } from 'naive-ui'
import { useStore } from 'vuex'
import type { StateProps } from '../store'

const store = useStore<StateProps>()

let loading = computed(() => store.getters.getLoadingState)

const props = defineProps<{ dataList: TableData[]; tableHeight: string }>()

const { dataList, tableHeight } = toRefs(props)

const columnsGen = () => [
  {
    title: '歌名',
    key: 'original_name',
  },
  {
    title: '歌手',
    key: 'singer',
    render(row: TableData) {
      return h(
        NTag,
        { color: { borderColor: '#C073E4', color: 'rgba(182,200,255,.4)', textColor: '#C073E4' } },
        { default: () => row.singer }
      )
    },
  },
]

const columns = columnsGen()
</script>

<style>
.table_container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
@media (max-width: 768px) {
  .table_container {
    width: 100%;
  }
}
</style>
