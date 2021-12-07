import Base from '@/lib/ts/Base'
import config from '@/config'

const { api: { dev, prod } } = config
const appBaseUrl = import.meta.env.MODE === "production" ? prod : dev

const baseRequest = Base.NetBase.create({
  baseUrl: appBaseUrl,
  credentials: "omit"
})

export const commonGet = (url: string, params: any) => baseRequest.get(url, params)

export const commonPost = (url: string, params: any) => baseRequest.post(url, params)
