# 部署指南 📦

本文档详细说明如何将华东导游词平台部署到 GitHub Pages。

## 🚀 自动部署（推荐）

### 步骤 1: 准备 GitHub 仓库

1. **创建 GitHub 仓库**
   - 登录 GitHub
   - 点击右上角 "+" > "New repository"
   - 仓库名称：`GuideWords`（或其他名称）
   - 设置为 Public（GitHub Pages 免费版需要公开仓库）
   - 不要初始化 README（我们已经有了）

2. **连接本地仓库到 GitHub**
   ```bash
   cd d:\study\GuideWords
   git init
   git add .
   git commit -m "Initial commit: 华东导游词平台"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/GuideWords.git
   git push -u origin main
   ```

### 步骤 2: 配置 GitHub Pages

1. **进入仓库设置**
   - 打开你的 GitHub 仓库
   - 点击 "Settings" 标签
   - 在左侧菜单找到 "Pages"

2. **配置部署源**
   - Source: 选择 "GitHub Actions"
   - 保存设置

### 步骤 3: 触发部署

1. **推送代码触发自动部署**
   ```bash
   git push origin main
   ```

2. **查看部署进度**
   - 进入仓库的 "Actions" 标签
   - 查看 "Deploy to GitHub Pages" 工作流
   - 等待构建完成（通常需要 2-5 分钟）

3. **访问网站**
   - 部署成功后，访问：`https://YOUR_USERNAME.github.io/GuideWords/`

## 🔧 手动部署

如果你想手动构建和部署：

### 方法 1: 使用 gh-pages 包

1. **安装 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **添加部署脚本**
   在 `package.json` 中添加：
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d out"
   }
   ```

3. **执行部署**
   ```bash
   npm run deploy
   ```

### 方法 2: 手动上传

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传 out 目录**
   - 将 `out` 目录的内容上传到 GitHub 仓库的 `gh-pages` 分支
   - 或使用其他静态网站托管服务（Netlify、Vercel 等）

## 🛠️ 配置说明

### 修改仓库名称

如果你的仓库名不是 `GuideWords`，需要修改 `next.config.js`：

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '',
}
```

### 自定义域名

1. **在 GitHub Pages 设置中添加自定义域名**
   - Settings > Pages > Custom domain
   - 输入你的域名（例如：`guides.example.com`）

2. **在 DNS 提供商处配置**
   - 添加 CNAME 记录指向 `YOUR_USERNAME.github.io`

3. **修改 next.config.js**
   ```javascript
   basePath: '',  // 使用自定义域名时清空 basePath
   assetPrefix: '',
   ```

4. **添加 CNAME 文件**
   在 `public` 目录创建 `CNAME` 文件：
   ```
   guides.example.com
   ```

## 🔍 故障排除

### 问题 1: 页面显示 404

**原因**: basePath 配置不正确

**解决方案**:
- 检查 `next.config.js` 中的 `basePath` 是否与仓库名一致
- 确保访问的 URL 包含仓库名：`https://username.github.io/GuideWords/`

### 问题 2: 样式丢失

**原因**: 静态资源路径不正确

**解决方案**:
- 确保 `assetPrefix` 配置正确
- 检查 `public/.nojekyll` 文件是否存在

### 问题 3: GitHub Actions 构建失败

**原因**: 依赖安装或构建错误

**解决方案**:
1. 查看 Actions 日志找到具体错误
2. 本地运行 `npm run build` 测试
3. 确保 `package.json` 中的依赖版本正确

### 问题 4: 导游词内容未显示

**原因**: Markdown 文件未正确处理

**解决方案**:
1. 检查 `scripts/process-guides.js` 是否正确执行
2. 确认 Markdown 文件在项目根目录
3. 本地运行 `node scripts/process-guides.js` 测试

## 📊 部署检查清单

部署前请确认：

- [ ] 所有 Markdown 文件已添加到项目
- [ ] `scripts/process-guides.js` 中包含所有导游词的元数据
- [ ] `next.config.js` 中的 basePath 配置正确
- [ ] `.gitignore` 文件配置正确
- [ ] GitHub Actions 工作流文件存在
- [ ] 本地构建成功 (`npm run build`)
- [ ] GitHub Pages 设置为 "GitHub Actions"

## 🔄 更新内容

当你添加或修改导游词后：

1. **提交更改**
   ```bash
   git add .
   git commit -m "更新导游词内容"
   git push origin main
   ```

2. **自动部署**
   - GitHub Actions 会自动检测到推送
   - 自动构建并部署新版本
   - 通常 2-5 分钟后生效

## 📈 性能优化

### 启用缓存

GitHub Actions 已配置 npm 缓存，加快构建速度。

### 图片优化

如果添加图片：
1. 使用 WebP 格式
2. 压缩图片大小
3. 放在 `public/images` 目录

### CDN 加速

考虑使用 CDN 服务：
- Cloudflare Pages
- Netlify
- Vercel

这些服务提供更快的全球访问速度。

## 🆘 获取帮助

如遇到问题：

1. 查看 [GitHub Actions 日志](https://github.com/YOUR_USERNAME/GuideWords/actions)
2. 检查 [GitHub Pages 文档](https://docs.github.com/en/pages)
3. 提交 [Issue](https://github.com/YOUR_USERNAME/GuideWords/issues)

---

祝部署顺利！🎉
