# 华东导游词在线浏览平台 🏛️

一个现代化的导游词在线浏览平台，展示华东地区（杭州、苏州、湖州等）的旅游景点和历史文化内容。

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/GuideWords/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/GuideWords/actions/workflows/deploy.yml)

## ✨ 特性

- 🎨 **现代化UI设计** - 使用 Next.js + TailwindCSS 打造的美观界面
- 📱 **响应式布局** - 完美适配桌面端、平板和移动设备
- 🗂️ **分类浏览** - 按景点类型、地区、人物等分类查看导游词
- 🔍 **快速导航** - 卡片式布局，一目了然
- 🚀 **自动化部署** - 通过 GitHub Actions 自动部署到 GitHub Pages
- 📖 **Markdown支持** - 导游词使用 Markdown 格式编写，易于维护

## 📂 内容分类

### 杭州景点
- 城隍阁 - 吴山之巅，俯瞰西湖全景
- 雷峰塔 - 白娘子传说的发源地
- 飞来峰 - 南方石窟艺术瑰宝
- 胡雪岩故居 - 晚清商业文化展示

### 苏州园林
- 拙政园 - 中国四大名园之一
- 狮子林 - 假山艺术的典范

### 湖州景点
- 小莲庄 - 清末私家园林
- 张石铭旧宅 - 中西合璧建筑群

### 历史人物
- 岳飞 - 精忠报国的民族英雄
- 苏轼的一生 - 北宋文化巨匠
- 宋徽宗的一生 - 艺术帝王的悲剧
- 张静江的一生 - 民国政治家

### 文化专题
- 佛教知识 - 佛教文化基础
- 北上北上 - 华东历史文化脉络

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
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
# 处理导游词文件
node scripts/process-guides.js

# 构建并导出静态文件
npm run build

# 静态文件将生成在 ./out 目录
```

## 📝 添加新的导游词

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

## 🌐 部署到 GitHub Pages

### 自动部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Update guides"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库的 Settings > Pages
   - Source 选择 "GitHub Actions"

3. **等待部署完成**
   - GitHub Actions 会自动构建和部署
   - 部署完成后访问 `https://YOUR_USERNAME.github.io/GuideWords/`

### 手动部署

```bash
# 构建项目
node scripts/process-guides.js
npm run build

# 部署 out 目录到 GitHub Pages
# 可以使用 gh-pages 或其他部署工具
```

## 🛠️ 技术栈

- **框架**: [Next.js 14](https://nextjs.org/) - React 框架
- **样式**: [TailwindCSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **Markdown 处理**: [Marked](https://marked.js.org/) - Markdown 解析器
- **部署**: [GitHub Pages](https://pages.github.com/) - 静态网站托管
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) - 自动化部署

## 📁 项目结构

```
GuideWords/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── scripts/
│   └── process-guides.js       # 导游词处理脚本
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 应用布局
│   │   ├── page.tsx            # 首页
│   │   └── globals.css         # 全局样式
│   ├── components/
│   │   ├── CategoryNav.tsx    # 分类导航组件
│   │   ├── GuideCard.tsx      # 导游词卡片组件
│   │   └── GuideViewer.tsx    # 导游词查看器组件
│   ├── data/
│   │   └── guides.ts           # 导游词数据（自动生成）
│   └── types/
│       └── guide.ts            # TypeScript 类型定义
├── *.md                        # 导游词 Markdown 文件
├── next.config.js              # Next.js 配置
├── tailwind.config.js          # TailwindCSS 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖
```

## 🎨 自定义配置

### 修改主题颜色

编辑 `tailwind.config.js` 中的颜色配置：

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

### 修改网站标题和描述

编辑 `src/app/layout.tsx` 中的 metadata：

```typescript
export const metadata: Metadata = {
  title: '你的网站标题',
  description: '你的网站描述',
}
```

### 修改基础路径

如果部署到非根路径，编辑 `next.config.js`：

```javascript
basePath: '/your-repo-name',
assetPrefix: '/your-repo-name/',
```

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

- 提交 [Issue](https://github.com/YOUR_USERNAME/GuideWords/issues)
- 发送邮件至：your.email@example.com

## 🙏 致谢

感谢所有为华东地区旅游文化传播做出贡献的导游和文化工作者。

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
