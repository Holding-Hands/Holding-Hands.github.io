'use client'

import { useEffect } from 'react'

export default function CopyProtection() {
  useEffect(() => {
    // 禁用右键菜单
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // 禁用复制
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    // 禁用剪切
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    // 禁用选择
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    // 禁用拖拽
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // 禁用键盘快捷键（Ctrl+C, Ctrl+A, Ctrl+X, 截图等）
    const handleKeyDown = (e: KeyboardEvent) => {
      // 禁用 PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        // 尝试清空剪贴板（虽然 PrintScreen 通常由系统处理，但可以尝试干扰后续的粘贴）
        try {
          navigator.clipboard.writeText('')
        } catch (err) {
          // ignore
        }
        return false
      }

      // 禁用 Windows 截图快捷键 (Win + Shift + S)
      if (e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        return false
      }

      // 禁用 Mac 截图快捷键 (Cmd + Shift + 3/4)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4')) {
        e.preventDefault()
        return false
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'C' || 
         e.key === 'x' || e.key === 'X' || 
         e.key === 'a' || e.key === 'A' ||
         e.key === 's' || e.key === 'S' ||
         e.key === 'u' || e.key === 'U' ||
         e.key === 'p' || e.key === 'P') // 增加禁用 Ctrl+P (打印)
      ) {
        e.preventDefault()
        return false
      }
    }

    // 禁用打印
    const handleBeforePrint = (e: Event) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCut)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('beforeprint', handleBeforePrint)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCut)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('beforeprint', handleBeforePrint)
    }
  }, [])

  return null
}
