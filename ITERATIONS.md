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




