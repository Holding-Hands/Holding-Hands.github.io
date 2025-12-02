import { MetadataRoute } from 'next'
import { resources } from '@/data/resources'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://holding-hands.github.io'

  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/debug`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // 资源详情页
  const resourcePages = resources.map((resource) => ({
    url: `${baseUrl}/resources/${resource.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...resourcePages]
}
