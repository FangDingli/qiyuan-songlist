<template>
  <NModal
    v-model:show="modalShow"
    class="w-60vw h-70vh overflow-y-scroll"
    preset="card"
    title="添加歌曲"
  >
    <NCard
      :title="item.original_name.length > 0 ? item.original_name : ' '"
      bordered
      class="w-100% mb-4"
      v-for="(item, index) in formData"
    >
      <template #header-extra>
        <NButton text type="error" @click="handleDelete(index)">删除此项</NButton>
      </template>
      <NForm labelPlacement="left">
        <NFormItem label="歌名：">
          <NInput v-model:value="item.original_name"></NInput>
        </NFormItem>
        <NFormItem label="歌手：">
          <NInput v-model:value="item.singer"></NInput>
        </NFormItem>
        <NFormItem label="语言：">
          <NSelect v-model:value="item.language" :options="languageOptions"></NSelect>
        </NFormItem>
        <NFormItem label="分类：">
          <NSelect v-model:value="item.keyword" :options="keywordOptions" multiple></NSelect>
        </NFormItem>
      </NForm>
    </NCard>
    <div class="text-center mt-4">
      <NButton class="mr-5" type="primary" @click="handleAdd">再来一个！</NButton>
      <NButton type="info" @click="handleSubmit">提交保存！</NButton>
    </div>
  </NModal>
</template>

<script lang="ts" setup>
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NCard,
  NButton,
  useDialog,
  useMessage,
} from 'naive-ui'
import { ref, toRefs } from 'vue'
import type { ISongInfo, ISongLanguage, ISongkeyword } from '../type'
import { getToken } from '../utils'
import { useRouter } from 'vue-router'
import baseRequest from '~/utils/request'

const props = defineProps<{ languageOptions: ISongLanguage[]; keywordOptions: ISongkeyword[] }>()
const { languageOptions, keywordOptions } = toRefs(props)

const dialog = useDialog()
const router = useRouter()
const message = useMessage()

let modalShow = ref(false)
let formData = ref<ISongInfo[]>([
  {
    original_name: '',
    singer: '',
    language: '',
    keyword: '',
    editKeywords: [],
  },
])

const handleAdd = () => {
  formData.value.push(JSON.parse(JSON.stringify(originalData)))
}

const handleDelete = (index: number) => {
  formData.value.splice(index, 1)
}

const handleSubmit = () => {
  const d = dialog.warning({
    content: '确认提交所有歌曲？',
    positiveText: '确认!',
    negativeText: '我点错了!',
    onPositiveClick: async () => {
      d.loading = true
      const token = getToken()
      const { error, data } = await baseRequest('songList', {
        beforeFetch({ options }) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
          formData.value.forEach(item => {
            item.keyword = item.editKeywords.join(';')
          })
          options.body = JSON.stringify(formData.value)
        },
      })
        .post()
        .json()
      if (error.value) {
        message.error(data.value.status + ' ' + data.value.message, { duration: 5000 })
        if (data.value.status == 401) {
          router.push('/login')
        }
      } else {
        message.success('操作成功', { duration: 3000 })
      }
      return true
    },
  })
}

const originalData = {
  original_name: '',
  singer: '',
  language: '',
  keyword: '',
  editKeywords: [],
}

defineExpose({
  modalShow,
})
</script>
