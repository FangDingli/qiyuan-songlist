import { createFetch } from '@vueuse/core'
import { getToken } from '~/utils'

const baseUrl =
  import.meta.env.MODE === 'production' ? 'https://www.qiyuanyuan.live/songlistapi' : '/devServer'

export const useRequest = createFetch({
  baseUrl,
  options: {
    immediate: true,
    timeout: 3000,
    beforeFetch({ options }) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${getToken()}`,
      }

      return { options }
    },
    onFetchError(ctx) {
      window.$message.error(`${ctx.response?.status} ${ctx.response?.statusText}`)
      return ctx
    },
    /* afterFetch({ data, response }) {
      console.log(data, response)

      return { data, response }
    }, */
  },
})
