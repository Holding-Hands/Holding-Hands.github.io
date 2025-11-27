interface CategoryNavProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  categoryCounts?: Record<string, number>
}

export default function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryNavProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-3 sm:p-4 transition-colors border border-gray-100 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 flex items-center gap-1.5 ${
              selectedCategory === category
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600'
            }`}
          >
            <span>{category}</span>
            {categoryCounts && categoryCounts[category] !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                selectedCategory === category
                  ? 'bg-blue-400/80'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {categoryCounts[category]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
