'use client'

import { useEffect } from 'react'

export default function CopyProtection() {
  useEffect(() => {
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
      // 禁用 F12 和其他开发者工具快捷键
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
      ) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCut)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCut)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return null
}
