<script lang="ts" setup>
import { useRequest } from '~/composables/useRequest'
import { setToken } from '~/utils'

const route = useRoute()
const router = useRouter()
const password = ref('')

const { data, execute, isFetching, statusCode } = useRequest('/login', {
  immediate: false,
})
  .post(
    computed(() => ({
      username: 'admin',
      password: password.value,
    })),
  )
  .json()

const hadnleLogin = async () => {
  await execute()

  if (statusCode.value === 200) {
    setToken(data.value.data)
    window.$message.success('登录成功，即将跳转...')
    router.push({ path: route.query.redirect ? route.query.redirect : '/admin' })
  }
}
</script>

<template>
  <NLayout class="h-full">
    <NResult
      v-if="route.query.redirect"
      status="403"
      title="请先登录"
      description="总有些门是对你关闭的"
    ></NResult>
    <NCard class="w-60% absolute top-50% left-50%" translate="-50%" lt-sm="w-full">
      <div flex="~">
        <NInput
          v-model:value="password"
          placeholder="输入密码以继续"
          class="mr-3"
          autofocus
          @keyup.enter.prevent="hadnleLogin"
        ></NInput>
        <NButton type="primary" :loading="isFetching" @click="hadnleLogin"> 确定 </NButton>
      </div>
    </NCard>
  </NLayout>
</template>
