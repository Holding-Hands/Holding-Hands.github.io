'use client'

import { useState } from 'react'
import Link from 'next/link'
import PDFViewer from '@/components/PDFViewer'
import Watermark from '@/components/Watermark'

interface Resource {
  id: string
  title: string
  description: string
  fileSize: string
  pdfUrl: string
  externalUrl?: string
}

const resources: Resource[] = [
  {
    id: 'huxueyan-restoration',
    title: '胡雪岩故居修复研究',
    description: '高念华著 - 北京文物出版社。详细介绍了胡雪岩故居的修复过程和历史研究。',
    fileSize: '163 MB',
    pdfUrl: '/resources/胡雪岩故居修复研究 -- 高念华著 --北京_文物出版社 .pdf',
    // 由于文件过大，建议使用云存储外部链接
    // externalUrl: 'https://your-cloud-storage.com/huxueyan.pdf'
  },
  // 示例：添加更多资料
  // {
  //   id: 'example',
  //   title: '示例资料',
  //   description: '这是一个示例',
  //   fileSize: '10 MB',
  //   pdfUrl: '/resources/example.pdf',
  // },
]

export default function ResourcesPage() {
  const [selectedPdf, setSelectedPdf] = useState<Resource | null>(null)

  if (selectedPdf) {
    return (
      <PDFViewer
        pdfUrl={selectedPdf.pdfUrl}
        title={selectedPdf.title}
        onBack={() => setSelectedPdf(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      <Watermark text="谁人不识张公子" fontSize={18} opacity={0.04} rotate={-25} gap={250} />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                参考资料
              </h1>
              <p className="text-gray-600">
                相关历史文献和研究资料
              </p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
              className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group relative transform hover:-translate-y-2 hover:scale-[1.01] border-2 border-transparent hover:border-blue-400"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-cyan-50/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 transition-all duration-300 pointer-events-none" />
              
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-500 font-medium">{resource.fileSize}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>
                
                <div className="flex gap-2">
                  {resource.externalUrl ? (
                    <a
                      href={resource.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-all hover:scale-105 hover:shadow-lg"
                    >
                      在线阅读
                    </a>
                  ) : (
                    <button
                      onClick={() => setSelectedPdf(resource)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 hover:shadow-lg"
                    >
                      在线阅读
                    </button>
                  )}
                  <a
                    href={resource.pdfUrl}
                    download
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all hover:scale-105 hover:border-blue-400"
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
