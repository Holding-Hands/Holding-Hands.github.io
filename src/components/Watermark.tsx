'use client'

import { useEffect, useRef } from 'react'

interface WatermarkProps {
  text?: string
  fontSize?: number
  opacity?: number
  rotate?: number
  gap?: number
}

export default function Watermark({
  text = '谁人不识张公子',
  fontSize = 16,
  opacity = 0.03,
  rotate = -25,
  gap = 200,
}: WatermarkProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear existing watermarks
    container.innerHTML = ''

    // Calculate how many watermarks we need
    const width = window.innerWidth
    const height = window.innerHeight
    const cols = Math.ceil(width / gap) + 1
    const rows = Math.ceil(height / gap) + 1

    // Create watermark elements
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const watermark = document.createElement('div')
        watermark.className = 'watermark-text'
        watermark.textContent = text
        watermark.style.cssText = `
          left: ${j * gap}px;
          top: ${i * gap}px;
          font-size: ${fontSize}px;
          color: rgba(0, 0, 0, ${opacity});
          transform: rotate(${rotate}deg);
        `
        container.appendChild(watermark)
      }
    }

    // Re-render on window resize
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      const newCols = Math.ceil(newWidth / gap) + 1
      const newRows = Math.ceil(newHeight / gap) + 1

      container.innerHTML = ''
      for (let i = 0; i < newRows; i++) {
        for (let j = 0; j < newCols; j++) {
          const watermark = document.createElement('div')
          watermark.className = 'watermark-text'
          watermark.textContent = text
          watermark.style.cssText = `
            left: ${j * gap}px;
            top: ${i * gap}px;
            font-size: ${fontSize}px;
            color: rgba(0, 0, 0, ${opacity});
            transform: rotate(${rotate}deg);
          `
          container.appendChild(watermark)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [text, fontSize, opacity, rotate, gap])

  return (
    <div
      ref={containerRef}
      className="watermark-pattern"
      style={{ pointerEvents: 'none' }}
    />
  )
}
