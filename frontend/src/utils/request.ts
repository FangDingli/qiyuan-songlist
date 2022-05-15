import { createFetch } from '@vueuse/core'

const appBaseUrl = import.meta.env.MODE === 'production' ? 'http://8.136.112.243:8000' : '/devServer'

const baseRequest = createFetch({
  baseUrl: appBaseUrl,
  fetchOptions: {
    mode: 'cors',
    credentials: 'omit'
  }
})

export default baseRequest