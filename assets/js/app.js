/* ============================================================
   PONM3AY // PERSONAL ARCHIVE — app.js
   渲染管线 + 动效 + 交互。无任何外部依赖。
   ============================================================ */
(function () {
  'use strict';

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LS_KEY = 'p3_content_v1';

  /* ---------- 工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, obj);
  }
  function deepMerge(base, over) {
    if (!over || typeof over !== 'object') return base;
    var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    for (var k in over) {
      if (!Object.prototype.hasOwnProperty.call(over, k)) continue;
      var b = base ? base[k] : undefined, v = over[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && b && typeof b === 'object' && !Array.isArray(b)) {
        out[k] = deepMerge(b, v);
      } else if (v && typeof v === 'object' && Array.isArray(v)) {
        out[k] = v.slice();
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  /* ---------- 内容装载 ---------- */
  var C = deepMerge(window.P3_DEFAULT_CONTENT, {});

  function loadOverrides(done) {
    // 1) content.json（仓库内，管理员导出后提交即可全网生效）
    var req = new XMLHttpRequest();
    try {
      req.open('GET', 'content.json?t=' + Date.now(), true);
      req.timeout = 2500;
      req.onload = function () {
        if (req.status === 200) {
          try { C = deepMerge(C, JSON.parse(req.responseText)); } catch (e) { /* 忽略坏文件 */ }
        }
        step2();
      };
      req.onerror = req.ontimeout = step2;
      req.send();
    } catch (e) { step2(); }

    // 2) localStorage（管理后台的本机编辑）
    function step2() {
      try {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) C = deepMerge(C, JSON.parse(raw));
      } catch (e) { /* 忽略 */ }
      window.P3App.content = C;
      done();
    }
  }

  /* ---------- 渲染 ---------- */
  var App = window.P3App = { content: C, render: renderAll };

  function renderAll() {
    C = window.P3App.content;
    patchText();
    renderChips();
    renderAttrs();
    renderModules();
    renderOps();
    renderOpsIndex();
    renderTimeline();
    renderTicker();
    renderAvatar();
    renderMeta();
    scanTodo();
    initCountUp();
    initTimelineGrown();
    document.title = C.meta && C.meta.siteTitle ? C.meta.siteTitle : document.title;
  }

  function patchText() {
    var nodes = document.querySelectorAll('[data-c]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var v = getPath(C, el.getAttribute('data-c'));
      if (typeof v === 'string') el.textContent = v;
    }
    // hero mission 支持 \n
    var mission = document.querySelector('[data-c="identity.mission"]');
    if (mission && typeof getPath(C, 'identity.mission') === 'string') {
      mission.textContent = getPath(C, 'identity.mission');
      mission.style.whiteSpace = 'pre-line';
    }
    var name = document.querySelector('.hero-name');
    if (name) {
      var cn = getPath(C, 'identity.codename');
      name.textContent = cn;
      name.setAttribute('data-text', cn);
    }
    var mailCard = document.getElementById('channelMail');
    if (mailCard) mailCard.setAttribute('href', 'mailto:' + getPath(C, 'connect.mail'));
    var gitCard = document.getElementById('channelGit');
    if (gitCard) {
      gitCard.setAttribute('href', getPath(C, 'connect.githubUrl') || ('https://' + getPath(C, 'connect.github')));
    }
    var hqMail = document.getElementById('hqMail');
    if (hqMail) hqMail.setAttribute('href', 'mailto:' + getPath(C, 'connect.mail'));
    var hqGit = document.getElementById('hqGit');
    if (hqGit) hqGit.setAttribute('href', getPath(C, 'connect.githubUrl') || ('https://' + getPath(C, 'connect.github')));
  }

  function renderChips() {
    var box = document.getElementById('bioChips');
    if (!box || !C.chips) return;
    box.innerHTML = C.chips.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('');
  }

  function renderAttrs() {
    var box = document.getElementById('attrsList');
    if (!box || !C.attrs) return;
    box.innerHTML = C.attrs.map(function (a) {
      return '<div class="attr-row">' +
        '<span class="attr-name mono">' + esc(a.name) + ' · ' + esc(a.label || '') + '</span>' +
        '<span class="attr-bar"><i data-w="' + (+a.val || 0) + '"></i></span>' +
        '<span class="attr-val mono">' + (+a.val || 0) + '</span></div>';
    }).join('');
    requestAnimationFrame(function () {
      box.querySelectorAll('.attr-bar i').forEach(function (i) {
        if (i.hasAttribute('data-w')) { i.style.width = i.getAttribute('data-w') + '%'; i.removeAttribute('data-w'); }
      });
    });
  }

  function renderModules() {
    var list = document.getElementById('modulesList');
    if (!list || !C.modules) return;
    list.innerHTML = C.modules.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('');
    var cnt = document.getElementById('modulesCount');
    if (cnt) cnt.textContent = String(C.modules.length).padStart(2, '0');
  }

  function statusClass(st) {
    return st === 'gold' ? 'st-gold' : st === 'cyan' ? 'st-cyan' : st === 'red' ? 'st-red' : 'st-dim';
  }

  function renderOps() {
    var track = document.getElementById('opsTrack');
    if (!track || !C.operations) return;
    track.innerHTML = C.operations.map(function (o, idx) {
      var link = o.link || '#';
      var no = esc(o.no || 'OP-' + String(idx + 1).padStart(2, '0'));
      return '<article class="op-card" tabindex="0" style="--i:' + idx + '" aria-label="' + no + ' ' + esc(o.title) + '">' +
        '<div class="op-top mono"><span class="op-no">' + no + '</span>' +
        '<span class="op-status ' + statusClass(o.st) + '">' + esc(o.status || '') + '</span></div>' +
        '<h3 class="op-title"><a href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(o.title) + '</a></h3>' +
        '<div class="op-body">' +
        '<p class="op-desc">' + esc(o.desc) + '</p>' +
        '<div class="op-tags mono">' + (o.tags || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<div class="op-meta mono"><span>' + esc(o.meta || '') + '</span>' +
        '<a href="' + esc(link) + '" target="_blank" rel="noopener">OPEN CASE ↗</a></div>' +
        '</div>' +
        '<div class="op-veil mono" aria-hidden="true"><span class="veil-no">' + no.replace(/^OP-/, '') + '</span><span class="veil-hint">▸▸ 悬停 / 聚焦展开 CASE FILE</span></div>' +
        '</article>';
    }).join('');
    var total = document.getElementById('opsTotal');
    if (total) total.textContent = String(C.operations.length).padStart(2, '0');
    updateOpsIdx();
  }

  function renderOpsIndex() {
    var list = document.getElementById('opsIndex');
    if (!list || !C.opsIndex) return;
    list.innerHTML = C.opsIndex.map(function (o) {
      return '<li><a href="' + esc(o.link) + '" target="_blank" rel="noopener">' + esc(o.title) + '</a>' +
        '<span class="idx-lang">' + esc(o.lang || '') + ' · ' + esc(o.note || '') + '</span></li>';
    }).join('');
  }

  function renderTimeline() {
    var box = document.getElementById('timeline');
    if (!box || !C.log) return;
    box.innerHTML = '<span class="rail" aria-hidden="true"></span>' + C.log.map(function (l, i) {
      return '<div class="log-item" style="--i:' + i + '">' +
        '<p class="log-date mono">' + esc(l.date) + '</p>' +
        '<div class="log-head"><h3 class="log-title">' + esc(l.title) + '</h3>' +
        '<span class="log-status ' + statusClass(l.st) + '">' + esc(l.status || '') + '</span></div>' +
        '<p class="log-text">' + esc(l.text) + '</p></div>';
    }).join('');
    scanTodo();
  }

  function renderTicker() {
    var track = document.getElementById('tickerTrack');
    if (!track) return;
    var items = String(C.ticker || '').split('◆').map(function (s) { return s.trim(); }).filter(Boolean);
    var half = items.map(function (s) { return '<span>' + esc(s) + '</span><em>◆</em>'; }).join('');
    track.innerHTML = half + half; // -50% 无缝循环
  }

  function renderAvatar() {
    var img = document.getElementById('portraitImg');
    if (!img) return;
    var data = getPath(C, 'identity.avatarData');
    var url = getPath(C, 'identity.avatarUrl');
    var src = (typeof data === 'string' && data.indexOf('data:image') === 0) ? data
            : (typeof url === 'string' && url ? url : 'assets/img/avatar.svg');
    if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    img.onerror = function () { img.onerror = null; img.setAttribute('src', 'assets/img/avatar.svg'); };
  }

  function renderMeta() {
    var t = document.querySelector('title');
    if (t && C.meta && C.meta.siteTitle) t.textContent = C.meta.siteTitle;
  }

  /* ---------- 占位可见性：访客隐藏 [待编辑]，管理员会话可见 ---------- */
  function scanTodo() {
    document.querySelectorAll('.is-todo').forEach(function (el) { el.classList.remove('is-todo'); });
    document.querySelectorAll('[data-c]').forEach(function (el) {
      if (el.textContent.indexOf('[待编辑') !== -1) el.classList.add('is-todo');
    });
    document.querySelectorAll('.status-grid dd.is-todo').forEach(function (dd) {
      dd.parentElement.classList.add('is-todo');
    });
    document.querySelectorAll('.log-item').forEach(function (li) {
      if (li.textContent.indexOf('[待编辑') !== -1) li.classList.add('is-todo');
    });
    document.querySelectorAll('.connect-card').forEach(function (card) {
      if (card.querySelector('.cc-todo')) card.classList.add('is-todo');
    });
  }

  /* ---------- Toast ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.innerHTML = '<span class="t-dot">◆</span>' + esc(msg);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }
  window.P3Toast = toast;

  /* ---------- 复制按钮 ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var text = btn.getAttribute('data-copy');
    var done = function () { toast('已复制 · ' + text); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  });
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }

  /* ---------- 开机序列 ---------- */
  var bootLines = [
    '[00.041] MOUNT ARCHIVE NODE .......... <b class="ok">OK</b>',
    '[00.213] LOAD OPERATOR FILE <b>No.001</b> ...... <b class="ok">OK</b>',
    '[00.402] VERIFY CLEARANCE <b>PUBLIC</b> ........ <b class="ok">OK</b>',
    '[00.688] ESTABLISH LINK ............... <b class="ok">READY</b>',
    '[00.912] WELCOME BACK, <b>DOCTOR</b>.'
  ];
  function runBoot() {
    var boot = document.getElementById('boot');
    if (!boot) return;
    if (RM || sessionStorage.getItem('p3_booted')) { boot.classList.add('is-done'); sessionStorage.setItem('p3_booted', '1'); return; }
    var box = document.getElementById('bootLines');
    var bar = document.getElementById('bootBarFill');
    var pct = document.getElementById('bootPct');
    var i = 0, p = 0;
    var lineTimer = setInterval(function () {
      if (i >= bootLines.length) { clearInterval(lineTimer); return; }
      var d = document.createElement('div');
      d.className = 'bl';
      d.innerHTML = bootLines[i];
      box.appendChild(d);
      i++;
    }, 260);
    var barTimer = setInterval(function () {
      p = Math.min(100, p + Math.random() * 22 + 8);
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = 'LOADING - ' + Math.floor(p) + '%';
      if (p >= 100) clearInterval(barTimer);
    }, 200);
    var finish = function () {
      boot.classList.add('is-done');
      sessionStorage.setItem('p3_booted', '1');
      clearInterval(lineTimer); clearInterval(barTimer);
      setTimeout(function () { triggerGlitch(); }, 500);
    };
    document.getElementById('bootSkip').addEventListener('click', finish);
    setTimeout(finish, 3400);
  }

  /* ---------- 故障字效果 ---------- */
  function triggerGlitch() {
    var g = document.querySelector('.hero-name');
    if (!g || RM) return;
    g.classList.add('glitch-on');
    setTimeout(function () { g.classList.remove('glitch-on'); }, 480);
  }
  setInterval(function () { if (Math.random() < 0.4) triggerGlitch(); }, 5200);

  /* ---------- 导航 ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('navBurger');
    var links = document.getElementById('navLinks');
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var bar = document.getElementById('scrollBar');
      if (bar) bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) { links.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    });

    // 锚点高亮
    var secIds = ['top', 'profile', 'operations', 'log', 'connect'];
    var navA = {};
    links.querySelectorAll('.nav-link').forEach(function (a) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      navA[id] = a;
    });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(navA).forEach(function (k) { navA[k].classList.toggle('is-active', k === en.target.id); });
        }
      });
    }, { rootMargin: '-38% 0px -55% 0px' });
    secIds.forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });

    // 时钟
    var clock = document.getElementById('navClock');
    var tick = function () {
      var d = new Date();
      var p = function (n) { return String(n).padStart(2, '0'); };
      if (clock) clock.textContent = 'LOCAL ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    };
    tick(); setInterval(tick, 1000);

    // hero 坐标
    var xy = document.getElementById('heroXY');
    if (xy) {
      window.addEventListener('scroll', function () {
        var x = Math.floor(window.scrollX), y = Math.floor(window.scrollY);
        xy.textContent = 'X:' + String(x).padStart(4, '0') + ' / Y:' + String(y).padStart(4, '0');
      }, { passive: true });
    }
  }

  /* ---------- 滚动显现 ---------- */
  var revealIO = null;
  function observeReveals(root) {
    if (RM) {
      (root || document).querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    }
    (root || document).querySelectorAll('.reveal:not(.in)').forEach(function (el) { revealIO.observe(el); });
  }

  /* ---------- 作战分页 ---------- */
  function initOpsPager() {
    var vp = document.getElementById('opsViewport');
    if (!vp) return;
    function step() {
      var card = vp.querySelector('.op-card');
      return card ? card.getBoundingClientRect().width + 18 : 448;
    }
    document.getElementById('opsPrev').addEventListener('click', function () { vp.scrollBy({ left: -step(), behavior: 'smooth' }); });
    document.getElementById('opsNext').addEventListener('click', function () { vp.scrollBy({ left: step(), behavior: 'smooth' }); });
    vp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); vp.scrollBy({ left: step(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); vp.scrollBy({ left: -step(), behavior: 'smooth' }); }
    });
    vp.addEventListener('scroll', updateOpsIdx, { passive: true });
  }
  function updateOpsIdx() {
    var vp = document.getElementById('opsViewport');
    var idxEl = document.getElementById('opsIdx');
    if (!vp || !idxEl) return;
    var cards = vp.querySelectorAll('.op-card');
    if (!cards.length) return;
    var w = cards[0].getBoundingClientRect().width + 18;
    var i = Math.round(vp.scrollLeft / w) + 1;
    idxEl.textContent = String(Math.min(Math.max(i, 1), cards.length)).padStart(2, '0');
    vp.classList.toggle('at-end', vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 12);
    var prog = document.getElementById('opsProgress');
    if (prog) {
      var max = vp.scrollWidth - vp.clientWidth;
      var ratio = max > 0 ? Math.min(1, vp.scrollLeft / max) : 1;
      prog.style.width = Math.max(8, ratio * 100) + '%';
    }
  }

  /* ---------- SYNC 数值抖动 ---------- */
  function initSync() {
    var el = document.getElementById('syncVal');
    if (!el) return;
    setInterval(function () {
      el.textContent = (99 + Math.random()).toFixed(1);
    }, 2600);
  }

  /* ---------- 数字 count-up（统计带） ---------- */
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var raw = el.textContent.trim();
    var m = raw.match(/^(\d*)\.?(\d*)$/);
    if (!m || (!m[1] && !m[2])) return; // 非纯数字（如 2022.10 也匹配）→ 继续尝试
    if (raw.indexOf('.') !== -1 && !/^\d+\.\d+$/.test(raw)) return;
    var hasDot = raw.indexOf('.') !== -1;
    var intLen = hasDot ? raw.split('.')[0].length : raw.length;
    var decLen = hasDot ? raw.split('.')[1].length : 0;
    var target = parseFloat(raw);
    if (isNaN(target)) return;
    var DUR = RM ? 0 : 1300, t0 = null;
    function frame(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / DUR);
      var e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      var v = (target * e).toFixed(decLen);
      var s = hasDot ? v : String(Math.round(v)).padStart(intLen, '0');
      el.textContent = s;
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = hasDot ? (0).toFixed(decLen) : '0'.padStart(intLen, '0');
    requestAnimationFrame(frame);
  }
  function initCountUp() {
    var els = document.querySelectorAll('.stat-num[data-c]');
    if (RM) { els.forEach(function (el) { el.dataset.counted = '1'; }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }
  /* 时间线轨道生长 */
  function initTimelineGrown() {
    var box = document.getElementById('timeline');
    if (!box) return;
    if (RM) { box.classList.add('grown'); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { box.classList.add('grown'); io.disconnect(); }
      });
    }, { threshold: 0.2 });
    io.observe(box);
  }

  /* ---------- 启动 ---------- */
  loadOverrides(function () {
    window.P3App.content = C;
    renderAll();
    runBoot();
    initNav();
    initOpsPager();
    initSync();
    observeReveals(document);
  });
})();
