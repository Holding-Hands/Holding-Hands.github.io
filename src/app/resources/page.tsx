'use client'

import { useState } from 'react'
import Link from 'next/link'
import PDFViewer from '@/components/PDFViewer'
import Watermark from '@/components/Watermark'
import { withBasePath } from '@/config/site'
import { ThemeProvider } from '@/contexts/ThemeContext'

interface Resource {
  id: string
  title: string
  description: string
  fileSize: string
  category: string
  pdfUrl: string
  externalUrl?: string
}

const resources: Resource[] = [
  {
    id: 'huxueyan-restoration',
    title: '胡雪岩故居修复研究',
    description: '高念华著 - 北京文物出版社。详细介绍了胡雪岩故居的修复过程和历史研究。',
    fileSize: '163 MB',
    category: '建筑研究',
    pdfUrl: '/resources/建筑研究/胡雪岩故居修复研究 -- 高念华著 --北京_文物出版社 .pdf',
    externalUrl: 'https://github.com/Holding-Hands/Holding-Hands.github.io/releases/download/v1.0/huxueyan.pdf'
  },
  // 示例：添加更多资料
  // {
  //   id: 'example-history',
  //   title: '示例历史文献',
  //   description: '历史文献资料示例',
  //   fileSize: '10 MB',
  //   category: '历史文献',
  //   pdfUrl: '/resources/历史文献/example.pdf',
  // },
  // {
  //   id: 'example-garden',
  //   title: '示例园林资料',
  //   description: '园林艺术资料示例',
  //   fileSize: '15 MB',
  //   category: '园林艺术',
  //   pdfUrl: '/resources/园林艺术/example.pdf',
  // },
]

function ResourcesPageContent() {
  const [selectedPdf, setSelectedPdf] = useState<Resource | null>(null)

  if (selectedPdf) {
    return (
      <PDFViewer
        pdfUrl={selectedPdf.externalUrl || withBasePath(selectedPdf.pdfUrl)}
        title={selectedPdf.title}
        onBack={() => setSelectedPdf(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Watermark text="谁人不识张公子" fontSize={18} opacity={0.04} rotate={-25} gap={250} />
      
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm dark:shadow-gray-900/50 transition-colors duration-300 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                参考资料
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                相关历史文献和研究资料
              </p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回首页
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(resource => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 hover:shadow-2xl dark:hover:shadow-gray-900/80 transition-all duration-300 overflow-hidden group relative transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-cyan-50/0 dark:from-blue-900/0 dark:to-cyan-900/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 dark:group-hover:from-blue-900/20 dark:group-hover:to-cyan-900/20 transition-all duration-300 pointer-events-none" />
              
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{resource.fileSize}</span>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full whitespace-nowrap">
                    {resource.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPdf(resource)}
                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all hover:scale-105 hover:shadow-lg"
                  >
                    在线阅读
                  </button>
                  <a
                    href={resource.externalUrl || withBasePath(resource.pdfUrl)}
                    download={resource.title + '.pdf'}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 hover:border-blue-400 dark:hover:border-blue-500"
                    title="下载"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg">暂无参考资料</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
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

export default function ResourcesPage() {
  return (
    <ThemeProvider>
      <ResourcesPageContent />
    </ThemeProvider>
  )
}
