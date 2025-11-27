import type { Metadata } from 'next'
import './globals.css'
import CopyProtection from '@/components/CopyProtection'
import VConsoleScript from '@/components/VConsoleScript'

export const metadata: Metadata = {
  title: '华东导游词 - 在线浏览平台',
  description: '华东地区旅游景点导游词在线浏览平台，包含杭州、苏州等地著名景点的详细导游词',
  icons: {
    icon: 'https://s3.bmp.ovh/imgs/2025/11/27/c09f0f0f73216b4f.png',
    apple: 'https://s3.bmp.ovh/imgs/2025/11/27/c09f0f0f73216b4f.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased select-none">
        <CopyProtection />
        {children}
        {/* vConsole 调试工具 - 延迟加载不影响性能 */}
        <VConsoleScript />
      </body>
    </html>
  )
}
