/* ============================================================
   PONM3AY // PERSONAL ARCHIVE — content.js
   站点默认内容（单一数据源）。
   覆盖顺序：本文件默认值 < content.json（仓库内，需提交才全网生效）
             < localStorage（管理后台保存，仅本浏览器可见）
   管理员令牌仅存 SHA-256 摘要，明文不落库。
   ============================================================ */

window.P3_TOKEN_SHA256 = '3b2a27c25311c5b48e4208e6dd459acc5636db261460667c77799f5154fe2b11';

window.P3_DEFAULT_CONTENT = {
  meta: {
    siteTitle: 'PONM3AY // PERSONAL ARCHIVE',
    updated: '2026.10'
  },
  identity: {
    fileNo: 'No.001',
    clearance: 'PUBLIC',
    codename: 'PONM3AY',
    name: 'gugu',
    role: 'AI TOOLS / AUTOMATION / CV',
    tagline: 'AI 工具 × 桌面自动化 × CV 流水线',
    mission: '把重复劳动拆成模块，交给脚本与 agent——\n人在回路之外，安心睡觉。',
    bio: '白天拆需求、写插件；晚上把日常动作自动化成脚本，然后 DeepSleep~zzz。专注 LLM agent 插件生态（DSH）、桌面自动化工具链与 CV 训练流水线 —— safeyolo、dsh-plugins、autoclaw-proxy 的维护者。',
    location: 'CN / [待编辑]',
    focus: 'AI × TOOLS × OPS',
    joinDate: '2022.10'
  },
  stats: {
    repos: '08',
    stars: '05',
    followers: '00',
    since: '2022.10'
  },
  attrs: [
    { name: 'BUILD SPEED', label: '建造速度', val: 88 },
    { name: 'DEBUG DEPTH', label: '调试深度', val: 84 },
    { name: 'UI TASTE', label: '界面审美', val: 76 },
    { name: 'OPS CONTROL', label: '自动化', val: 86 }
  ],
  chips: ['ROLE · 独立开发者', 'FOCUS · AGENT / TOOLS', 'AVAILABILITY · OPEN'],
  modules: [
    'Python', 'JavaScript', 'Node.js', 'PowerShell',
    'YOLO / CV', 'LLM Agents', 'DSH 插件开发', 'Windows 自动化',
    'Git / CI', 'OpenAI 兼容 API'
  ],
  operations: [
    {
      no: 'OP-01',
      title: 'safeyolo',
      desc: '基于 Ultralytics YOLO 的安全帽 / 反光衣穿戴检测训练工具：标注格式转换（VOC/COCO/YOLO）、数据集划分、训练与指标记录、评估与推理一体化 CLI，覆盖从原始标注到模型部署的完整流程。',
      tags: ['Python', 'YOLO', 'Computer Vision'],
      status: 'PUBLISHED', st: 'gold',
      meta: '★ 5 · MIT',
      link: 'https://github.com/ponm3ay/safeyolo',
      lang: 'Python'
    },
    {
      no: 'OP-02',
      title: 'dsh-plugins',
      desc: 'DeepSeek Harness（DSH）插件集：按任务给不同模型派活的「辅助模型」槽位、跨会话长期记忆（流水捕获 → 摘要注入 → 自动整理）、子代理用量显示、界面背景与供应商染色。不改本体源码，每个插件可独立装卸。',
      tags: ['JavaScript', 'DSH', 'Plugin'],
      status: 'ACTIVE', st: 'cyan',
      meta: '5 PLUGINS IN ONE',
      link: 'https://github.com/ponm3ay/dsh-plugins',
      lang: 'JavaScript'
    },
    {
      no: 'OP-03',
      title: 'autoclaw-proxy',
      desc: '把 AutoClaw（澳龙）桌面客户端的 GLM 模型额度封装成本地 OpenAI 兼容 API 端点：支持 SSE 流式与 tool_calls，凭据经 DPAPI 热提取自动续期，零依赖纯 Node.js 标准库，克隆即跑。',
      tags: ['Node.js', 'OpenAI API', 'Proxy'],
      status: 'ACTIVE', st: 'cyan',
      meta: 'ZERO-DEP',
      link: 'https://github.com/ponm3ay/autoclaw-proxy',
      lang: 'JavaScript'
    },
    {
      no: 'OP-04',
      title: 'dsh-bilibili-afygbot',
      desc: '把 B 站刷到的鸣潮凹分（椰果）视频沉淀成结构化、可联邦、可被 agent 调用的数据：append-only jsonl 记录 + 只读 HTTP 接口，记录 id 全局唯一，多机数据可按 id 去重联邦。',
      tags: ['Node.js', 'Data Layer', 'Bilibili'],
      status: 'FIELD TEST', st: 'red',
      meta: 'EARLY PREVIEW',
      link: 'https://github.com/ponm3ay/dsh-bilibili-afygbot',
      lang: 'JavaScript'
    },
    {
      no: 'OP-05',
      title: 'trae-cn-patcher',
      desc: 'Trae CN IDE 微插件：一键屏蔽「工作区位于安装文件夹」顶部告警横幅，并同步完整性校验避免「安装损坏」提示。apply / status / restore 三段式操作，零依赖。',
      tags: ['PowerShell', 'IDE Patch'],
      status: 'STABLE', st: 'dim',
      meta: 'ZERO-DEP',
      link: 'https://github.com/ponm3ay/trae-cn-patcher',
      lang: 'PowerShell'
    },
    {
      no: 'OP-06',
      title: 'traework-auto-checkin',
      desc: 'TRAE / TraeWork CN 每日自动签到：自动领取每日签到积分。零依赖 Node.js + Windows 计划任务，打开 IDE 即自动完成签到，无需人工干预。',
      tags: ['Node.js', 'Task Scheduler'],
      status: 'AUTOMATED', st: 'cyan',
      meta: 'DAILY RUN',
      link: 'https://github.com/ponm3ay/traework-auto-checkin',
      lang: 'JavaScript'
    }
  ],
  opsIndex: [
    { title: 'dsh-aux-models', lang: 'JavaScript', link: 'https://github.com/ponm3ay/dsh-aux-models', note: '辅助模型槽位面板' },
    { title: 'dsh-provider-accent', lang: 'JavaScript', link: 'https://github.com/ponm3ay/dsh-provider-accent', note: '供应商染色高亮' }
  ],
  log: [
    {
      date: '2026.10',
      title: 'dsh 插件矩阵成型',
      status: 'ACTIVE', st: 'cyan',
      text: 'dsh-plugins / dsh-aux-models / dsh-provider-accent 连续发版：模型派活、跨会话长期记忆、子代理用量显示链路稳定运行。'
    },
    {
      date: '2026.10',
      title: 'autoclaw-proxy 开放',
      status: 'PUBLISHED', st: 'gold',
      text: 'GLM 额度反代封装为 OpenAI 兼容端点：SSE 流式 + tool_calls 全通过，凭据自愈机制上线。'
    },
    {
      date: '2025.07',
      title: 'safeyolo 开源',
      status: '★ 5', st: 'gold',
      text: 'YOLO 安全帽 / 反光衣检测训练工具开源：标注 → 训练 → 部署全流程覆盖，CI 全绿。'
    },
    {
      date: '2022.10',
      title: '账号建立',
      status: 'ARCHIVED', st: 'dim',
      text: 'GitHub 账号 ponm3ay 注册。刀客塔进入泰拉，开始积累作战记录。'
    },
    {
      date: '[待编辑]',
      title: '在这里补一条你的记录',
      status: 'DRAFT', st: 'dim',
      text: '点击页面底部 ◆ ADMIN 进入管理后台，即可增删改这条时间线。'
    }
  ],
  connect: {
    mail: 'sevenmaples@163.com',
    github: 'github.com/ponm3ay',
    githubUrl: 'https://github.com/ponm3ay',
    extraLabel: 'CHANNEL · 更多频道',
    extraValue: '[待编辑 · 在管理后台补充 B站 / 博客 / 其他链接]',
    responseNote: 'RESPONSE TIME · 通常 24-48H · [待编辑：可写上你的响应习惯]'
  },
  ticker: 'PERSONAL ARCHIVE NODE ◆ GITHUB PAGES ◆ DEEP SLEEP PROTOCOL ◆ AGENT OPS ◆ 行动日志 ◆ CASE OPEN ◆ ZERO-DEP TOOLS ◆ 自动化脚本 ◆',
  footer: {
    text: '© 2026 PONM3AY ARCHIVE',
    note: 'ORIGINAL INTERFACE / PUBLIC ARCHIVE NODE'
  }
};
