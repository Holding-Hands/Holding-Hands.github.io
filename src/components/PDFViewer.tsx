'use client'

import { useState, useEffect } from 'react'

interface PDFViewerProps {
  pdfUrl: string
  title: string
  onBack: () => void
}

export default function PDFViewer({ pdfUrl, title, onBack }: PDFViewerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [pdfError, setPdfError] = useState(false)

  useEffect(() => {
    // 检测是否为移动设备
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 判断是否为外部链接
  const isExternalUrl = pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')
  
  // 构建完整的 PDF URL
  const getViewerUrl = () => {
    if (pdfError || isMobile) {
      // 移动端或出错时使用 PDF.js
      const url = isExternalUrl ? pdfUrl : window.location.origin + pdfUrl
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`
    }
    
    // PC 端使用浏览器内置查看器
    return pdfUrl
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm flex-shrink-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">返回</span>
            </button>
            <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate flex-1 text-center px-2">
              {title}
            </h1>
            <div className="flex gap-2 flex-shrink-0">
              <a
                href={pdfUrl}
                download
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                title="下载 PDF"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">下载</span>
              </a>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                title="在新窗口打开"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                新窗口
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* PDF Viewer - Full Screen */}
      <main className="flex-1 overflow-hidden">
        {isExternalUrl ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8 text-center max-w-lg transition-colors border border-gray-200 dark:border-gray-700">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">大文件在线预览</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                此文件托管在 GitHub Releases，由于文件较大（155MB），建议下载到本地查看以获得最佳体验。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href={pdfUrl}
                  download
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  下载 PDF
                </a>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  新窗口打开
                </a>
              </div>
            </div>
          </div>
        ) : pdfError ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8 text-center max-w-md transition-colors border border-gray-200 dark:border-gray-700">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 dark:text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">无法加载 PDF</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">请尝试下载文件或在新窗口中打开</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href={pdfUrl}
                  download
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  下载 PDF
                </a>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  新窗口打开
                </a>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={getViewerUrl()}
            className="w-full h-full border-0"
            title={title}
            onError={() => setPdfError(true)}
            allow="fullscreen"
          />
        )}
      </main>
    </div>
  )
}
