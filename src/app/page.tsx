'use client'

import { useState, useMemo } from 'react'
import { guideData } from '@/data/guides'
import CategoryNav from '@/components/CategoryNav'
import GuideCard from '@/components/GuideCard'
import GuideViewer from '@/components/GuideViewer'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = new Set<string>(['全部'])
    guideData.forEach(guide => cats.add(guide.category))
    return Array.from(cats)
  }, [])

  const filteredGuides = useMemo(() => {
    if (selectedCategory === '全部') {
      return guideData
    }
    return guideData.filter(guide => guide.category === selectedCategory)
  }, [selectedCategory])

  if (selectedGuide) {
    const guide = guideData.find(g => g.id === selectedGuide)
    return (
      <GuideViewer
        guide={guide!}
        onBack={() => setSelectedGuide(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              华东导游词
            </h1>
            <p className="text-gray-600">
              探索华东地区的历史文化与自然风光
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Guide Cards Grid */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedCategory === '全部' ? '所有导游词' : selectedCategory}
              <span className="ml-2 text-sm text-gray-500">
                ({filteredGuides.length} 篇)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onClick={() => setSelectedGuide(guide.id)}
              />
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">暂无导游词</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 华东导游词在线浏览平台
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
