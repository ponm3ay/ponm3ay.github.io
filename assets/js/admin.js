/* ============================================================
   PONM3AY // PERSONAL ARCHIVE — admin.js
   管理后台：令牌校验（SHA-256 摘要比对）→ 表单编辑 →
   保存到 localStorage / 导出 content.json。
   令牌明文不写入任何文件，此处只存摘要。
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'p3_content_v1';
  var SS_KEY = 'p3_admin_unlocked';
  var modal = document.getElementById('adminModal');
  var stepToken = document.getElementById('adminStepToken');
  var stepEdit = document.getElementById('adminStepEdit');
  var body = document.getElementById('adminBody');
  var liveHint = document.getElementById('adminLiveHint');
  var draft = null;

  /* ---------- 纯 JS SHA-256（兼容 file:// 等无 crypto.subtle 环境） ---------- */
  function sha256hex(ascii) {
    function rrot(v, n) { return (v >>> n) | (v << (32 - n)); }
    var mathPow = Math.pow, maxWord = mathPow(2, 32);
    var result = '', words = [], asciiBitLength = ascii.length * 8;
    var hash = [], k = [], primeCounter = 0;
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (var i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) {
      var j = ascii.charCodeAt(i);
      if (j >> 8) return ''; // 仅用于 ASCII 令牌
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = ((asciiBitLength / maxWord) | 0);
    words[words.length] = (asciiBitLength);
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16);
      var oldHash = hash.slice(0, 8);
      for (i = 16; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var s0 = rrot(w15, 7) ^ rrot(w15, 18) ^ (w15 >>> 3);
        var s1 = rrot(w2, 17) ^ rrot(w2, 19) ^ (w2 >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = hash[0], b = hash[1], c = hash[2], d = hash[3], e = hash[4], f = hash[5], g = hash[6], h = hash[7];
      for (i = 0; i < 64; i++) {
        var S1 = rrot(e, 6) ^ rrot(e, 11) ^ rrot(e, 25);
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + S1 + ch + k[i] + w[i]) | 0;
        var S0 = rrot(a, 2) ^ rrot(a, 13) ^ rrot(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + temp1) | 0; d = c; c = b; b = a; a = (temp1 + temp2) | 0;
      }
      hash[0] = (hash[0] + a) | 0; hash[1] = (hash[1] + b) | 0; hash[2] = (hash[2] + c) | 0; hash[3] = (hash[3] + d) | 0;
      hash[4] = (hash[4] + e) | 0; hash[5] = (hash[5] + f) | 0; hash[6] = (hash[6] + g) | 0; hash[7] = (hash[7] + h) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b2 = (hash[i] >> (j * 8)) & 255;
        result += ((b2 >> 4).toString(16)) + ((b2 & 15).toString(16));
      }
    }
    return result;
  }

  /* ---------- 嵌套路径读写 ---------- */
  function setPath(obj, path, val) {
    var ks = path.split('.');
    var o = obj;
    for (var i = 0; i < ks.length - 1; i++) {
      if (o[ks[i]] == null) o[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {};
      o = o[ks[i]];
    }
    o[ks[ks.length - 1]] = val;
  }
  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, obj);
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- 表单构建 ---------- */
  function fInput(label, path, val, type) {
    return '<div class="f-group"><label class="f-label">' + label +
      '</label><input class="f-input" data-path="' + path + '" type="' + (type || 'text') + '" value="' + esc(val) + '"></div>';
  }
  function fTextarea(label, path, val, rows) {
    return '<div class="f-group"><label class="f-label">' + label +
      '</label><textarea class="f-textarea" data-path="' + path + '" rows="' + (rows || 3) + '">' + esc(val) + '</textarea></div>';
  }
  var ST_OPTS = [['gold', '金色 GOLD'], ['cyan', '青色 CYAN'], ['red', '红色 RED'], ['dim', '灰阶 DIM']];
  function fSelect(label, path, val) {
    var opts = ST_OPTS.map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === val ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('');
    return '<div class="f-group"><label class="f-label">' + label +
      '</label><select class="f-input" data-path="' + path + '">' + opts + '</select></div>';
  }
  function fItem(inner, removePath) {
    return '<div class="f-item">' + inner +
      '<button class="f-item-x" type="button" data-remove="' + removePath + '" aria-label="删除此项">✕</button></div>';
  }

  function renderForm() {
    var h = '';

    h += '<section class="f-sec"><p class="f-sec-title">// 身份 IDENTITY</p>';
    h += '<div class="f-row">';
    h += fInput('代号 CODENAME', 'identity.codename', getPath(draft, 'identity.codename'));
    h += fInput('姓名 NAME', 'identity.name', getPath(draft, 'identity.name'));
    h += fInput('档案编号 FILE NO.', 'identity.fileNo', getPath(draft, 'identity.fileNo'));
    h += fInput('权限 CLEARANCE', 'identity.clearance', getPath(draft, 'identity.clearance'));
    h += fInput('职位 ROLE', 'identity.role', getPath(draft, 'identity.role'));
    h += fInput('标签 TAGLINE', 'identity.tagline', getPath(draft, 'identity.tagline'));
    h += fInput('驻地 SECTOR / LOCATION', 'identity.location', getPath(draft, 'identity.location'));
    h += fInput('专注 FOCUS', 'identity.focus', getPath(draft, 'identity.focus'));
    h += fInput('加入时间 JOIN', 'identity.joinDate', getPath(draft, 'identity.joinDate'));
    h += fInput('头像 URL（留空用默认）', 'identity.avatarUrl', getPath(draft, 'identity.avatarUrl') || '');
    h += '</div>';
    h += fTextarea('宣言 MISSION', 'identity.mission', getPath(draft, 'identity.mission'), 2);
    h += fTextarea('情报摘要 BIO', 'identity.bio', getPath(draft, 'identity.bio'), 4);
    h += '</section>';

    h += '<section class="f-sec"><p class="f-sec-title">// 统计 STATS</p><div class="f-row">';
    h += fInput('公开仓库 REPOS', 'stats.repos', getPath(draft, 'stats.repos'));
    h += fInput('星标 STARS', 'stats.stars', getPath(draft, 'stats.stars'));
    h += fInput('关注者 FOLLOWERS', 'stats.followers', getPath(draft, 'stats.followers'));
    h += fInput('加入于 SINCE', 'stats.since', getPath(draft, 'stats.since'));
    h += '</div></section>';

    h += '<section class="f-sec"><p class="f-sec-title">// 能力评估 ATTRS</p><div class="f-list" id="fAttrs">';
    (draft.attrs || []).forEach(function (a, i) {
      h += fItem(
        '<div class="f-row">' +
        fInput('名称 NAME', 'attrs.' + i + '.name', a.name) +
        fInput('中文 LABEL', 'attrs.' + i + '.label', a.label) +
        fInput('数值 VAL (0-100)', 'attrs.' + i + '.val', a.val, 'number') +
        '</div>', 'attrs.' + i);
    });
    h += '</div><button class="f-add" type="button" data-add="attrs">＋ 添加能力项</button></section>';

    h += '<section class="f-sec"><p class="f-sec-title">// 模块 MODULES（每行一个）</p>';
    h += fTextarea('模块列表', 'modules__lines', (draft.modules || []).join('\n'), 5);
    h += '</section>';

    h += '<section class="f-sec"><p class="f-sec-title">// 标签 CHIPS（每行一个）</p>';
    h += fTextarea('档案标签', 'chips__lines', (draft.chips || []).join('\n'), 3);
    h += '</section>';

    h += '<section class="f-sec"><p class="f-sec-title">// 作战记录 OPERATIONS</p><div class="f-list" id="fOps">';
    (draft.operations || []).forEach(function (o, i) {
      h += fItem(
        '<div class="f-row">' +
        fInput('编号 NO.', 'operations.' + i + '.no', o.no) +
        fInput('标题 TITLE', 'operations.' + i + '.title', o.title) +
        '</div>' +
        fTextarea('描述 DESC', 'operations.' + i + '.desc', o.desc, 3) +
        '<div class="f-row">' +
        fInput('技术标签 TAGS（逗号分隔）', 'operations.' + i + '.tags', (o.tags || []).join(', ')) +
        fInput('元信息 META', 'operations.' + i + '.meta', o.meta) +
        '</div>' +
        '<div class="f-row">' +
        fInput('状态文字 STATUS', 'operations.' + i + '.status', o.status) +
        fSelect('状态色 COLOR', 'operations.' + i + '.st', o.st) +
        '</div>' +
        '<div class="f-row">' +
        fInput('链接 LINK', 'operations.' + i + '.link', o.link) +
        fInput('语言 LANG', 'operations.' + i + '.lang', o.lang) +
        '</div>', 'operations.' + i);
    });
    h += '</div><button class="f-add" type="button" data-add="operations">＋ 添加项目</button></section>';

    h += '<section class="f-sec"><p class="f-sec-title">// 关联仓库 INDEX</p><div class="f-list" id="fIdx">';
    (draft.opsIndex || []).forEach(function (o, i) {
      h += fItem(
        '<div class="f-row">' +
        fInput('仓库名', 'opsIndex.' + i + '.title', o.title) +
        fInput('语言', 'opsIndex.' + i + '.lang', o.lang) +
        fInput('链接', 'opsIndex.' + i + '.link', o.link) +
        fInput('备注', 'opsIndex.' + i + '.note', o.note) +
        '</div>', 'opsIndex.' + i);
    });
    h += '</div><button class="f-add" type="button" data-add="opsIndex">＋ 添加仓库</button></section>';

    h += '<section class="f-sec"><p class="f-sec-title">// 行动日志 LOG</p><div class="f-list" id="fLog">';
    (draft.log || []).forEach(function (l, i) {
      h += fItem(
        '<div class="f-row">' +
        fInput('日期 DATE', 'log.' + i + '.date', l.date) +
        fInput('标题 TITLE', 'log.' + i + '.title', l.title) +
        '</div>' +
        '<div class="f-row">' +
        fInput('状态文字 STATUS', 'log.' + i + '.status', l.status) +
        fSelect('状态色 COLOR', 'log.' + i + '.st', l.st) +
        '</div>' +
        fTextarea('内容 TEXT', 'log.' + i + '.text', l.text, 2), 'log.' + i);
    });
    h += '</div><button class="f-add" type="button" data-add="log">＋ 添加日志</button></section>';

    h += '<section class="f-sec"><p class="f-sec-title">// 建立连接 CONNECT</p><div class="f-row">';
    h += fInput('邮箱 MAIL', 'connect.mail', getPath(draft, 'connect.mail'));
    h += fInput('GITHUB 显示文本', 'connect.github', getPath(draft, 'connect.github'));
    h += fInput('GITHUB 链接', 'connect.githubUrl', getPath(draft, 'connect.githubUrl'));
    h += fInput('更多频道标题', 'connect.extraLabel', getPath(draft, 'connect.extraLabel'));
    h += '</div>';
    h += fTextarea('更多频道内容（占位文案）', 'connect.extraValue', getPath(draft, 'connect.extraValue'), 2);
    h += fInput('响应时间备注', 'connect.responseNote', getPath(draft, 'connect.responseNote'));
    h += '</section>';

    h += '<section class="f-sec"><p class="f-sec-title">// 其他 MISC</p><div class="f-row">';
    h += fInput('站点标题', 'meta.siteTitle', getPath(draft, 'meta.siteTitle'));
    h += fInput('更新时间 UPDATED', 'meta.updated', getPath(draft, 'meta.updated'));
    h += fInput('页脚文本', 'footer.text', getPath(draft, 'footer.text'));
    h += fInput('页脚备注', 'footer.note', getPath(draft, 'footer.note'));
    h += '</div>';
    h += fTextarea('跑马灯（◆ 分隔）', 'ticker', getPath(draft, 'ticker'), 2);
    h += '</section>';

    body.innerHTML = h;
  }

  /* ---------- 输入绑定 ---------- */
  function bindInputs() {
    body.addEventListener('input', function (e) {
      var el = e.target;
      var path = el.getAttribute && el.getAttribute('data-path');
      if (!path) return;
      var v = el.value;
      if (path === 'modules__lines') { draft.modules = v.split('\n').map(function (s) { return s.trim(); }).filter(Boolean); return; }
      if (path === 'chips__lines') { draft.chips = v.split('\n').map(function (s) { return s.trim(); }).filter(Boolean); return; }
      if (path === 'ticker') { draft.ticker = v; return; }
      if (/\.tags$/.test(path)) {
        setPath(draft, path, v.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean));
        return;
      }
      if (/\.val$/.test(path)) {
        var n = Math.max(0, Math.min(100, parseInt(v, 10) || 0));
        setPath(draft, path, n);
        return;
      }
      setPath(draft, path, v);
    });

    body.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) {
        var key = add.getAttribute('data-add');
        if (key === 'attrs') draft.attrs.push({ name: 'NEW ATTR', label: '新能力', val: 50 });
        if (key === 'operations') draft.operations.push({
          no: 'OP-' + String(draft.operations.length + 1).padStart(2, '0'),
          title: '新项目', desc: '[待编辑]', tags: ['TAG'], status: 'DRAFT', st: 'dim',
          meta: '', link: 'https://github.com/ponm3ay/', lang: ''
        });
        if (key === 'opsIndex') draft.opsIndex.push({ title: 'repo-name', lang: '', link: 'https://github.com/ponm3ay/', note: '' });
        if (key === 'log') draft.log.unshift({ date: '[待编辑]', title: '新记录', status: 'DRAFT', st: 'dim', text: '[待编辑]' });
        renderForm();
        return;
      }
      var rm = e.target.closest('[data-remove]');
      if (rm) {
        var p = rm.getAttribute('data-remove').split('.');
        var arr = draft[p[0]];
        if (arr && arr.length > 1) { arr.splice(+p[1], 1); renderForm(); }
        else if (window.P3Toast) window.P3Toast('至少保留一项');
      }
    });
  }

  /* ---------- 保存 / 导出 / 重置 ---------- */
  function hasLocal() { try { return !!localStorage.getItem(LS_KEY); } catch (e) { return false; } }

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(draft));
      var merged = window.P3App.content;
      window.P3App.content = draft;
      window.P3App.render();
      liveHint.hidden = false;
      if (window.P3Toast) window.P3Toast('已保存到本浏览器 · 仅本机可见');
    } catch (e) {
      if (window.P3Toast) window.P3Toast('保存失败：' + e.message);
    }
  }

  function exportJson() {
    var payload = JSON.parse(JSON.stringify(draft));
    delete payload.__localOnly;
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
    if (window.P3Toast) window.P3Toast('content.json 已导出 · 提交到仓库后全网生效');
  }

  function reset() {
    if (!confirm('恢复默认内容？将清除本浏览器保存的编辑（不影响已导出的 content.json）。')) return;
    try { localStorage.removeItem(LS_KEY); } catch (e) { /* noop */ }
    draft = clone(window.P3_DEFAULT_CONTENT);
    window.P3App.content = clone(draft);
    window.P3App.render();
    liveHint.hidden = true;
    renderForm();
    if (window.P3Toast) window.P3Toast('已恢复默认内容');
  }

  /* ---------- 开关与校验 ---------- */
  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (sessionStorage.getItem(SS_KEY) === '1') { showEdit(); }
    else { showToken(); }
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
  function showToken() {
    stepToken.hidden = false;
    stepEdit.hidden = true;
    var inp = document.getElementById('tokenInput');
    setTimeout(function () { inp.focus(); }, 60);
  }
  function showEdit() {
    stepToken.hidden = true;
    stepEdit.hidden = false;
    draft = clone(window.P3App.content);
    renderForm();
    liveHint.hidden = !hasLocal();
  }
  function checkToken(e) {
    e.preventDefault();
    var inp = document.getElementById('tokenInput');
    var err = document.getElementById('tokenErr');
    var v = inp.value.trim();
    var ok = false;
    try {
      if (window.crypto && window.crypto.subtle && window.isSecureContext) {
        // 同步场景拿不到结果，退回纯 JS；保证两条路径一致
      }
    } catch (err2) { /* noop */ }
    ok = sha256hex(v) === String(window.P3_TOKEN_SHA256 || '').toLowerCase();
    if (ok) {
      err.hidden = true;
      inp.value = '';
      sessionStorage.setItem(SS_KEY, '1');
      showEdit();
      if (window.P3Toast) window.P3Toast('ACCESS GRANTED · 管理员已解锁');
    } else {
      err.hidden = false;
      inp.classList.remove('shake');
      void inp.offsetWidth;
      inp.classList.add('shake');
    }
  }

  function init() {
    var entry = document.getElementById('adminEntry');
    if (!entry) return;
    entry.addEventListener('click', openModal);
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-admin-close]')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
    document.getElementById('tokenForm').addEventListener('submit', checkToken);
    bindInputs();
    document.getElementById('adminSave').addEventListener('click', save);
    document.getElementById('adminExport').addEventListener('click', exportJson);
    document.getElementById('adminReset').addEventListener('click', reset);
    document.getElementById('adminLogout').addEventListener('click', function () {
      sessionStorage.removeItem(SS_KEY);
      showToken();
      if (window.P3Toast) window.P3Toast('已退出管理员会话');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
