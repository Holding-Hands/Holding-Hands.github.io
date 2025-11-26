'use client'

import { Guide } from '@/types/guide'
import Watermark from './Watermark'

interface GuideViewerProps {
  guide: Guide
  onBack: () => void
}

export default function GuideViewer({ guide, onBack }: GuideViewerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Watermark */}
      <Watermark text="谁人不识张公子" fontSize={18} opacity={0.04} rotate={-25} gap={250} />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回列表
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg p-8">
          {/* Title */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {guide.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full">
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
            className="markdown-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        </article>
      </main>
    </div>
  )
}
