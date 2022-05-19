<template>
  <div class="absolute left-50% top-50% -translate-x-50% -translate-y-50% w-30%">
    <NCard hoverable>
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">密码：</div>
        <NInput
          v-model:value="password"
          placeholder="请输入密码"
          @keyup.enter="handleLogin"
        ></NInput>
        <div class="ml-3">
          <NButton type="primary" :loading="isLoading" @click="handleLogin">登录</NButton>
        </div>
      </div>
    </NCard>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NInput, NCard, NButton, useMessage } from 'naive-ui'
import request from '../utils/request'
import { setToken } from '../utils'
import { useRouter } from 'vue-router'

const router = useRouter()

let password = ref('')
let isLoading = ref(false)
const message = useMessage()

const handleLogin = async () => {
  isLoading.value = true

  const { error, data } = await request('login', {
    beforeFetch({ options }) {
      options.body = JSON.stringify({ username: 'admin', password: password.value })
    },
  })
    .post()
    .json()
  console.log(error, data)
  if (error.value) {
    message.error('登录失败', { duration: 3000 })
    isLoading.value = false
  } else {
    message.success('登录成功,2秒后进入', { duration: 3000 })
    setToken(data.value.token)
    setTimeout(() => {
      isLoading.value = false
      router.push('/admin')
    }, 2000)
  }
}
</script>
