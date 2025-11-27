# PDF 文件上传到 GitHub Releases 指南

## 为什么需要上传到 Releases？

PDF 文件 `胡雪岩故居修复研究.pdf` 大小为 155MB，超过了 GitHub 仓库单文件 100MB 的限制。
使用 GitHub Releases 可以免费托管大文件。

## 上传步骤

### 1. 访问 Releases 页面

打开浏览器，访问：
```
https://github.com/Holding-Hands/Holding-Hands.github.io/releases
```

### 2. 创建新 Release

点击右上角的 **"Create a new release"** 按钮

### 3. 填写 Release 信息

- **Choose a tag**: 输入 `v1.0` 然后点击 "Create new tag: v1.0 on publish"
- **Release title**: 输入 `资源文件 v1.0`
- **Description**: 输入以下内容
  ```
  ## 参考资料文件
  
  包含以下 PDF 文件：
  - 胡雪岩故居修复研究 -- 高念华著 --北京_文物出版社.pdf (155MB)
  ```

### 4. 上传 PDF 文件

在 **"Attach binaries"** 区域：
1. 点击 "Attach binaries by dropping them here or selecting them"
2. 选择文件：`D:\study\GuideWords\public\resources\建筑研究\胡雪岩故居修复研究 -- 高念华著 --北京_文物出版社 .pdf`
3. 等待上传完成（155MB 可能需要几分钟）

**建议重命名文件为简单的英文名**，比如 `huxueyan-restoration.pdf`，避免中文和特殊字符。

### 5. 发布 Release

点击底部的 **"Publish release"** 按钮

### 6. 获取下载链接

发布后，你会看到上传的文件，右键点击文件名，选择 **"复制链接地址"**

链接格式类似：
```
https://github.com/Holding-Hands/Holding-Hands.github.io/releases/download/v1.0/huxueyan-restoration.pdf
```

### 7. 更新代码

打开 `src/app/resources/page.tsx` 文件，找到第 29 行，修改为：

```typescript
externalUrl: 'https://github.com/Holding-Hands/Holding-Hands.github.io/releases/download/v1.0/huxueyan-restoration.pdf'
```

取消注释（删除前面的 `//`）

### 8. 提交并推送

```bash
git add src/app/resources/page.tsx
git commit -m "Add external PDF link from GitHub Releases"
git push origin main
```

## 完成！

等待 GitHub Actions 部署完成后，访问网站测试 PDF 在线阅读功能。

---

## 注意事项

1. **文件命名建议**：使用英文字母、数字、连字符，避免中文和空格
2. **上传时间**：155MB 文件上传可能需要 2-5 分钟，请耐心等待
3. **下载速度**：GitHub Releases 在国内访问速度较快，无需担心

## 如果遇到问题

- 上传失败：检查网络连接，重试
- 链接 404：确认文件名和 tag 版本号是否正确
- 访问慢：GitHub 服务器在国外，可能偶尔较慢
