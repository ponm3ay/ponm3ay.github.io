# 部署指南 / DEPLOY

## 当前部署（已完成）

- **仓库**: https://github.com/ponm3ay/ponm3ay.github.io（用户主站仓库）
- **线上地址**: https://ponm3ay.github.io
- **方式**: GitHub Pages · Deploy from branch · `main` / 根目录

## 更新内容

```bash
cd 本仓库
git add -A
git commit -m "update content"
git push
```

push 后约 1-2 分钟自动上线。

## 用管理后台修改内容后的发布流程

1. 页面底部 ◆ ADMIN → 输入令牌 → 编辑
2. 「保存到本浏览器」→ 本机立即生效（预览用）
3. 「导出 content.json」→ 把下载的文件放到仓库根目录
4. `git add content.json && git commit -m "content update" && git push`
5. 约 1-2 分钟后全网生效

> 内容优先级：`content.js 默认值` < `content.json（仓库）` < `localStorage（本浏览器）`
> 所以导出并提交后，记得在其他设备上不要有旧的本机覆盖（或点「恢复默认」清掉）。

## 其他可选部署方案（备查）

| 方案 | 特点 | 命令/步骤 |
|---|---|---|
| Vercel | 国内访问较稳、自动 HTTPS | 导入 GitHub 仓库，框架选 Other，根目录即可 |
| Netlify | 拖拽即可发 | `netlify deploy --prod --dir .` |
| Cloudflare Pages | 免费额度大 | 连接仓库，构建命令留空，输出目录 `/` |

本站是纯静态单页（无构建步骤），任何静态托管都能直接用。

## 本地 QA 环境（开发者用）

```
_qa/server.js     node 静态服务器 (127.0.0.1:8321)
_qa/shot.js       截图（sweep/boot 模式），需本机 Edge + 调试端口 9222
_qa/interact.js   管理后台/交互回归测试（10 项）
_qa/widths.js     七档宽度溢出检测
_qa/crop.js       组件特写截图
```

启动：常驻 `msedge --headless=new --remote-debugging-port=9222 --user-data-dir=<tmp>`，
然后 `node _qa/server.js` + `node _qa/shot.js <round> sweep`。
