// 网站配置
export const siteConfig = {
  // GitHub Pages basePath - 用户站点不需要 basePath
  basePath: '',
  
  // 网站信息
  title: '华东导游词',
  description: '探索华东地区的历史文化与自然风光',
  author: '谁人不识张公子',
}

// 辅助函数：添加 basePath 前缀
export function withBasePath(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${siteConfig.basePath}${path}`
}
