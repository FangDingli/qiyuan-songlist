export const currentTheme = ref<any>(null)

export const getToken = () => localStorage.getItem('qy-songlist-token')

export const setToken = (token: string) => {
  localStorage.setItem('qy-songlist-token', token)
}
