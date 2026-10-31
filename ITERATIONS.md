# 视觉迭代记录（≥20 轮）

每轮：截图（桌面首屏 / 桌面全页 / 移动全页）→ 挑刺 → 修复 → 复检。
QA 环境：本机 Edge 156 无头（127.0.0.1:9222 常驻）+ node 静态服务器（127.0.0.1:8321）。

## Round 01
**截图**: r01-desktop-top / r01-desktop-full / r01-mobile-full
**挑刺**:
1. [BUG] hero-sub 嵌套 data-c 被 textContent 整体覆盖，职业标签（AI TOOLS / AUTOMATION / CV）丢失，只剩 "gugu"。
2. [布局] 移动端 sec-title 中文标题断行（"干员档/案"、"作战记/录"），中英并排 flex 未做 nowrap。
3. [视觉] 作战记录轮播右缘卡片被硬切，缺少边缘渐隐提示"可滑动"。
4. [核实] 4×404 全部为 content.json 可选覆盖层探测（4 次页面加载 × 1），符合设计，非缺陷。
**修复**: 见 Round 02 复检。

## Round 02
**复检**: hero-sub 修复生效（gugu · AI TOOLS / AUTOMATION / CV 完整显示）；移动端 sec-title 不再断行。
**新挑刺**:
1. [视觉] 作战记录轮播右缘卡片硬切（同 R1-3，待渐隐）。
2. [视觉] hero 左栏 CTA 下方留白偏大，视觉重心偏上。
3. [排查] CTA 下方疑似伪影 → Round 03 放大检查。

## Round 03（交互测试轮）
**交互测试（puppeteer + Edge CDP）**: 管理后台 10 项全通过：开模态/错误令牌拒绝/正确令牌解锁/编辑保存/页面反映编辑/恢复默认/轮播按钮/复制 toast/移动端汉堡菜单/导出下载。
**挑刺**:
1. [BUG·严重] 管理后台两个步骤同时渲染 —— `.admin-step` 的 display:flex 覆盖了 `[hidden]` 的 UA 样式。
2. [排查] CTA 放大图干净，之前判断为背景网格纹理，非缺陷。
**修复**: `.admin-step[hidden]{display:none!important}`。

## Round 04（复检轮）
**复检**: 管理后台只显示当前步骤，表单布局干净（双列字段、分区面板、底部操作栏）；开机序列终端行 + 进度条 + SKIP 达到预期方舟风格；10 项交互回归全绿。

## Round 05
**改动**: hero 新增 MAIL/GITHUB 快速链接行（与 connect 数据联动），填补左栏空缺。
**复检**: 全页轮播右缘渐隐生效；时间线 [待编辑] 条目带 DRAFT 章清晰提示可编辑；移动端整体良好。
**挑刺**:
1. [视觉] 时间线左侧轨道线在 30% 处淡出，最后几条目脱离轨道感。

## Round 06（组件特写轮）
**特写检查**: stats / op-card / log-item / mail-card / footer / status-card / modules。
**结论**: op-card 层级清晰（编号/状态章/标题/描述/标签/元信息）；mail-card 的 COPY 按钮与箭头布局合理；footer 品牌区 + ADMIN 入口规范；status-card 菱形核心 + 刻度 + 青色扫描线符合方舟 HUD 语言。
**修复**: 时间线轨道改为渐变延伸至底部。

## Round 07（响应式全宽扫描轮）
**方法**: 1920/1440/1280/1024/768/640/480 七档宽度截图 + 横向溢出自动检测。
**结果**: 全部宽度 scrollW == clientW，无横向溢出，无 JS 报错。

## Round 08
**挑刺**:
1. [布局] 1024px 下 avatar-card 被 `flex:1 1 260px` 拉伸出大片空白。
**修复**: `.avatar-card{flex:0 0 auto}`，status-card 吃满剩余宽度。复检通过；op-card 悬停态（描边变黄 + 上浮 5px）正常。

## Round 09（可达性 + 数据链路轮）
**结果**: Tab 焦点链合理（logo → 5 导航 → 2 CTA → 快速链接 → 轮播按钮）；Esc 正确关闭管理台。
**挑刺**:
1. [BUG·严重] content.json 覆盖不生效 —— loadOverrides 合并结果未同步回 window.P3App.content，renderAll 又从旧引用读回。
**修复**: step2 内 `window.P3App.content = C`。另发现测试脚本自身路径写错（D:/zcode ≠ D:/.zcode）导致的假阴性。

## Round 10（复检轮）
**结果**: 覆盖链路三连测 PASS —— content.json 覆盖默认值 ✓、localStorage 优先于 content.json ✓、清除后恢复默认 ✓。

## Round 11（压力测试轮）
**方法**: admin 管线注入 500 字符无空格 bio、30 模块、20 项目（每条 300 字符 desc）、15 条日志、超长 ticker + 坏头像 URL。
**挑刺**:
1. [BUG] 无空格长词把文档横向撑到 3579px（overflow-wrap 缺失）。
2. 坏头像 URL 自动回退 avatar.svg ✓。
**修复**: bio-text / op-desc / log-text 加 `overflow-wrap:anywhere`。复测溢出 0px PASS。

## Round 12（调色板一致性审计轮）
**方法**: 脚本遍历 main/footer/nav 全部元素计算样式，比对设计令牌。
**结果**: 全部颜色均来自 :root 令牌（审计初报的 4 个"越界色"实为 #0d0d08/#0e1014/#111318/#1c1f26，均为已声明令牌，白名单漏列）。

## Round 13（动效降级轮）
**结果**: 模拟 prefers-reduced-motion → boot 隐藏 ✓、reveal 直接可见 ✓、CSS 动画时长归零 ✓。

## Round 14（file:// 冒烟轮）
**结果**: 双击 index.html 场景 —— 数据渲染 ✓（6 项目/10 模块/时钟）、管理台令牌解锁 ✓（纯 JS SHA-256 生效）、无 JS 错误 ✓。content.json 探测静默失败符合设计。

## Round 15（SEO/META 审计轮）
**结果**: lang=zh-CN ✓、title/description ✓、OG 标签 ✓、favicon ✓、唯一 h1 + 4 个 h2 ✓、img 全有 alt ✓、外链全带 noopener ✓。

## Round 16（深评轮 / 子代理不可用改为主评）
**说明**: 两次尝试派发子代理均被平台拦截（"unusual activity"），按用户给的备选方式由主评继续。
**挑刺**:
1. [P1] 关联仓库 INDEX 面板过素，右侧大片留白，信息密度低。
2. [P2] attrs 面板"自评示例"注释与标签同行拥挤。
3. [P2] 全页缺一条完整的方舟式危险条纹装饰带（只有 sec-head 小条纹）。
**修复**: Round 17 实施。

## Round 17
**改动**: INDEX 面板重设计（编号 IDX-01/02 + 头部右置"查看全部" + 底部注释行）；attrs 注释独立成行；页脚顶边改为 4px 黄黑危险条纹。
**复检**: 编号与注释生效；footer 条纹可见。
**挑刺**: [P2] INDEX 长仓库名换行显参差。

## Round 18
**改动**: INDEX 仓库名改省略号截断（ellipsis）；attr 名称列 112→142px 防换行（≤520px 允许换行）。

## Round 19（全页复检轮）
**结果**: 桌面全页各区块协调统一；INDEX/attrs/footer 修复全部生效；移动端复核无异常；无 JS 错误。

## Round 20（回归轮）
**结果**: 交互 10 项全部通过；七档宽度溢出检测全 ok；控制台干净。

## Round 21（动效验证轮）
**结果**: Chakra Petch 400/600/700 正常加载渲染（500 未被使用属懒加载，零成本）；glitch ::before opacity 0.85 ✓；跑马灯位移 ✓；时钟走字 ✓；SYNC 数值抖动 ✓。

## Round 22（收尾组件轮）
**改动**: 新增方舟风 404 页（描边 404 + SIGNAL LOST + 切角按钮）；加 theme-color。
**复检**: 404 页渲染正常无 JS 错误。

## Round 23（线上端到端轮）
**部署**: 仓库 ponm3ay/ponm3ay.github.io 创建 → push → Pages 构建完成。
**结果**: https://ponm3ay.github.io 200（页面/CSS/JS/字体）；线上渲染 name=gugu / mail / 6 项目 / 字体已加载 / secureContext=true；https 下管理台令牌解锁 PASS。发现唯一 console 404（content.json 可选层探测）。
**修复**: 仓库放入空 `content.json`（占位覆盖层），404 消除。

## Round 24（终检轮）
**结果**: Pages 重新构建完成；线上 content.json 200；线上控制台 **(clean)** 零错误；标题正确。视觉迭代完成，共 24 轮。

---
## 附加处置记录
- 会话中发现上一会话遗留的平行实现 `js/content.js`+`js/sha256.js`（未被引用，含旧令牌哈希），已从仓库移除（git 历史可找回）。
- 部署期间 Mimosa 安全钩子拦截过 `_qa/edge-tmp`（一次性 Edge 配置目录，误报），已清理后放行。
- 无系统代理（ProxyEnable=0）；GitHub 直连不稳定但重试可通，未启用代理。

## Round 25-28（零上下文盲审轮，用户要求子代理检验后的替代+加强）
**背景**: 应用户"检验最好使用0上下文的子agent"，4 次尝试派发子代理均被平台拦截（unusual activity）。改用**零上下文程序化盲审** `_qa/audit.js`：不读取任何源码/设计意图，直接对线上 DOM 逐元素量化（对齐/重叠/对比度/点击目标/标题层级/可访问名/图片加载/字体族），误报经三轮分诊排除（装饰背景层、面板内边距、SVG 插图、aria-hidden 装饰数字）。
**v1 发现与修复**:
1. [真P1] 微标签对比度 2.77-2.93:1（--faint #5d5c56）→ 提亮 #807e76（≈4.6:1，全站一处变量修复）。
2. [真P1] 移动端点击目标 <34px：SKIP/LOGO/汉堡/快速链接/OPEN CASE/查看全部/COPY/ADMIN/BACK TO TOP → 全部加 padding 至 ≥34px。
3. [真] mono 字体链 CJK 回退宋体风险 → --f-mono 插入 'Microsoft YaHei'。
4. [真] dt 9.5px → 10px。
**v4 复测**: **P0=0 P1=0 P2=0**（v1: 12/29/5）。
**回归**: 交互 10/10 ✓；特写复核 nav/connect/footer 美感未破坏、可读性更好；误提交的 .mimosa 钩子状态已从仓库移除。

---

# 第二期迭代（用户追加需求：配色/图标/头像板块/性能/OG）

## Round 29（换肤 + 图标 + 肖像板块）
**改动**:
1. 全站换肤为 arknights.mer3y.xyz 浅色工业风：bg #f3f5f2 / ink #111412 / 荧光绿 #53ff18+#1fb900 / 橙 #ff6a00，毛玻璃状态卡，暗→浅全量令牌替换（25+ 处硬编码色定点清除）。
2. favicon 重做：六边形终端节点 + 荧光绿数据条 + 角标（与旧菱形完全不同）。
3. 默认头像重做：六边形容器 + 信号节点 + 四向刻度。
4. 档案区新增**肖像独立板块**（六边形框 + 扫描线 + CODENAME/CLEARANCE 元数据），hero 移除几何头像卡。
**挑刺**: hero 右上斜纹块发闷；sec-num 描边过淡。
**修复**: 斜纹改中性 ink 3.8%；描边 .18→.28。

## Round 30（性能 + OG + 盲审回归）
**改动**:
1. **bun 构建管线** `_qa/build.js`（bun build --minify，node 回退）：main.min.css 34→30.1K、app.min.js 16.6→10.7K、admin.min.js 22.2→14.4K、关键 CSS 6.1K 内联 + 主 CSS media=print 异步加载（幂等改写 index.html，boot 序列充当 FOUC 屏蔽）。
2. **OG 分享卡**（1200×630 品牌化 PNG 68KB）+ og:image/twitter:card meta + theme-color 换浅色。
3. 性能基线（本地，禁缓存）：**FCP 124ms / LCP 1008ms / 传输 96.2KB / 10 请求**。
**挑刺**: 盲审回升至 2/18/2 —— ① mer3y 的 #69706d 在浅底 4.41:1；② 肖像上传钮/面板新板块未被审计器覆盖；③ st-cyan 徽章青色系与新单强调色冲突。
**修复**: --faint → #656b67（4.6:1）；--cyan → #0c7c00 绿系；审计器 v3 规则（肖像容器覆盖控件、avatar-panel 内边距、aria-hidden/SVG 排除）。复测 **0/0/0**。

## Round 31（头像上传 E2E）
**新增**: `_qa/avatar-e2e.js` 六步全流程：未解锁隐藏上传钮 → 解锁显示 → 面板直传（canvas 压缩 640px → dataURL 14KB → localStorage）→ 刷新持久 → 管理台表单上传/预览/导出含头像（blob 21KB）→ 移除恢复默认。**6/6 PASS**，零 JS 错误。
**修复**: 测试脚本自身缺令牌输入步骤（假阴性）；admin.js save() 死变量清理；change 监听归位 bindInputs。

## Round 32-33（零上下文子代理一审：FAIL）
**平台插曲**: 用户要求 0 上下文子代理检验；此前 4 次派发被平台拦截，本轮起恢复成功，共完成 3 轮独立评审。
**一审（全新子代理，六维 + P0/P1/P2 清单）**: FAIL。采纳：占位/上传控件外露访客视图（P1）、轮播渐隐不足、移动端标题孤字、INDEX 断词、模块单列过长、teal 破坏单强调色。不采纳：followers=00（真实数据优先）。
**修复**: **访客/管理员双视图** —— body.p3-admin 会话类 + scanTodo() 内容驱动扫描（[待编辑] 文案 → .is-todo，访客 display:none，管理会话可见；日志 DRAFT 条目、CHANNEL 占位卡、SECTOR 格、RESPONSE TIME、portrait-hint、attrs-sub 全覆盖）+ .admin-only 类；mask 渐隐 56→96px；sec-title/connect-title text-wrap:balance；ops-index 网格化；模块移动端双列；teal 全量转绿。
**复检**: 访客视图 5 项占位全隐藏 ✓ / 管理视图全可见 ✓；交互 10/10；盲审 0/0/0；7 档宽度无溢出。

## Round 34-35（零上下文子代理二审：FAIL → 修复）
**二审**: 逐项核对发现 4 项复发/遗漏 —— ① RESPONSE TIME 占位未纳入扫描（静态无 data-c）；② 上传黑条外露（**根因**：.portrait-upload{display:flex} 覆盖 [hidden] UA 样式，与 admin-step 同款坑）；③ st-cyan 徽章仍青（**根因**：rgba(25,209,255,.45) 边框硬编码漏替换）；④ INDEX 断词碎片（break-all）。
**修复**: .portrait-upload[hidden]{display:none!important}；rgba(25,209,255→12,124,0)；connect-note 加 data-c 入扫描；keep-all+anywhere。复测 GUEST 6 项全达标。回归 10/10、0/0/0。

## Round 36-37（零上下文子代理三审：FAIL → 修复 → 全绿）
**三审**: 三项特别检查全过（无占位残留/无管理控件泄露/单强调色），P0=0；唯 P1"移动端无导航"+P2 灰块/INDEX 空槽/轮播硬切/断词。
**根因链**: 关联仓库网格 minmax(430px,1fr) 轨道 > 390px 视口 → 文档撑到 477px → body 布局整体推宽 → fixed 导航容器跟随越界 → 汉堡按钮 x=417 视口外；status-grid 灰块 = gap 灰底在 SECTOR 格隐藏后露出。
**修复**: minmax(min(430px,100%),1fr)（文档 docW 390=视口 ✓）；status-grid 改边线式（空槽干净留白）；渐隐带 140px 双段；keep-all 防断词。
**终态回归**: 交互 10/10 ✓ 盲审 0/0/0 ✓ 宽度扫描无溢出 ✓ 头像 E2E 6/6 ✓ 移动端实拍导航/汉堡/跳转正常 ✓。
**注意**: 令牌安全边界 = 把该仓库写权限交给这台设备；用户应自建细粒度令牌（不要复用宽权限 CLI 令牌）。

---

# 第四期：对标 endfield/ak 官网的编排与交互密度

## Round 43（滚动进场编排）
**实现**: ①区头错峰进场（编号 .05s → 大标题 .16s → 英文副标 .3s → 危险条纹 .45s 生长）②右上空心大编号 clip 扫入 ③统计带数字 count-up（进入视口触发，保留前导零/小数格式，RM 跳过）④时间线轨道 scaleY 生长 + 条目按索引 90ms 错峰左滑 ⑤作战卡进场覆盖层"合盖"开场（按索引 130ms 错峰，从右滑回）。
**验证**: count-up 终值格式正确（08/05/00/2022.10）；grown 触发后 rail scaleY≈1、5 条目全显影；sec-head 终态正确；零 JS 错误。

## Round 44（交互密度）
**实现**: ①导航链接编号块滑入（arrowBlock 手法：绿色斜块 translateX+skew）②轮播进度条（随滚动位置更新宽度）③模块矩阵格子斜向扫光 ④CONNECT 卡顶部绿线延展。
**翻车与修复**: 编号块隐藏态 translateX(-125%) 的 skew 平行四边形**溢出到相邻链接**（.nav-link 无 overflow:hidden）→ 多链接绿块串扰。实测矩阵 m41 定位后改为**小位移(-9px)+透明度**方案，溢出根治。
**审计器**: 排除浏览器扩展（沉浸式翻译 aix-*）注入的 DOM 误报。

## Round 45（性能对标 endfield 实测）
同机同网无缓存对照（首载）：

| 指标 | 我们 | endfield |
|---|---|---|
| TTFB | **620ms** | 2740ms |
| FCP | **1096ms** | 2852ms |
| LCP | **2512ms** | 3576ms |
| HTML | **~10KB** | 121.9KB |
| 首屏请求数 | **11** | 72+ |

**结论：加载性能全面超越**（公网 brotli 后总传输 58.2KB）。动画全部 transform/opacity/clip-path 合成层友好。
**回归**: 交互 10/10、盲审 0/0/0、宽度 0 溢出；线上 `d6914b5` 时间线编排实拍 ✓。

---

# 第五期：全区块交互语言 + 豪华交互（R48-51）

## Round 48（全区块覆盖语言统一）
面板扫光+描绿（bio/attrs/INDEX/modules 四面板背景层动画，不占伪元素）；INDEX 编号滑块（hover 绿底墨字）；时间线节点放大发光+标题提亮；统计带闪光上浮；CONNECT COPY 弹入（触屏常显）。零 JS 错误。

## Round 49（豪华大件）
作战卡+状态卡 **3D tilt 鼠标跟随**（perspective 950px，最大 4.5°，pointermove 实时驱动）；CTA **磁吸**（边缘外扩 70px 自适应半径，位移 12-18%）；hero 背景 **0.28 倍滚动视差**。实测：tilt 左上/右下方向正确、磁吸 translate(19.2px)、视差 translateY(168px)@600px ✓。
**翻车与修复**: 磁吸阈值以中心计算过苛（110px 不及按钮半径）→ 改边缘外扩自适应半径。

## Round 50-51（降级实测 + 评审闭环）
**降级实测**: RM+触屏模拟下 tilt 空/veil 隐藏/内容直显 ✓。
**第五期零上下文评审: PASS**（豪华感 8 / 一致性 8 / 过度设计风险 7 / 可读性 8 / 降级 8 / 契合 9）。采纳 2 项 P2：veil 数字 64→56px 防叠压、COPY 绿色语言统一。回归全绿，线上 `491af38` ✓。
**累计 51 轮迭代**。

---

# 第六期：作战详查器 + 彩蛋（R52-54）

## Round 52（作战详查器 Lightbox）
点击作战卡（卡内链接除外）弹**全屏详查面板**：斜切 clip-path 揭示动画 + 大号空心编号水印（150px）+ 编号/状态章/标题/完整描述/标签/OPEN REPO 主按钮 + 底部危险条纹；ESC / 遮罩点击 / ✕ 三路关闭；打开时焦点移交关闭钮、关闭后归还焦点；body 滚动锁定。veil 文案更新为"悬停 / 聚焦展开 · 点击详查"。

## Round 53（彩蛋）
① **核心脉冲**：双击 hero 菱形核心 → 波纹双扩散 + SYNC 锁定 100.0% + toast "CORE PULSE · 核心脉冲已发送"（1.4s 后复原）。② **标题栏轮播**：每 6s 切换终端风标题（DEEP SLEEP PROTOCOL ACTIVE 等 4 条），RM 下禁用。

## Round 54（回归 + 线上验证）
交互 10/10 ✓ 盲审 0/0/0 ✓ 宽度 0 溢出 ✓；线上 `7ae5375` Lightbox 实拍（autoclaw-proxy 详查面板）✓ 控制台 clean ✓。
**累计 54 轮迭代**。全部功能清单（21 项）：boot/glitch/ticker/核心旋转+脉冲/覆盖揭示/3D tilt/磁吸/视差/区头错峰/count-up/轨道生长/合盖开场/导航编号块/轮播进度条/面板扫光/INDEX滑块/节点发光/统计闪光/COPY弹入/Lightbox详查/标题轮播/核心脉冲。

---

# 第七期：菱形矩阵动效豪华化（R55）

## Round 55（核心 SVG 重构 + 分层动效）
**实现**: 核心 SVG 四层转速差——外虚线环反转 46s / 外菱正转 22s / 中菱反转 13s / 内芯心跳 2.4s（transform-box:fill-box 保证 SVG 内 origin 正确）；**3 颗数据粒子沿外菱形边 offset-path 巡航**（7/10/13s 错峰，纯 CSS 零 JS 逐帧）；自动波纹每 6s 一圈；hover 外环提亮 + 扫描加速；双击脉冲波纹与自动波纹分层共存（::before/::after）。
**性能实测**: 全动画开启 **61fps 满帧**（2s rAF 采样）、JS 堆 9.5MB——合成层友好达标。RM 下粒子隐藏、波纹禁用。
**线上验证**: `2daa764` built——粒子 offset-distance 跨 100% 循环点持续巡航（82.4%→91.7%→5.9%）✓、线上双击脉冲 PASS ✓、控制台 clean ✓。
**累计 55 轮迭代**。功能清单扩至 **24 项**（新增：粒子巡航/心跳/自动波纹/hover加速环）。

## Round 56（用户意图校正：双击时菱形方框本体跟着动）
用户澄清：双击核心脉冲要的是**菱形方框本体联动**，波纹圈不够；并质疑数据粒子含义。
**回应**: ① 粒子语义确立 = "信号包沿数据总线巡航"，且双击时参与响应（爆闪 brightness 2.4）。② SVG 四层各包 `boom-l`（fill-box origin），双击触发 `boomWave` **由内向外波浪**：内芯 0s → 粒子 .07s → 中菱 .14s → 外菱 .21s → 虚线环 .28s。
**实测**: 采样帧各层 scale 由内向外递减（heart 1.044 → orbs 1.108 → mid 1.17 → ring 1.165 上升中），波前推进明确；动画结束五层全部回位 scale=1 ✓；hero 名字 glitch 联动 ✓。回归 10/10 + 0/0/0 + 0 溢出。线上 `dbfc61f` ✓。
**累计 56 轮迭代**。





## Round 46-47（第四期评审闭环 + QA 浏览器隔离改造）
**第四期零上下文评审: PASS**（六维 9.0/8.5/9.0/8.0/8.5/8.5；结论"新交互是延伸而非贴花，编排克制不喧宾"）。采纳全部建议：
1. [P1] modules 扫光溢出格子 → `.modules-grid li{overflow:hidden}`。
2. [P2] 轮播进度条映射错误（8.3%≠1/6）→ 改为索引/总数映射（首格 16.7%）。
3. [P2] 日期型 count-up 出现 1706.27 无意义中间值 → `YYYY.MM` 格式跳过插值。
4. [P2] QA 截图中间帧失真 → shot.js 支持 RM 模拟拍终态（后续）；移动端顶栏 fullPage 伪影已有实机铁证（r38/r39）。
**QA 浏览器隔离改造（用户要求"用自己的浏览器，别动我 edge"）**:
- 新增 `_qa/browser.js` 共享启动器，三级探测：自带 Chrome for Testing（npmmirror 下载中）→ chrome-headless-shell → 系统 Edge + **独立 profile（.chrome-data），永不 taskkill 用户进程**。
- 6 个 QA 脚本全部切换 launch/close 模式；此前反复 taskkill msedge 导致用户浏览器被连带关闭的问题根治。
- 隔离链路全量回归：交互 10/10 ✓ 盲审 0/0/0 ✓ 宽度 0 溢出 ✓ 头像 E2E 6/6 ✓（本地 FCP 80ms）。
**线上**: commit `04a573b` built，`opsProgress` 等新交互已生效。



## Round 40（用户追加：管理后台直发 GitHub）
**需求**: "admin 修改只能保存到本地吗？能不能直接上传"。
**实现**: Contents API 直发 —— 后台新增「发布到 GitHub」主按钮：GET sha → PUT content.json（draft，UTF-8→base64）→ 带 sha 防冲突，401/403 错误分诊话术；首次发布弹令牌配置（细粒度 PAT 指引：仅授 ponm3ay/ponm3ay.github.io 的 Contents RW），令牌仅存本机 localStorage 可清除；发布状态行带步骤进度 + commit 短链 + Pages 上线提示。
**E2E**: 假令牌走错误路径；真令牌（本机 gh 会话注入测试页，不落文件）真实提交 `18c7c4b content update via admin console` 到仓库全链路验证 ✓，零 JS 错误。
**注意**: 令牌安全边界 = 把该仓库写权限交给这台设备；用户应自建细粒度令牌（不要复用宽权限 CLI 令牌）。

## Round 41-42（第三期：终末地式卡片覆盖揭示交互）
**需求**: "卡片不再直接展示而是做一层动效覆盖，类似 endfield.hypergryph.com"。
**研究**: 抓取 endfield 官网 643KB HTML + 8 个 CSS 分包，提取到 arrowBlock 覆盖滑入（clip-path 扩展 + translateX(0)）、HollowText 空心描边字、斜纹母题三类手法。
**实现**:
1. 作战卡新增 `.op-veil` 覆盖揭示层：默认遮蔽正文（斜纹网格 + 大号空心编号 64px + "▸▸ 悬停 / 聚焦展开 CASE FILE"），标题/编号/状态章常显保证可扫读。
2. hover/`:focus-within`（卡片 tabindex=0）触发：veil 右滑 103% + 内容错峰显影（描述 0.16s → 标签 0.26s → 元信息 0.34s）+ 顶部绿线延展全宽。
3. **触屏 (hover:none) 降级**：内容常显 + veil 变 44px 底部编号条（CDP 强制 hover:none 实测通过）。
4. **reduced-motion**：veil 直接隐藏，内容全显。
5. **可访问性实测三连**：正文不被 visibility/display 隐藏（在无障碍树中）✓；Tab 聚焦触发揭示（veilTx=441=卡宽）✓；RM 直显 ✓；veil 整体 aria-hidden ✓。
**子代理评审（零上下文）**: PASS —— 视觉语言一致性/遮蔽态可扫读性/触屏降级三项成立；采纳 4 项 P2：提示文案补"聚焦"、hover 背景不再降对比（bg3→panel）、hint 对比度升级、触屏 CTA 强化。P1 可访问性以实测证据闭环。
**审计器适配**: op-veil 与被遮内容的 by-design 重叠加入豁免规则。回归：交互 10/10、盲审 0/0/0、宽度 0 溢出。线上 commit `d881ff5` 验证两态实拍 ✓。









---

# 第八期：粒子移除 + 第六/七次审查闭环（R56-58）

## Round 57（用户指令：粒子删除）
数据粒子全套移除（HTML/CSS/动画），四层波浪响应保留并校正 boom-l 序号映射（heart 0s → mid .07s → spin .14s → ring .21s）。回归 10/10 + 0/0/0 + 0 溢出。

## Round 58（第六次审查 PASS + 三项 P2 修复）
**第六次审查（零上下文子代理）**: PASS，六维 9/8.5/9/9/9.5/9。粒子删除后核心区构图自洽。三项 P2 采纳修复：
1. 核心卡状态格留洞 → 访客视图末格跨两列（body:not(.p3-admin) 条件）
2. 轮播徽章被渐隐吞掉 → 渐隐改边缘压暗（alpha 0.72 常数，真实视口实测可辨）
3. 双击提示弱 → 核心区下常驻「DBL-CLICK // 核心脉冲」mono 提示行
**第七次审查（同一评审员复核三项修复）**: **FAIL**——两项确认良好（状态格跨列 ✓、双击提示行 ✓），但：① "徽章初始视口可辨"经像素级核验不成立（徽章几何上永远起于裁切边前 3px；已改口为"滚动后完整可读"，压暗边收口保留）② **critical CSS 已累积 8 份副本**（层叠覆盖冲突 + 重复 id，build.js 幂等失效累积）。

## Round 59（三项根治）
1. **critical CSS 8 份副本** → build.js 归零正则重写（不依赖行格式）+ **副本数断言**（三次连续构建恒为 1）。
2. grid-column 无条件规则（SECTOR 填真值后会复发）→ 改 `:has(> div.is-todo)` 条件式（填真值后自动恢复 2×2）。
3. `</body>` 前空行清理。
回归 10/10 + 0/0/0 + 0 溢出。第八次复核见下。
