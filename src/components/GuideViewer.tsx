'use client'

import { useState, useEffect, useRef } from 'react'
import { Guide } from '@/types/guide'
import Watermark from './Watermark'
import { useTheme } from '@/contexts/ThemeContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// VoiceRSS API Key（备用方案）
const VOICERSS_API_KEY = '28fef066a3164873802fae9fe37e351c'

// 检测是否为微信浏览器
const isWeChat = () => {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('micromessenger')
}

// 检测是否支持 Web Speech API
const supportsSpeechSynthesis = () => {
  if (typeof window === 'undefined') return false
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

interface GuideViewerProps {
  guide: Guide
  onBack: () => void
}

export default function GuideViewer({ guide, onBack }: GuideViewerProps) {
  const { theme } = useTheme()
  const [markdown, setMarkdown] = useState<string>('')
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ttsMode, setTtsMode] = useState<'native' | 'voicerss' | null>(null)
  const [progress, setProgress] = useState({ current: 0, total: 0 }) // 播放进度
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 分段播放相关 refs
  const chunksRef = useRef<string[]>([])
  const currentChunkRef = useRef<number>(0)
  const preloadedAudiosRef = useRef<Map<number, HTMLAudioElement>>(new Map()) // 预加载队列
  const isStoppedRef = useRef<boolean>(false)
  const loadingPromisesRef = useRef<Map<number, Promise<HTMLAudioElement | null>>>(new Map())

  // 加载 markdown 内容
  useEffect(() => {
    const loadMarkdown = async () => {
      setIsLoadingContent(true)
      try {
        // 移除 'public/' 前缀，因为 Next.js 的 public 目录直接映射到根路径
        const filePath = guide.fileName.replace(/^public\//, '/')
        const response = await fetch(filePath)
        if (response.ok) {
          const text = await response.text()
          setMarkdown(text)
        } else {
          console.error('Failed to load:', filePath, response.status)
          setMarkdown('# 加载失败\n\n无法加载文件内容')
        }
      } catch (error) {
        console.error('Error loading markdown:', error)
        setMarkdown('# 加载错误\n\n加载文件时出错')
      } finally {
        setIsLoadingContent(false)
      }
    }

    loadMarkdown()
  }, [guide.fileName])

  // 初始化时检测 TTS 模式
  useEffect(() => {
    if (isWeChat()) {
      setTtsMode('voicerss')
      console.log('TTS mode: VoiceRSS (WeChat detected)')
    } else if (supportsSpeechSynthesis()) {
      setTtsMode('native')
      console.log('TTS mode: Native Web Speech API')
    } else {
      setTtsMode('voicerss')
      console.log('TTS mode: VoiceRSS (fallback)')
    }
  }, [])

  // 停止朗读
  const stopSpeaking = () => {
    // 标记停止
    isStoppedRef.current = true

    // 停止原生 API
    if (ttsMode === 'native' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    // 停止 Audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    // 清理所有预加载
    preloadedAudiosRef.current.forEach(audio => {
      URL.revokeObjectURL(audio.src)
    })
    preloadedAudiosRef.current.clear()
    loadingPromisesRef.current.clear()

    // 重置分段状态
    chunksRef.current = []
    currentChunkRef.current = 0
    setProgress({ current: 0, total: 0 })

    setIsPlaying(false)
    setIsPaused(false)
    setIsLoading(false)
  }

  // 使用原生 Web Speech API（快速，PC 端）
  const speakWithNative = (text: string) => {
    window.speechSynthesis.cancel() // 先停止之前的

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 1.0

    // 尝试找中文语音
    const voices = window.speechSynthesis.getVoices()
    const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'))
    if (zhVoice) utterance.voice = zhVoice

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
      setIsLoading(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = (e) => {
      console.error('Native TTS error:', e)
      setIsPlaying(false)
      setIsPaused(false)
      setIsLoading(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  // 将文本分成小段（按句子分割，每段约300字）
  const splitTextToChunks = (text: string, chunkSize = 300): string[] => {
    const chunks: string[] = []
    // 按句子分割
    const sentences = text.split(/(?<=[。！？.!?\n])/g).filter(s => s.trim())

    let currentChunk = ''
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = sentence
      } else {
        currentChunk += sentence
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }

    return chunks.length > 0 ? chunks : [text.substring(0, chunkSize)]
  }

  // 加载单个音频块
  const loadChunk = async (text: string): Promise<HTMLAudioElement | null> => {
    try {
      const response = await fetch('https://api.voicerss.org/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          key: VOICERSS_API_KEY,
          hl: 'zh-cn',
          src: text,
          c: 'MP3',
          f: '8khz_8bit_mono',
        }),
      })

      if (!response.ok) return null

      const blob = await response.blob()
      if (blob.size < 500 || blob.type.includes('text')) {
        const errorText = await blob.text()
        console.error('VoiceRSS error:', errorText)
        return null
      }

      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      audio.preload = 'auto'
      return audio
    } catch (err) {
      console.error('Load chunk error:', err)
      return null
    }
  }

  // 预加载指定索引的音频
  const preloadChunk = (index: number) => {
    const chunks = chunksRef.current
    if (index >= chunks.length || isStoppedRef.current) return
    if (preloadedAudiosRef.current.has(index) || loadingPromisesRef.current.has(index)) return

    const promise = loadChunk(chunks[index]).then(audio => {
      if (audio && !isStoppedRef.current) {
        preloadedAudiosRef.current.set(index, audio)
      }
      loadingPromisesRef.current.delete(index)
      return audio
    })
    loadingPromisesRef.current.set(index, promise)
  }

  // 播放下一段
  const playNextChunk = async () => {
    if (isStoppedRef.current) return

    const chunks = chunksRef.current
    const currentIndex = currentChunkRef.current

    if (currentIndex >= chunks.length) {
      // 全部播放完毕
      setIsPlaying(false)
      setIsPaused(false)
      setProgress({ current: 0, total: 0 })
      return
    }

    // 更新进度
    setProgress({ current: currentIndex + 1, total: chunks.length })

    // 获取音频（优先用预加载的）
    let audio: HTMLAudioElement | null | undefined = preloadedAudiosRef.current.get(currentIndex)

    if (!audio) {
      // 等待正在加载的
      const loadingPromise = loadingPromisesRef.current.get(currentIndex)
      if (loadingPromise) {
        setIsLoading(true)
        audio = await loadingPromise
        setIsLoading(false)
      } else {
        // 没有预加载，立即加载
        setIsLoading(true)
        audio = await loadChunk(chunks[currentIndex])
        setIsLoading(false)
      }
    }

    preloadedAudiosRef.current.delete(currentIndex)

    if (!audio || isStoppedRef.current) {
      setIsPlaying(false)
      return
    }

    audioRef.current = audio

    audio.onplay = () => {
      setIsPlaying(true)
      setIsPaused(false)
      setIsLoading(false)

      // 开始播放后立即预加载后面 2 段
      preloadChunk(currentIndex + 1)
      preloadChunk(currentIndex + 2)
    }

    audio.onended = () => {
      URL.revokeObjectURL(audio!.src)
      currentChunkRef.current++
      playNextChunk() // 播放下一段
    }

    audio.onerror = () => {
      currentChunkRef.current++
      playNextChunk() // 跳过错误段继续
    }

    console.log(`Playing chunk ${currentIndex + 1}/${chunks.length}`)
    await audio.play()
  }

  // 使用 VoiceRSS API（分段预加载，快速响应）
  const speakWithVoiceRSS = async (text: string) => {
    isStoppedRef.current = false
    preloadedAudiosRef.current.clear()
    loadingPromisesRef.current.clear()

    // 分段（更小的段落更快响应）
    const chunks = splitTextToChunks(text, 200)
    chunksRef.current = chunks
    currentChunkRef.current = 0
    setProgress({ current: 0, total: chunks.length })
    console.log(`Split into ${chunks.length} chunks`)

    // 同时开始加载前 2 段
    preloadChunk(0)
    preloadChunk(1)

    // 开始播放第一段
    await playNextChunk()
  }

  // 开始/暂停朗读
  const toggleSpeaking = async () => {
    if (isLoading) return

    // 处理暂停/继续
    if (isPlaying) {
      if (ttsMode === 'native') {
        if (isPaused) {
          window.speechSynthesis.resume()
          setIsPaused(false)
        } else {
          window.speechSynthesis.pause()
          setIsPaused(true)
        }
      } else {
        if (isPaused) {
          audioRef.current?.play()
          setIsPaused(false)
        } else {
          audioRef.current?.pause()
          setIsPaused(true)
        }
      }
      return
    }

    // 提取纯文本（从 markdown）
    const text = markdown.replace(/[#*`>\-\[\]()]/g, '').trim()
    if (!text) return

    setIsLoading(true)
    console.log('TTS mode:', ttsMode, 'text length:', text.length)

    if (ttsMode === 'native') {
      speakWithNative(text)
    } else {
      await speakWithVoiceRSS(text)
    }
  }

  // 组件卸载时停止播放
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // 显示加载状态
  if (isLoadingContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

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
                disabled={isLoading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${isLoading
                  ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-wait'
                  : isPlaying && !isPaused
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                title={isLoading ? '加载中...' : isPlaying ? (isPaused ? '继续朗读' : '暂停朗读') : '开始朗读'}
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">加载中</span>
                  </>
                ) : isPlaying && !isPaused ? (
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

              {/* 进度显示 */}
              {progress.total > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {progress.current}/{progress.total}
                </span>
              )}
            </div>
          </div>

          {/* 进度条 */}
          {progress.total > 0 && (
            <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 transition-colors border border-gray-200 dark:border-gray-700">
          {/* Title */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
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
          <div className="markdown-content prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a target="_blank" rel="noopener noreferrer" {...props} />
                )
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
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
