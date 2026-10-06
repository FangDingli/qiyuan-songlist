import { reactive } from 'vue'

export interface ToastItem {
  id: number
  text: string
  type: 'success' | 'error'
}

const toasts = reactive<ToastItem[]>([])
let seq = 0

export function useToast() {
  function show(text: string, type: ToastItem['type'] = 'success') {
    const id = ++seq
    toasts.push({ id, text, type })
    setTimeout(() => {
      const i = toasts.findIndex((t) => t.id === id)
      if (i !== -1) toasts.splice(i, 1)
    }, 2200)
  }
  return { toasts, show }
}
