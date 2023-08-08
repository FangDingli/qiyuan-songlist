export const currentTheme = ref<any>(null)

export const getToken = () => localStorage.getItem('qy-songlist-token')

export const setToken = (token: string) => {
  localStorage.setItem('qy-songlist-token', token)
}

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
