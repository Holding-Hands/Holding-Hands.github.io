# PDF 资源文件夹

## 📁 文件夹结构

```
resources/
├── 建筑研究/        # 建筑相关研究资料
├── 历史文献/        # 历史文献资料
├── 园林艺术/        # 园林艺术相关资料
└── 文化专题/        # 文化专题资料
```

## 📚 分类说明

- **建筑研究**：古建筑修复、建筑历史、建筑艺术等
- **历史文献**：历史人物、历史事件、历史研究等
- **园林艺术**：园林设计、园林文化、造园艺术等
- **文化专题**：佛教文化、民俗文化、地域文化等

## 🔧 添加 PDF 文件

### 步骤 1: 选择分类并复制文件

```bash
# Windows PowerShell
# 建筑研究类
Copy-Item "D:\path\to\your\file.pdf" "public\resources\建筑研究\filename.pdf"

# 历史文献类
Copy-Item "D:\path\to\your\file.pdf" "public\resources\历史文献\filename.pdf"

# 或者直接拖拽文件到对应分类文件夹
```

### 步骤 2: 更新资源列表

在 `src/app/resources/page.tsx` 中添加资源信息：

```typescript
const resources: Resource[] = [
  {
    id: 'unique-id',
    title: 'PDF 标题',
    description: 'PDF 描述',
    fileSize: '文件大小',
    category: '建筑研究', // 选择对应分类
    pdfUrl: '/resources/建筑研究/filename.pdf', // 包含分类路径
  },
]
```

## ⚠️ 重要提示

### 文件大小限制

- **GitHub Pages**: 单个文件不超过 100MB
- **Git 仓库**: 建议单个文件不超过 50MB
- **大文件处理**: 使用云存储（阿里云 OSS、腾讯云 COS 等）

### 当前文件

- `huxueyan.pdf` - 胡雪岩故居修复研究 (163 MB)
  - ⚠️ 此文件过大，已在 .gitignore 中排除
  - 建议使用云存储链接替代

## 🌐 使用云存储（推荐）

对于大文件，建议使用云存储：

1. 上传 PDF 到云存储
2. 获取公开访问链接
3. 在代码中使用 `externalUrl`：

```typescript
{
  id: 'huxueyan-restoration',
  title: '胡雪岩故居修复研究',
  pdfUrl: '', // 留空
  externalUrl: 'https://your-cdn.com/huxueyan.pdf', // 使用云存储链接
}
```

## 📱 移动端支持

PDF 查看器已支持：
- ✅ PC 端：浏览器内置查看器
- ✅ 移动端：Google Docs Viewer
- ✅ 下载功能
- ✅ 新窗口打开

## 🔗 访问方式

- 在线阅读：`http://localhost:3000/resources`
- 直接访问：`http://localhost:3000/resources/filename.pdf`
