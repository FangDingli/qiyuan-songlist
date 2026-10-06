/**
 * 复制文本到剪切板。navigator.clipboard 仅在 HTTPS/localhost 可用,
 * 非 HTTPS 环境退回 execCommand 方案。
 */
export function useClipboard() {
  async function copy(text: string): Promise<boolean> {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch {
        // 被拒绝或异常时走兜底
      }
    }
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      return document.execCommand('copy')
    } catch {
      return false
    } finally {
      textarea.remove()
    }
  }
  return { copy }
}
