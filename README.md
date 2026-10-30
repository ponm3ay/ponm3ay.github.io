# PONM3AY // PERSONAL ARCHIVE

明日方舟风格个人展示站（单页 / 零依赖 / 纯静态），参考 [mer3y.xyz](https://mer3y.xyz/) 与[明日方舟官网](https://ak.hypergryph.com/)的设计语言。

- 干员档案（Profile）· 作战记录（Projects）· 行动日志（Timeline）· 建立连接（Connect）
- 自托管字体（Chakra Petch, OFL），无任何外部 CDN 请求
- 内置**管理后台**：页面底部 `◆ ADMIN` 进入，令牌校验后可在线编辑全部内容

## 快速开始

```bash
# 本地预览（任选其一）
npx serve .            # 或
python -m http.server  # 或直接双击 index.html（管理后台也可用）
```

## 管理后台

1. 拉到页面最底部，点击 **◆ ADMIN**
2. 输入管理员令牌（站长保管，源码中只有其 SHA-256 摘要）
3. 编辑内容 → **保存到本浏览器**：立即生效，但仅本机可见
4. **导出 content.json**：把导出的文件放到站点根目录并提交到仓库，改动即对全网生效

### 头像上传

- 档案区有独立的**干员肖像板块**：解锁 ADMIN 后，悬停肖像点「▲ 上传图像」直接从本地选图（自动等比压缩至 640px、JPEG 86%，约几十 KB）
- 也可在管理后台「身份」区上传/预览/移除
- 上传仅存本浏览器；随「导出 content.json」提交仓库后全网生效
- 访客视图自动隐藏所有 [待编辑] 占位与管理控件（解锁后才显示）

> 内容覆盖优先级：`content.js 默认值` < `content.json（仓库）` < `localStorage（本浏览器）`

## 目录结构

```
index.html              页面骨架
assets/css/main.css     全部样式（设计令牌集中在 :root）
assets/js/content.js    默认内容 + 管理令牌摘要
assets/js/app.js        渲染管线 / 动效 / 交互
assets/js/admin.js      管理后台
assets/fonts/           自托管 Chakra Petch（OFL 许可）
assets/img/avatar.svg   默认头像（可在后台填 GitHub 头像 URL 替换）
content.json            （可选）后台导出的内容覆盖层
```

## 部署

见 [DEPLOY.md](DEPLOY.md)（GitHub Pages 全流程）。
