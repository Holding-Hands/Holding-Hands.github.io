'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ThemeProvider } from '@/contexts/ThemeContext'

function DebugPageContent() {
  const [vConsoleEnabled, setVConsoleEnabled] = useState(false)
  const [vConsole, setVConsole] = useState<any>(null)
  const [showSystemInfo, setShowSystemInfo] = useState(false)

  useEffect(() => {
    // 检查 localStorage 中的设置
    const saved = localStorage.getItem('vconsole-enabled')
    if (saved === 'true') {
      setVConsoleEnabled(true)
      loadVConsole()
    }
  }, [])

  const loadVConsole = async () => {
    if (typeof window !== 'undefined' && !vConsole) {
      try {
        console.log('Loading vConsole module...')
        
        // 使用 CDN 方式加载 vConsole
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js'
        script.onload = () => {
          console.log('vConsole script loaded from CDN')
          // @ts-ignore
          if (window.VConsole) {
            // @ts-ignore
            const instance = new window.VConsole()
            console.log('vConsole instance created:', instance)
            setVConsole(instance)
          } else {
            console.error('VConsole not found on window object')
            alert('vConsole 加载失败：未找到 VConsole 对象')
          }
        }
        script.onerror = () => {
          console.error('Failed to load vConsole script from CDN')
          alert('加载 vConsole 失败：无法从 CDN 加载脚本')
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error('Failed to load vConsole:', error)
        alert('加载 vConsole 失败: ' + error)
      }
    } else {
      console.log('vConsole already loaded or not in browser')
    }
  }

  const handleToggle = async () => {
    console.log('Toggle clicked, current state:', vConsoleEnabled)
    
    if (vConsoleEnabled) {
      // 关闭 vConsole
      console.log('Closing vConsole...')
      if (vConsole) {
        vConsole.destroy()
        setVConsole(null)
      }
      localStorage.setItem('vconsole-enabled', 'false')
      setVConsoleEnabled(false)
    } else {
      // 开启 vConsole
      console.log('Opening vConsole...')
      await loadVConsole()
      localStorage.setItem('vconsole-enabled', 'true')
      setVConsoleEnabled(true)
    }
  }

  const clearCache = () => {
    if (confirm('确定要清除所有缓存吗？页面将会刷新。')) {
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
    }
  }

  const getSystemInfo = () => {
    if (typeof window === 'undefined') {
      return {
        platform: 'N/A',
        screenSize: 'N/A',
        userAgent: 'N/A',
        language: 'N/A',
        online: false,
        cookieEnabled: false,
      }
    }
    return {
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
      language: navigator.language,
      online: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
    }
  }

  const [systemInfo, setSystemInfo] = useState(getSystemInfo())

  useEffect(() => {
    setSystemInfo(getSystemInfo())
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                调试工具
              </h1>
              <span className="text-gray-400 dark:text-gray-500">|</span>
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                返回首页
              </Link>
            </div>
            <Link
              href="/"
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* vConsole Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            vConsole
          </h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Toggle Switch */}
              <button
                onClick={handleToggle}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  vConsoleEnabled
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                    vConsoleEnabled ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
              
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {vConsoleEnabled ? '已开启' : '已关闭'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  点击右下角展开调试台
                </p>
              </div>
            </div>

            <button
              onClick={handleToggle}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {vConsoleEnabled ? '关闭vConsole' : '开启vConsole'}
            </button>
          </div>

          {vConsoleEnabled && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                点击右下角展开调试台
              </p>
            </div>
          )}
        </section>

        {/* Cache Management Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                缓存管理
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                清除所有缓存
              </p>
            </div>
            <button
              onClick={clearCache}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="清除缓存"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </section>

        {/* System Info Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <button
            onClick={() => setShowSystemInfo(!showSystemInfo)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              设备信息
            </h2>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                showSystemInfo ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSystemInfo && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Platform Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Win32、{systemInfo.screenSize}
                  </h3>
                </div>
              </div>

              {/* Browser Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    浏览器信息
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                  {systemInfo.userAgent.substring(0, 50)}...
                </p>
              </div>

              {/* Status Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${systemInfo.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    状态信息
                  </h3>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    在线: {systemInfo.online ? '是' : '否'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Cookie: {systemInfo.cookieEnabled ? '已启用' : '已禁用'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/"
            className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>首页</span>
          </Link>

          <Link
            href="/resources"
            className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>参考资料</span>
          </Link>

          <Link
            href="/debug"
            className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span>返回调试页</span>
          </Link>
        </section>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 华东导游词在线浏览平台 · 作者：
            <span className="text-purple-600 dark:text-purple-400 font-medium">谁人不识张公子</span>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function DebugPage() {
  return (
    <ThemeProvider>
      <DebugPageContent />
    </ThemeProvider>
  )
}
