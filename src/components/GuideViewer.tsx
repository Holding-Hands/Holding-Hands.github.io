'use client'

import { Guide } from '@/types/guide'
import Watermark from './Watermark'

interface GuideViewerProps {
  guide: Guide
  onBack: () => void
}

export default function GuideViewer({ guide, onBack }: GuideViewerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      {/* Watermark */}
      <Watermark text="谁人不识张公子" fontSize={18} opacity={0.04} rotate={-25} gap={250} />
      
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm dark:shadow-gray-900/50 sticky top-0 z-10 transition-colors duration-300 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回列表
          </button>
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
