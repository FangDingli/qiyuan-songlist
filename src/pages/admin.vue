<route>
  {
    meta:{
      requiresAuth:true
    }
  }
</route>

<script lang="ts" setup>
import { darkTheme } from 'naive-ui'
import { currentTheme, setCurrentTheme } from '~/utils'
import { useRequest } from '~/composables/useRequest'
import type { UploadFileInfo } from 'naive-ui'

const switchTheme = () => {
  if (currentTheme.value) {
    setCurrentTheme(null)
  } else {
    setCurrentTheme(darkTheme)
  }
}

let tableLoading = $ref(false)
let tableList = $ref([])
let tableListError = $ref(false)
const getTableList = async () => {
  tableLoading = true
  const { data, statusCode } = await useRequest('/fileList').get().json()
  if (statusCode.value === 200) {
    tableList = data.value.data
  } else {
    tableListError = true
  }
  tableLoading = false
}

getTableList()

let uploadLoading = $ref(false)
let uploadFileList = $ref<UploadFileInfo[]>([])

const handleFileUpload = async (options: {
  file: UploadFileInfo
  fileList: Array<UploadFileInfo>
  event?: Event
}) => {
  if (options.file.status === 'pending') {
    uploadLoading = true
    const formData = new FormData()
    formData.set('file', options.file.file!)
    const { statusCode } = await useRequest('/songlist').post(formData).json()
    if (statusCode.value === 200) {
      window.$message.success('上传成功')
      getTableList()
    }
    uploadFileList = []

    uploadLoading = false
  }
}

const downloadFile = (name: string) => {
  window.open(`https://www.qiyuanyuan.live/songlistDownload/${name}`)
}

const userCookie = $ref('')
const handleSaveUserCookie = async () => {
  const { statusCode } = await useRequest('/savecookie').post({ userCookie }).json()
  if (statusCode.value === 200) {
    window.$message.success('上传成功')
  }
}
</script>

<template>
  <NLayout class="h-full">
    <NLayoutHeader>
      <div class="flex items-center">
        <h2 class="w-full h-full" text="center">
          <NText type="info"> 歌单管理 </NText>
        </h2>
        <div class="ml-auto flex">
          <button
            class="w-22px h-22px mr-30px"
            :class="currentTheme ? 'i-uil-moon' : 'i-uil-sun'"
            @click="switchTheme"
          ></button>
        </div>
      </div>
    </NLayoutHeader>
    <NThing>
      <div class="w-50% m-x-auto" lt-sm="w-full">
        <NSpin :show="uploadLoading">
          <NUpload
            directory-dnd
            :max="1"
            accept=".xls,.xlsx"
            class="m-x-auto"
            :on-change="handleFileUpload"
            :file-list="uploadFileList"
          >
            <NUploadDragger>
              <div
                i-uil-cloud-upload
                class="w-48px h-48px m-x-auto"
                style="margin-bottom: 12px"
              ></div>
              <NText style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </NText>
              <NP>只能上传歌单excel文件</NP>
              <NP>如本地文件丢失，下方有历史版本可供下载编辑</NP>
            </NUploadDragger>
          </NUpload></NSpin
        >

        <div class="mt-10">
          <NP>历史版本</NP>
          <NSpin :show="tableLoading">
            <NTable>
              <thead>
                <tr>
                  <th>文件名</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody v-if="tableList.length">
                <tr v-for="item in tableList" :key="item">
                  <td>{{ item }} <span v-if="item === 'A_template.xlsx'">(模版文件)</span></td>
                  <td>
                    <NText
                      class="cursor-pointer mr-5"
                      tag="a"
                      type="info"
                      underline
                      @click="downloadFile(item)"
                    >
                      <i i-uil-cloud-download></i>
                      下载
                    </NText>
                    <!-- <NText
                      v-if="item !== 'A_template.xlsx'"
                      class="cursor-pointer"
                      tag="a"
                      type="error"
                      underline
                    >
                      <i i-uil-trash></i>
                      删除
                    </NText> -->
                  </td>
                </tr>
              </tbody>
              <NResult
                v-if="tableListError"
                status="error"
                :description="`出了点小错误`"
                class="w-full"
              >
              </NResult>
              <NEmpty v-if="!tableList.length" description="找不到历史版本，需要重新上传">
                <template #extra>
                  <NButton size="small" @click="downloadFile('A_template.xlsx')">
                    下载模板
                  </NButton>
                </template>
              </NEmpty>
            </NTable>
          </NSpin>
        </div>

        <div class="mt-10">
          <NP>归墟的B站登录凭证</NP>
          <NInput
            v-model:value="userCookie"
            type="textarea"
            placeholder="这里是给归墟用的，苑不用管。 第三方接口老是挂于是现在改成直接带登录凭证请求官方接口这样就保证稳定啦"
          ></NInput>
          <NButton class="mt-2" type="primary" @click="handleSaveUserCookie">保存</NButton>
        </div>
      </div>
    </NThing>
  </NLayout>
</template>
