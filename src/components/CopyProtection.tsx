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

    // 禁用键盘快捷键（Ctrl+C, Ctrl+A, Ctrl+X等）
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'C' || 
         e.key === 'x' || e.key === 'X' || 
         e.key === 'a' || e.key === 'A' ||
         e.key === 's' || e.key === 'S' ||
         e.key === 'u' || e.key === 'U')
      ) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCut)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCut)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return null
}
