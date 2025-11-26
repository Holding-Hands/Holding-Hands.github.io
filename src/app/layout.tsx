import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '华东导游词 - 在线浏览平台',
  description: '华东地区旅游景点导游词在线浏览平台，包含杭州、苏州等地著名景点的详细导游词',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
