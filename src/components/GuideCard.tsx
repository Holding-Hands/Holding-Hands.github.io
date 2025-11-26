import { Guide } from '@/types/guide'

interface GuideCardProps {
  guide: Guide
  onClick: () => void
}

export default function GuideCard({ guide, onClick }: GuideCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {guide.title}
          </h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap ml-2">
            {guide.category}
          </span>
        </div>
        
        {guide.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {guide.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
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
          <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-block">
            阅读 →
          </span>
        </div>
      </div>
    </div>
  )
}
