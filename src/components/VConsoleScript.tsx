'use client'

import Script from 'next/script'

export default function VConsoleScript() {
  return (
    <Script 
      src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js" 
      strategy="lazyOnload"
      onLoad={() => {
        // @ts-ignore
        new window.VConsole()
      }}
    />
  )
}
