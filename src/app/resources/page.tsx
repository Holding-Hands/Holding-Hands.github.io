'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import PDFViewer from '@/components/PDFViewer'
import MarkdownViewer from '@/components/MarkdownViewer'
import DocViewer from '@/components/DocViewer'
import Watermark from '@/components/Watermark'
import { withBasePath } from '@/config/site'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { resources, type Resource } from '@/data/resources'

function ResourcesPageContent() {
  const [selectedPdf, setSelectedPdf] = useState<Resource | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('全部')
  const [selectedThirdCategory, setSelectedThirdCategory] = useState<string>('全部')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [scrollPosition, setScrollPosition] = useState<number>(0)

  // 获取所有主分类
  const categories = useMemo(() => {
    const cats = new Set<string>(['全部'])
    resources.forEach(resource => cats.add(resource.category))
    return Array.from(cats)
  }, [])

  // 获取当前主分类下的子分类
  const subCategories = useMemo(() => {
    if (selectedCategory === '全部') return ['全部']
    const subCats = new Set<string>(['全部'])
    resources
      .filter(r => r.category === selectedCategory)
      .forEach(resource => {
        if (resource.subCategory) {
          subCats.add(resource.subCategory)
        }
      })
    return Array.from(subCats)
  }, [selectedCategory])

  // 获取当前子分类下的三级分类
  const thirdCategories = useMemo(() => {
    if (selectedCategory === '全部' || selectedSubCategory === '全部') return ['全部']
    const thirdCats = new Set<string>(['全部'])
    resources
      .filter(r => r.category === selectedCategory && r.subCategory === selectedSubCategory)
      .forEach(resource => {
        if (resource.thirdCategory) {
          thirdCats.add(resource.thirdCategory)
        }
      })
    return Array.from(thirdCats)
  }, [selectedCategory, selectedSubCategory])

  // 当主分类改变时，重置子分类和三级分类
  useMemo(() => {
    setSelectedSubCategory('全部')
    setSelectedThirdCategory('全部')
  }, [selectedCategory])

  // 当子分类改变时，重置三级分类
  useMemo(() => {
    setSelectedThirdCategory('全部')
  }, [selectedSubCategory])

  // 筛选资源
  const filteredResources = useMemo(() => {
    let filtered = resources

    // 按主分类筛选
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(r => r.category === selectedCategory)
    }

    // 按子分类筛选
    if (selectedSubCategory !== '全部') {
      filtered = filtered.filter(r => r.subCategory === selectedSubCategory)
    }

    // 按三级分类筛选
    if (selectedThirdCategory !== '全部') {
      filtered = filtered.filter(r => r.thirdCategory === selectedThirdCategory)
    }

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        (r.subCategory && r.subCategory.toLowerCase().includes(query)) ||
        (r.thirdCategory && r.thirdCategory.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [selectedCategory, selectedSubCategory, selectedThirdCategory, searchQuery])

  // 按子分类或三级分类分组资源
  const groupedResources = useMemo(() => {
    // 如果选择了具体的子分类或三级分类，不分组
    if (selectedCategory === '全部' || selectedSubCategory !== '全部') {
      return { '全部': filteredResources }
    }

    // 按子分类分组
    const grouped: Record<string, Resource[]> = {}
    filteredResources.forEach(resource => {
      const subCat = resource.subCategory || '其他'
      if (!grouped[subCat]) {
        grouped[subCat] = []
      }
      grouped[subCat].push(resource)
    })
    return grouped
  }, [filteredResources, selectedCategory, selectedSubCategory])

  // 保存滚动位置
  const handleOpenPdf = (resource: Resource) => {
    setScrollPosition(window.scrollY)
    setSelectedPdf(resource)
  }

  // 恢复滚动位置
  const handleBack = () => {
    setSelectedPdf(null)
    // 使用 setTimeout 确保 DOM 更新后再滚动
    setTimeout(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      })
    }, 0)
  }

  if (selectedPdf) {
    const fileUrl = selectedPdf.externalUrl || withBasePath(selectedPdf.pdfUrl)
    const isMd = selectedPdf.pdfUrl.endsWith('.md')
    const isDoc = selectedPdf.pdfUrl.endsWith('.docx') || selectedPdf.pdfUrl.endsWith('.doc')
    
    if (isMd) {
      return (
        <MarkdownViewer
          mdUrl={fileUrl}
          title={selectedPdf.title}
          onBack={handleBack}
        />
      )
    }
    
    if (isDoc) {
      return (
        <DocViewer
          docUrl={fileUrl}
          title={selectedPdf.title}
          onBack={handleBack}
        />
      )
    }
    
    return (
      <PDFViewer
        pdfUrl={fileUrl}
        title={selectedPdf.title}
        fileSize={selectedPdf.fileSize}
        onBack={handleBack}
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
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="搜索资料标题、描述或分类..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {category}
                {category !== '全部' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({resources.filter(r => r.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Category Filter */}
        {subCategories.length > 1 && (
          <div className="mb-4 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {subCategories.map(subCategory => (
                <button
                  key={subCategory}
                  onClick={() => setSelectedSubCategory(subCategory)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    selectedSubCategory === subCategory
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {subCategory}
                  {subCategory !== '全部' && (
                    <span className="ml-1.5 text-xs opacity-75">
                      ({resources.filter(r => r.category === selectedCategory && r.subCategory === subCategory).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Third Category Filter */}
        {thirdCategories.length > 1 && (
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {thirdCategories.map(thirdCategory => (
                <button
                  key={thirdCategory}
                  onClick={() => setSelectedThirdCategory(thirdCategory)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    selectedThirdCategory === thirdCategory
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {thirdCategory}
                  {thirdCategory !== '全部' && (
                    <span className="ml-1.5 text-xs opacity-75">
                      ({resources.filter(r => r.category === selectedCategory && r.subCategory === selectedSubCategory && r.thirdCategory === thirdCategory).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {searchQuery ? (
              <>找到 <span className="font-semibold text-gray-900 dark:text-white">{filteredResources.length}</span> 个结果</>
            ) : (
              <>共 <span className="font-semibold text-gray-900 dark:text-white">{filteredResources.length}</span> 个资料</>
            )}
          </p>
        </div>

        {Object.entries(groupedResources).map(([subCat, resourceList]) => (
          <div key={subCat} className="mb-10">
            {selectedCategory !== '全部' && selectedSubCategory === '全部' && subCat !== '全部' && (
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                {subCat}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({resourceList.length})
                </span>
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceList.map(resource => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 hover:shadow-2xl dark:hover:shadow-gray-900/80 transition-all duration-300 overflow-hidden group relative transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-cyan-50/0 dark:from-blue-900/0 dark:to-cyan-900/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 dark:group-hover:from-blue-900/20 dark:group-hover:to-cyan-900/20 transition-all duration-300 pointer-events-none" />
              
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {resource.pdfUrl.endsWith('.pdf') ? (
                      <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{resource.fileSize}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full whitespace-nowrap">
                      {resource.category}
                    </span>
                    {resource.subCategory && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full whitespace-nowrap">
                        {resource.subCategory}
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenPdf(resource)}
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
          </div>
        ))}

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery ? '未找到相关资料，试试其他关键词' : '暂无参考资料'}
            </p>
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
