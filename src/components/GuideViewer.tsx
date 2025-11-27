'use client'

import { useState, useEffect, useRef } from 'react'
import { Guide } from '@/types/guide'
import Watermark from './Watermark'
import { useTheme } from '@/contexts/ThemeContext'

// VoiceRSS API Key
const VOICERSS_API_KEY = '28fef066a3164873802fae9fe37e351c'

interface GuideViewerProps {
  guide: Guide
  onBack: () => void
}

export default function GuideViewer({ guide, onBack }: GuideViewerProps) {
  const { theme } = useTheme()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 停止朗读
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
    setIsPaused(false)
  }

  // 开始/暂停朗读
  const toggleSpeaking = () => {
    if (isPlaying) {
      if (isPaused) {
        // 继续播放
        audioRef.current?.play()
        setIsPaused(false)
      } else {
        // 暂停
        audioRef.current?.pause()
        setIsPaused(true)
      }
    } else {
      // 提取纯文本
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = guide.content
      let text = tempDiv.innerText || tempDiv.textContent || ''
      
      if (!text.trim()) return

      // VoiceRSS 有字符限制（免费版约 100KB），如果文本太长需要截断
      // 为了安全起见，限制在 5000 字符
      if (text.length > 5000) {
        text = text.substring(0, 5000) + '...'
      }

      // 构建 VoiceRSS API URL
      const encodedText = encodeURIComponent(text)
      const audioUrl = `https://api.voicerss.org/?key=${VOICERSS_API_KEY}&hl=zh-cn&src=${encodedText}&c=MP3`

      // 创建 Audio 元素
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => {
        setIsPlaying(true)
        setIsPaused(false)
      }

      audio.onended = () => {
        setIsPlaying(false)
        setIsPaused(false)
        audioRef.current = null
      }

      audio.onerror = (e) => {
        console.error('Audio error:', e)
        setIsPlaying(false)
        setIsPaused(false)
        audioRef.current = null
      }

      // 开始播放
      audio.play().catch(err => {
        console.error('Play failed:', err)
        setIsPlaying(false)
      })

      setIsPlaying(true)
    }
  }

  // 组件卸载时停止播放
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      {/* Watermark */}
      <Watermark text="谁人不识张公子" fontSize={18} opacity={theme === 'dark' ? 0.08 : 0.04} rotate={-25} gap={250} />
      
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm dark:shadow-gray-900/50 sticky top-0 z-10 transition-colors duration-300 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回列表
            </button>

            {/* Speech Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSpeaking}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                  isPlaying && !isPaused
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={isPlaying ? (isPaused ? '继续朗读' : '暂停朗读') : '开始朗读'}
              >
                {isPlaying && !isPaused ? (
                  <>
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">朗读中</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span className="hidden sm:inline">{isPaused ? '继续' : '朗读'}</span>
                  </>
                )}
              </button>
              
              {isPlaying && (
                <button
                  onClick={stopSpeaking}
                  className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="停止朗读"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 transition-colors border border-gray-200 dark:border-gray-700">
          {/* Title */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {guide.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium rounded-full">
                {guide.category}
              </span>
              {guide.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {guide.location}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div 
            className="markdown-content prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-400">
              © 2025 华东导游词在线浏览平台
            </p>
            <p className="text-xs text-gray-500 group cursor-default">
              作者：
              <span className="text-blue-400 font-medium transition-all duration-300 group-hover:text-blue-300 group-hover:scale-110 inline-block group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                谁人不识张公子
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
