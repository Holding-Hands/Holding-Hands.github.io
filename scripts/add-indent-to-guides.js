#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('📝 为导游词添加首行缩进...\n')

// 导游词文件路径
const guidesDir = path.join(__dirname, '..', 'public', 'guides')

// 递归处理所有 .md 文件
function processDirectory(dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      processDirectory(filePath)
    } else if (file.endsWith('.md')) {
      processMarkdownFile(filePath)
    }
  })
}

function processMarkdownFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    let modified = false
    
    // 分割成行
    const lines = content.split('\n')
    const newLines = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // 跳过空行、标题、列表等
      if (trimmedLine === '' || 
          trimmedLine.startsWith('#') || 
          trimmedLine.startsWith('-') || 
          trimmedLine.startsWith('*') || 
          trimmedLine.startsWith('>') ||
          trimmedLine.startsWith('```') ||
          trimmedLine.startsWith('|')) {
        newLines.push(line)
        continue
      }
      
      // 如果是段落开头（前一行是空行或标题），且没有缩进
      const prevLine = i > 0 ? lines[i - 1].trim() : ''
      const isNewParagraph = prevLine === '' || prevLine.startsWith('#')
      
      if (isNewParagraph && trimmedLine.length > 0 && !line.startsWith('　')) {
        newLines.push('　　' + trimmedLine)  // 使用两个全角空格（中文空格）
        modified = true
      } else {
        newLines.push(line)
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8')
      console.log(`✅ 已处理: ${path.relative(process.cwd(), filePath)}`)
    } else {
      console.log(`ℹ️  无需修改: ${path.relative(process.cwd(), filePath)}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败 ${filePath}:`, error.message)
  }
}

// 开始处理
if (fs.existsSync(guidesDir)) {
  processDirectory(guidesDir)
  console.log('\n✨ 处理完成！')
} else {
  console.error('❌ 找不到 guides 目录:', guidesDir)
}
