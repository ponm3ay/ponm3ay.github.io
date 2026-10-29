// ============================================================
// PONM3AY // TERMINAL —— 站点内容配置
// ------------------------------------------------------------
// 全站可编辑文案都集中在这里。
// 标注【待编辑：…】的地方请改成你自己的内容（页面登录管理
// 面板修改后"导出 content.js"，用导出文件整文件替换本文件，
// 推送仓库即可更新线上站点）。
//
// admin.tokenHash 是管理令牌的 SHA-256 哈希（单向，不泄露原
// 令牌）。更换令牌：登录管理面板 → 安全 → 修改令牌；或手动：
//   node -e "console.log(require('crypto').createHash('sha256').update('新令牌').digest('hex'))"
// ============================================================
window.SITE_CONTENT = {

  meta: {
    title: "PONM3AY // 个人终端",
    name: "PONM3AY",
    nameCn: "【待编辑：你的中文名 / 常用昵称】",
    role: "【待编辑：身份 / 方向，例如 学生 · 开发者 · 创作者】",
    tagline: "【待编辑：一句话介绍自己，首页最显眼的位置，写你最想让人记住的一句。】",
    uid: "ID-001",
    location: "【待编辑：所在地】",
    updated: "2026.10",
    signal: "ACTIVE",
    focus: "【待编辑：方向标签，例如 WEB × TOOL × OSS】",
    avatar: ""
  },

  hero: {
    fileTag: "OPERATOR FILE // No.001",
    publicTag: "PUBLIC PROFILE",
    typing: [
      "【待编辑：首页轮播文案 1 —— 一句你做的事】",
      "【待编辑：轮播文案 2 —— 一句你的态度】",
      "【待编辑：轮播文案 3】"
    ],
    btnPrimary: "作战记录",
    btnPrimaryEn: "OPERATIONS",
    btnLink: "建立连接",
    btnLinkEn: "LINK"
  },

  marquee: [
    "PERSONAL TERMINAL",
    "PONM3AY",
    "OPEN CHANNEL",
    "SIGNAL ACTIVE",
    "【待编辑：跑马灯词组，可自行增删】"
  ],

  about: {
    index: "01",
    zh: "干员档案",
    en: "PROFILE / OPERATOR RECORD",
    clearance: "CLEARANCE · PUBLIC",
    briefingTitle: "个人简报",
    briefingEn: "BRIEFING",
    bio: "【待编辑：个人简介。写你做什么、对什么感兴趣、正在折腾什么。登录管理面板（页脚 ADMIN）即可修改这里。】",
    rows: [
      { k: "代号 CODENAME", v: "PONM3AY" },
      { k: "职业 CLASS", v: "【待编辑】" },
      { k: "驻地 BASE", v: "【待编辑：所在地】" },
      { k: "专长 SKILL", v: "【待编辑：擅长的事】" },
      { k: "状态 STATUS", v: "OPEN FOR COLLAB" }
    ],
    attrsTitle: "能力评估",
    attrsEn: "ATTRIBUTES / SELF-RATED",
    attrs: [
      { label: "【待编辑：能力 1】", value: 80 },
      { label: "【待编辑：能力 2】", value: 70 },
      { label: "【待编辑：能力 3】", value: 60 },
      { label: "【待编辑：能力 4】", value: 50 }
    ],
    modulesTitle: "模块阵列",
    modulesEn: "MODULE ARRAY",
    modules: [
      "【待编辑：技能 1】",
      "【待编辑：技能 2】",
      "【待编辑：技能 3】"
    ]
  },

  projects: {
    index: "02",
    zh: "作战记录",
    en: "CASE FILES / SELECTED WORKS",
    note: "DEPLOYMENT INDEX // 持续更新",
    items: [
      {
        code: "OP-01",
        type: "【待编辑：类型】",
        year: "2026",
        status: "READY",
        title: "【待编辑：项目名称】",
        desc: "【待编辑：项目简介。点击页脚 ADMIN 登录后，可在这里添加、删除真实项目，导出 content.js 替换仓库文件即可上线。】",
        link: "",
        tags: ["【标签 1】", "【标签 2】"]
      },
      {
        code: "OP-02",
        type: "【待编辑：类型】",
        year: "2026",
        status: "FIELD TEST",
        title: "【待编辑：项目名称】",
        desc: "【待编辑：项目简介。】",
        link: "",
        tags: ["【标签】"]
      }
    ]
  },

  connect: {
    index: "03",
    zh: "建立连接",
    en: "CONTACT / OPEN CHANNEL",
    headline: "通讯频道已开放，欢迎接入。",
    sub: "【待编辑：想合作、想交流，或者只是打个招呼 —— 挑一个频道发送信号。】",
    mail: "sevenmaples@163.com",
    github: "github.com/ponm3ay",
    extras: [
      { label: "BILIBILI", value: "【待编辑：账号或链接】", link: "" },
      { label: "【待编辑：平台名】", value: "【待编辑：账号】", link: "" }
    ]
  },

  footer: {
    text: "© 2026 PONM3AY // PERSONAL TERMINAL · 【待编辑：备案号或其他声明，可清空】"
  },

  admin: {
    // 管理令牌的 SHA-256 哈希。原令牌只保存在站主手里，勿把明文写进任何文件。
    tokenHash: "8d4138c8103d1556828c798ec7a3094196f62b2dacc66a75f532f1d72d048d85"
  }
};
