import type { Metadata } from 'next'
import './globals.css'
import CopyProtection from '@/components/CopyProtection'
import VConsoleInit from '@/components/VConsole'

export const metadata: Metadata = {
  title: '华东导游词 - 在线浏览平台',
  description: '华东地区旅游景点导游词在线浏览平台，包含杭州、苏州等地著名景点的详细导游词',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
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
        {/* vConsole 移动端调试工具 */}
        <VConsoleInit />
      </body>
    </html>
  )
}
