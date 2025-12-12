# 华东导游词在线浏览平台 🏛️

一个现代化的导游词和学习资料在线浏览平台，展示华东地区（杭州、苏州、湖州等）的旅游景点、历史文化内容，以及导游考试学习资料。

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/GuideWords/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/GuideWords/actions/workflows/deploy.yml)

## ✨ 特性

- 🎨 **现代化UI设计** - 使用 Next.js + TailwindCSS 打造的美观界面
- 📱 **响应式布局** - 完美适配桌面端、平板和移动设备
- 🗂️ **多级分类系统** - 支持主分类、子分类、三级分类的层级浏览
- 🔍 **智能搜索** - 实时搜索标题、描述、分类内容
- 📖 **多格式支持** - 支持 Markdown、PDF、Word 文档在线预览
- 🌓 **深色模式** - 自动适配系统主题，保护眼睛
- 🚀 **自动化部署** - 通过 GitHub Actions 自动部署到 GitHub Pages
- 💧 **水印保护** - 自动添加水印保护内容版权

## 📂 内容分类

### 导游词内容

#### 杭州景点
- 城隍阁 - 吴山之巅，俯瞰西湖全景
- 雷峰塔 - 白娘子传说的发源地
- 飞来峰 - 南方石窟艺术瑰宝
- 胡雪岩故居 - 晚清商业文化展示

#### 苏州园林
- 拙政园 - 中国四大名园之一
- 狮子林 - 假山艺术的典范

#### 湖州景点
- 小莲庄 - 清末私家园林
- 张石铭旧宅 - 中西合璧建筑群

#### 历史人物
- 岳飞 - 精忠报国的民族英雄
- 苏轼的一生 - 北宋文化巨匠
- 宋徽宗的一生 - 艺术帝王的悲剧
- 张静江的一生 - 民国政治家

#### 文化专题
- 佛教知识 - 佛教文化基础
- 北上北上 - 华东历史文化脉络

### 学习资料（22个）

#### 导游面试资料（18个）
- **浙江中文导游词**（14个）- Markdown格式，快速加载
  - 浙江省省情、杭州概况
  - 西湖、良渚古城遗址
  - 天一阁、雁荡山、南湖旅游区
  - 南浔古镇、莫干山
  - 横店影视城、江郎山
  - 普陀山、天台山、仙都景区

- **考纲资料**（4个）- PDF格式
  - 考试大纲
  - 浙江230问
  - 浙江导游考试资料（上、下）

- **押题卷** - 101系列（11个）+ 雷大大系列（24个）
  - 科目一科目二题目与解析
  - 科目三科目四题目与解析
  - 景点讲解专项练习

#### 技术书籍（4个）
- **前端开发**（3个）
  - JavaScript高级程序设计第4版
  - Vue.js设计与实现
  - CSS核心技术详解

- **软件工程**（1个）
  - 代码大全

## 🚀 快速开始

### 前置要求

- Node.js 18.0 或更高版本
- npm 或 yarn

### 本地开发

1. **克隆仓库**
```bash
git clone https://github.com/YOUR_USERNAME/GuideWords.git
cd GuideWords
```

2. **安装依赖**
```bash
npm install
```

3. **处理导游词文件**
```bash
node scripts/process-guides.js
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
- 首页：http://localhost:3000
- 资源页面：http://localhost:3000/resources

### 构建生产版本

```bash
# 处理导游词文件
node scripts/process-guides.js

# 构建并导出静态文件
npm run build

# 静态文件将生成在 ./out 目录
```

## 📝 内容管理

### 添加新的导游词

1. **创建 Markdown 文件**
   在项目根目录创建新的 `.md` 文件，例如 `新景点.md`

2. **编写内容**
   使用 Markdown 格式编写导游词内容

3. **更新配置**
   在 `scripts/process-guides.js` 中添加新的导游词元数据：
   ```javascript
   {
     id: 'xinjingdian',
     fileName: '新景点.md',
     title: '新景点',
     category: '杭州景点',
     location: '杭州',
     description: '景点简介'
   }
   ```

4. **重新构建**
   ```bash
   node scripts/process-guides.js
   npm run dev
   ```

### 添加学习资料

在 `src/data/resources.ts` 中添加新资源：

```typescript
{
  id: 'unique-id',
  title: '资料标题',
  description: '资料描述',
  fileSize: '文件大小',
  category: '主分类',
  subCategory: '子分类',
  thirdCategory: '三级分类', // 可选
  pdfUrl: '/resources/path/to/file.pdf',
  externalUrl: 'https://...' // 可选，用于外部链接
}
```

### Word 文档转 Markdown

使用提供的转换脚本：

```bash
node scripts/convert-docx-to-md.js
```

脚本会自动将 Word 文档转换为 Markdown 格式，便于在线阅读。

## 🌐 部署到 GitHub Pages

### 自动部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库的 Settings > Pages
   - Source 选择 "GitHub Actions"

3. **等待部署完成**
   - GitHub Actions 会自动构建和部署
   - 部署完成后访问 `https://YOUR_USERNAME.github.io/GuideWords/`

### 大文件处理

对于超过 100MB 的文件，使用 GitHub Releases：

1. 创建新 Release（如 v1.0）
2. 上传大文件到 Release
3. 获取下载链接
4. 在 `resources.ts` 中使用 `externalUrl` 字段

详见 `UPLOAD_PDF_GUIDE.md`

## 🛠️ 技术栈

- **框架**: [Next.js 14](https://nextjs.org/) - React 框架
- **语言**: [TypeScript](https://www.typescriptlang.org/) - 类型安全
- **样式**: [TailwindCSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **Markdown**: [Marked](https://marked.js.org/) - Markdown 解析器
- **文档转换**: [Mammoth](https://github.com/mwilliamson/mammoth.js) - Word 转 Markdown
- **部署**: [GitHub Pages](https://pages.github.com/) - 静态网站托管
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) - 自动化部署

## 📁 项目结构

```
GuideWords/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions 部署配置
├── scripts/
│   ├── process-guides.js           # 导游词处理脚本
│   ├── convert-docx-to-md.js       # Word转Markdown脚本
│   └── dev-server.js               # 开发服务器
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 应用布局
│   │   ├── page.tsx                # 首页
│   │   ├── resources/
│   │   │   └── page.tsx            # 资源页面
│   │   └── globals.css             # 全局样式
│   ├── components/
│   │   ├── CategoryNav.tsx         # 分类导航组件
│   │   ├── GuideCard.tsx           # 导游词卡片组件
│   │   ├── GuideViewer.tsx         # 导游词查看器
│   │   ├── PDFViewer.tsx           # PDF查看器
│   │   ├── DocViewer.tsx           # Word文档查看器
│   │   ├── MarkdownViewer.tsx      # Markdown查看器
│   │   ├── Watermark.tsx           # 水印组件
│   │   └── VConsoleScript.tsx      # 移动端调试工具
│   ├── contexts/
│   │   └── ThemeContext.tsx        # 主题上下文
│   ├── data/
│   │   ├── guides.ts               # 导游词数据（自动生成）
│   │   └── resources.ts            # 学习资料数据
│   ├── types/
│   │   └── guide.ts                # TypeScript 类型定义
│   └── config/
│       └── site.ts                 # 网站配置
├── public/
│   ├── resources/                  # 学习资料文件
│   │   ├── 浙江导游面试讲解词-md/
│   │   ├── 押题卷/
│   │   │   ├── 101/
│   │   │   └── 雷大大/
│   │   └── 技术书籍/
│   └── .nojekyll                   # GitHub Pages 配置
├── *.md                            # 导游词 Markdown 文件
├── next.config.js                  # Next.js 配置
├── tailwind.config.js              # TailwindCSS 配置
├── tsconfig.json                   # TypeScript 配置
└── package.json                    # 项目依赖
```

## 🎨 功能特性

### 多级分类系统
- **主分类**：导游面试资料、技术书籍
- **子分类**：浙江中文导游词、押题卷、前端开发等
- **三级分类**：101系列、雷大大系列（押题卷专用）

### 智能搜索
- 实时搜索标题、描述、分类
- 搜索结果高亮显示
- 显示搜索结果数量

### 文档预览
- **Markdown**：自定义渲染器，优雅排版
- **PDF**：浏览器内置查看器
- **Word**：Microsoft Office Online Viewer

### 响应式设计
- 桌面端：多列网格布局
- 平板：两列布局
- 移动端：单列布局
- 横向滚动分类标签

### 深色模式
- 自动检测系统主题
- 手动切换深色/浅色模式
- 所有组件完美适配

### 水印保护
- 自动添加水印
- 可自定义文字、透明度、角度
- 不影响阅读体验

## 🔧 自定义配置

### 修改主题颜色

编辑 `tailwind.config.js`：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义主题色
      },
    },
  },
}
```

### 修改网站信息

编辑 `src/app/layout.tsx`：

```typescript
export const metadata: Metadata = {
  title: '你的网站标题',
  description: '你的网站描述',
}
```

### 修改基础路径

编辑 `next.config.js`：

```javascript
basePath: '/your-repo-name',
assetPrefix: '/your-repo-name/',
```

### 修改水印

编辑 `src/components/Watermark.tsx` 或在使用时传入参数：

```tsx
<Watermark 
  text="你的水印文字" 
  fontSize={18} 
  opacity={0.04} 
  rotate={-25} 
  gap={250} 
/>
```

## 📊 资源统计

- **导游词**：14个景点
- **学习资料**：22个文件
  - 浙江中文导游词：14个（Markdown）
  - 考纲资料：4个（PDF）
  - 押题卷：35个（101系列11个 + 雷大大系列24个）
  - 技术书籍：4个（PDF）
- **支持格式**：Markdown、PDF、Word
- **总大小**：约 500MB

## ⚠️ 注意事项

### 文件大小限制
- GitHub 单文件限制：100MB
- 超过限制的文件请使用 GitHub Releases
- 或使用云存储服务（阿里云OSS、腾讯云COS等）

### 版权声明
- 确保有权分享所有资料
- 尊重原作者版权
- 仅供学习交流使用

### 性能优化
- Markdown 文件比 Word 文档小 74%
- 建议将 Word 文档转换为 Markdown
- 大文件使用外部链接

## 🐛 故障排除

### 页面显示 404
- 检查 `basePath` 配置是否正确
- 确保访问 URL 包含仓库名

### 样式丢失
- 确保 `assetPrefix` 配置正确
- 检查 `public/.nojekyll` 文件是否存在

### 构建失败
- 查看 Actions 日志
- 本地运行 `npm run build` 测试
- 检查依赖版本

### Word 文档无法预览
- Microsoft Office Viewer 需要公网访问
- 本地开发环境可能无法预览
- 建议转换为 Markdown 格式

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/Holding-Hands/GuideWords/issues)
- 作者：谁人不识张公子

## 🙏 致谢

感谢所有为华东地区旅游文化传播和导游考试资料整理做出贡献的人们。

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

**作者：谁人不识张公子**
