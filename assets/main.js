/* Marc Darenz Masarate: portfolio enhancements. Vanilla ES2019, no dependencies.
   Everything here is optional: without this file the page is complete and usable.
   Under prefers-reduced-motion the contours draw one static frame and pointer effects are off. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, W = window;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function mm(q) { return W.matchMedia ? W.matchMedia(q) : { matches: false }; }
  function onMQ(m, f) { if (m.addEventListener) m.addEventListener('change', f); else if (m.addListener) m.addListener(f); }
  var RM = mm('(prefers-reduced-motion: reduce)'), FINE = mm('(hover: hover) and (pointer: fine)'), DARK = mm('(prefers-color-scheme: dark)');
  function still() { return RM.matches; }
  function raf(f) { return W.requestAnimationFrame(f); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function sy() { return W.scrollY || W.pageYOffset || 0; }
  function debounce(f, ms) { var t; return function () { clearTimeout(t); t = setTimeout(f, ms); }; }
  var live = $('#live');
  function say(m) { if (!live) return; live.textContent = ''; setTimeout(function () { live.textContent = m; }, 60); }

  $$('[data-js]').forEach(function (el) { el.hidden = false; });

  /* ---------- 1. Topographic contour background ---------- */
  var topo = (function () {
    var cv = $('#topo'), ctx = cv && cv.getContext && cv.getContext('2d');
    if (!ctx || typeof Path2D === 'undefined') return null;
    var p = new Uint8Array(512), i, j, s = 7919, tmp;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; j = s % (i + 1); tmp = p[i]; p[i] = p[j]; p[j] = tmp; }
    for (i = 0; i < 256; i++) p[i + 256] = p[i];
    function fd(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lp(a, b, t) { return a + t * (b - a); }
    function gr(h, x, y, z) { h &= 15; var u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z); return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); }
    function noise(x, y, z) { // improved Perlin noise
      var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
      x -= X; y -= Y; z -= Z; X &= 255; Y &= 255; Z &= 255;
      var u = fd(x), v = fd(y), w = fd(z);
      var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
      return lp(lp(lp(gr(p[AA], x, y, z), gr(p[BA], x - 1, y, z), u), lp(gr(p[AB], x, y - 1, z), gr(p[BB], x - 1, y - 1, z), u), v),
        lp(lp(gr(p[AA + 1], x, y, z - 1), gr(p[BA + 1], x - 1, y, z - 1), u), lp(gr(p[AB + 1], x, y - 1, z - 1), gr(p[BB + 1], x - 1, y - 1, z - 1), u), v), w);
    }
    // Marching-squares edge pairs per case (edges: 0 top, 1 right, 2 bottom, 3 left); 5 and 10 are saddles.
    var SEG = [null, [3, 2], [2, 1], [3, 1], [0, 1], null, [0, 2], [3, 0], [3, 0], [0, 2], null, [0, 1], [3, 1], [2, 1], [3, 2]];
    var CELL = 18, STEP = 0.07, FQ = 1 / 480, sc = 1, cw = 0, ch = 0, cols = 0, rows = 0, F = null;
    var col = '10,10,10', aM = 0.11, aI = 0.2;
    var mx = 0, my = 0, hx = -1, hy = -1, amp = 0, ampT = 0, rings = [];
    var t0 = performance.now() - 24000, last = 0, rid = 0, running = false, heldAt = 0, paused = false;
    try { paused = localStorage.getItem('mdm-motion') === 'off'; } catch (err) {}
    var a, b, c, e, L, x0, y0, cs;

    function size() {
      var w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return false;
      var nsc = Math.max(0.75, Math.min(W.devicePixelRatio || 1, 2) * 0.75);
      if (w === cw && h === ch && nsc === sc && F) return false;
      cw = w; ch = h; sc = nsc;
      cv.width = Math.round(w * sc); cv.height = Math.round(h * sc);
      cols = Math.ceil(w / CELL) + 1; rows = Math.ceil(h / CELL) + 1;
      F = new Float32Array((cols + 1) * (rows + 1));
      return true;
    }
    function ep(P, move, id) {
      var t, x, y;
      if (id === 0) { t = (L - a) / (b - a); x = x0 + t * cs; y = y0; }
      else if (id === 1) { t = (L - b) / (c - b); x = x0 + cs; y = y0 + t * cs; }
      else if (id === 2) { t = (L - e) / (c - e); x = x0 + t * cs; y = y0 + cs; }
      else { t = (L - a) / (e - a); x = x0; y = y0 + t * cs; }
      if (move) P.moveTo(x, y); else P.lineTo(x, y);
    }
    function seg(P, e1, e2) { ep(P, true, e1); ep(P, false, e2); }
    function frame(now) {
      if (!F && !size()) return;
      var tt = (now - t0) / 1000, z = tt * 0.028, ox = tt * 0.005, C = cols + 1, k = 0, x, y, v, dx, dy, n, g, age, q, dist;
      if (hx < 0) { hx = mx; hy = my; }
      hx += (mx - hx) * 0.12; hy += (my - hy) * 0.12; amp += (ampT - amp) * 0.05;
      rings = rings.filter(function (r) { return now - r.t < 1900; });
      for (j = 0; j <= rows; j++) {
        y = j * CELL;
        for (i = 0; i <= cols; i++, k++) {
          x = i * CELL;
          v = noise(x * FQ + ox, y * FQ, z) + 0.5 * noise(x * FQ * 2.03 + 17.1, y * FQ * 2.03 + 3.7, z * 1.35 + 9);
          if (amp > 0.003) { dx = x - hx; dy = y - hy; v += amp * 0.36 * Math.exp(-(dx * dx + dy * dy) / 26000); }
          for (n = 0; n < rings.length; n++) {
            g = rings[n]; age = (now - g.t) / 1900; dx = x - g.x; dy = y - g.y;
            dist = Math.sqrt(dx * dx + dy * dy); q = (dist - (30 + age * 640)) / 44;
            v += 0.24 * (1 - age) * (1 - age) * Math.exp(-q * q);
          }
          F[k] = v;
        }
      }
      var pM = new Path2D(), pI = new Path2D(), lo, hi, k0, k1, kk, id, m, P;
      cs = CELL * sc;
      for (j = 0; j < rows; j++) {
        y0 = j * cs;
        for (i = 0; i < cols; i++) {
          a = F[j * C + i]; b = F[j * C + i + 1]; c = F[(j + 1) * C + i + 1]; e = F[(j + 1) * C + i];
          lo = Math.min(a, b, c, e); hi = Math.max(a, b, c, e);
          k0 = Math.ceil(lo / STEP); k1 = Math.floor(hi / STEP);
          if (k0 > k1) continue;
          x0 = i * cs;
          for (kk = k0; kk <= k1; kk++) {
            L = kk * STEP;
            id = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (e > L ? 1 : 0);
            if (id === 0 || id === 15) continue;
            P = kk % 5 === 0 ? pI : pM;
            if (id === 5 || id === 10) {
              m = (a + b + c + e) / 4 > L;
              if ((id === 5) === m) { seg(P, 3, 0); seg(P, 2, 1); } else { seg(P, 0, 1); seg(P, 3, 2); }
            } else seg(P, SEG[id][0], SEG[id][1]);
          }
        }
      }
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.lineWidth = sc; ctx.strokeStyle = 'rgba(' + col + ',' + aM + ')'; ctx.stroke(pM);
      ctx.lineWidth = 1.6 * sc; ctx.strokeStyle = 'rgba(' + col + ',' + aI + ')'; ctx.stroke(pI);
    }
    function loop(now) {
      rid = raf(loop);
      if (now - last < 32) return; // ~30 fps cap
      last = now; frame(now);
    }
    // The contour clock only advances while running, so pausing and resuming never jumps.
    function start() { if (running || paused || still() || d.hidden) return; if (heldAt) t0 += performance.now() - heldAt; heldAt = 0; running = true; rid = raf(loop); }
    function stop() { if (running) heldAt = performance.now(); running = false; W.cancelAnimationFrame(rid); }
    function redraw() { if (!running) { if (!heldAt) heldAt = performance.now(); frame(heldAt); } }
    function setPaused(v) { paused = v; try { localStorage.setItem('mdm-motion', v ? 'off' : 'on'); } catch (err) {} if (v) stop(); else start(); }
    function recolor(noDraw) {
      var st = getComputedStyle(root);
      col = st.getPropertyValue('--topo').trim() || col;
      aM = parseFloat(st.getPropertyValue('--topo-a')) || aM;
      aI = parseFloat(st.getPropertyValue('--topo-i')) || aI;
      if (noDraw !== true) redraw();
    }
    W.addEventListener('pointermove', function (ev) {
      if (ev.pointerType !== 'mouse') return;
      mx = ev.clientX; my = ev.clientY; ampT = 1;
    }, { passive: true });
    root.addEventListener('mouseleave', function () { ampT = 0; });
    var tp = null;
    W.addEventListener('pointerdown', function (ev) { tp = ev.pointerType === 'mouse' ? null : { x: ev.clientX, y: ev.clientY, t: ev.timeStamp }; }, { passive: true });
    W.addEventListener('pointercancel', function () { tp = null; }, { passive: true });
    W.addEventListener('pointerup', function (ev) {
      if (tp && running && Math.abs(ev.clientX - tp.x) + Math.abs(ev.clientY - tp.y) < 14 && ev.timeStamp - tp.t < 600) {
        rings.push({ x: ev.clientX, y: ev.clientY, t: performance.now() });
        if (rings.length > 4) rings.shift();
      }
      tp = null;
    }, { passive: true });
    d.addEventListener('visibilitychange', function () { if (d.hidden) stop(); else start(); });
    onMQ(RM, function () { if (still()) stop(); else start(); });
    W.addEventListener('resize', debounce(function () { if (size()) redraw(); }, 160));
    size(); recolor(true);
    if (still() || paused) redraw(); else start();
    return { recolor: recolor, redraw: redraw, setPaused: setPaused, isPaused: function () { return paused; } };
  })();

  (function () { // WCAG 2.2.2: a persistent way to pause the moving background
    var mb = $('.motion-toggle');
    if (!mb) return;
    if (!topo) { mb.hidden = true; return; }
    function sync() { mb.hidden = still(); mb.setAttribute('aria-pressed', topo.isPaused() ? 'true' : 'false'); }
    mb.addEventListener('click', function () { topo.setPaused(!topo.isPaused()); sync(); say(topo.isPaused() ? 'Background motion paused' : 'Background motion playing'); });
    onMQ(RM, sync); sync();
  })();

  /* ---------- 2. Theme toggle with circular reveal ---------- */
  var tbtn = $('#theme-toggle'), KEY = 'mdm-theme';
  function isDark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : DARK.matches; }
  function syncTheme(init) {
    var dk = isDark(), t = root.getAttribute('data-theme');
    if (tbtn) tbtn.setAttribute('aria-pressed', dk ? 'true' : 'false');
    $$('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', t ? (dk ? '#000000' : '#ffffff') : (/dark/.test(m.media) ? '#000000' : '#ffffff'));
    });
    if (topo) topo.recolor(init === true);
  }
  function setTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (err) {}
    syncTheme();
  }
  if (tbtn) {
    tbtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      if (!d.startViewTransition || still()) { setTheme(next); return; }
      var r = tbtn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var R = Math.hypot(Math.max(x, W.innerWidth - x), Math.max(y, W.innerHeight - y));
      var vt = d.startViewTransition(function () { setTheme(next); });
      vt.ready.then(function () {
        root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + R + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 700, easing: 'cubic-bezier(.3,.6,.2,1)', pseudoElement: '::view-transition-new(root)' });
      }).catch(function () {});
    });
  }
  onMQ(DARK, syncTheme);
  syncTheme(true);

  var xhOn = false, drawXH = function () {}; // set by the crosshair (section 4)

  /* ---------- 3. Header station readout, long-section progress, nav highlight ---------- */
  var hdr = $('.site-header'), stB = $('.station b'), stN = $('.station-name'), fill = $('.lsec-fill'), lsec = $('.lsec');
  var secs = $$('[data-ch]'), navA = $$('.nav a[href^="#"]'), tops = [], ticks = [], hh = 0, maxS = 1, docH = 1, curSec = -1, lastM = -1, pend = false;
  function fmtCH(mv, dp) {
    var km = Math.floor(mv / 1000), r = mv - km * 1000, str = dp ? r.toFixed(1) : String(Math.floor(r));
    var intLen = str.split('.')[0].length;
    while (intLen++ < 3) str = '0' + str;
    return km + '+' + str;
  }
  function chAt(y) {
    var i = 0, n = tops.length - 1;
    while (i < n && tops[i + 1] <= y) i++;
    var top = tops[i], end = i < n ? tops[i + 1] : docH;
    return [+secs[i].getAttribute('data-ch') + clamp((y - top) / Math.max(1, end - top), 0, 1) * 99.9, i];
  }
  if (lsec) ticks = secs.map(function () { var t = d.createElement('i'); lsec.appendChild(t); return t; });
  // Reading line: just under the header, pushed to the page end over the last screen of scroll.
  function lineAt(y) { var vh = W.innerHeight, off = Math.max(hh + 20, 90); return y + off + clamp(1 - (maxS - y) / vh, 0, 1) * (vh - off); }
  function measure() {
    var y = sy();
    tops = secs.map(function (el) { return el.getBoundingClientRect().top + y; });
    hh = hdr ? hdr.offsetHeight : 0;
    docH = root.scrollHeight; maxS = Math.max(1, docH - W.innerHeight);
    ticks.forEach(function (t, i) { // scroll position where the reading line reaches each section
      var lo = 0, hi = maxS, k;
      for (k = 0; k < 24; k++) { var mid = (lo + hi) / 2; if (lineAt(mid) < tops[i]) lo = mid; else hi = mid; }
      t.style.left = (hi / maxS) * 100 + '%';
    });
    curSec = -1; update();
  }
  function update() {
    pend = false;
    if (!tops.length) return;
    var y = sy(), pr = clamp(y / maxS, 0, 1), r = chAt(lineAt(y)), mv = Math.floor(r[0]);
    if (fill) fill.style.transform = 'scaleX(' + pr + ')';
    if (stB && mv !== lastM) { lastM = mv; stB.textContent = 'CH ' + fmtCH(mv); }
    if (r[1] !== curSec) {
      curSec = r[1];
      if (stN) stN.textContent = secs[curSec].getAttribute('data-name');
      var hash = '#' + secs[curSec].id;
      navA.forEach(function (el) { el.classList.toggle('is-here', el.getAttribute('href') === hash); });
      ticks.forEach(function (t, i) { t.classList.toggle('on', i <= curSec); });
    }
    if (xhOn) drawXH();
  }
  function onScroll() { if (!pend) { pend = true; raf(update); } }
  W.addEventListener('scroll', onScroll, { passive: true });
  var remeasure = debounce(measure, 120);
  W.addEventListener('resize', remeasure);
  W.addEventListener('load', measure);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);
  if (W.ResizeObserver) new ResizeObserver(remeasure).observe($('.sheet') || d.body);

  /* ---------- 4. CAD crosshair with chainage / offset readout (fine pointers only) ---------- */
  (function () {
    var sheet = $('.sheet');
    if (!sheet || !FINE.matches || still()) return;
    var xh = d.createElement('div'); xh.className = 'xh'; xh.setAttribute('aria-hidden', 'true');
    xh.innerHTML = '<i class="xh-h"></i><i class="xh-v"></i><i class="xh-t"><span></span></i>';
    d.body.appendChild(xh);
    var H = xh.children[0], V = xh.children[1], T = xh.children[2], TS = T.firstChild, px = 0, py = 0, sl = 0, sw = 0, q = false;
    function box() { var r = sheet.getBoundingClientRect(); sl = r.left; sw = r.width; H.style.left = sl + 'px'; H.style.width = sw + 'px'; }
    drawXH = function () {
      q = false;
      H.style.transform = 'translate3d(0,' + py + 'px,0)';
      V.style.transform = 'translate3d(' + px + 'px,0,0)';
      T.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
      T.classList.toggle('fx', px > W.innerWidth - 200);
      T.classList.toggle('fy', py > W.innerHeight - 60);
      var off = (px - (sl + sw / 2)) / 40;
      TS.textContent = 'CH ' + fmtCH(chAt(sy() + py)[0], 1) + '  ' + Math.abs(off).toFixed(1) + (off < -0.05 ? ' L' : off > 0.05 ? ' R' : ' CL');
    };
    sheet.addEventListener('pointermove', function (ev) {
      if (ev.pointerType !== 'mouse') return;
      px = ev.clientX; py = ev.clientY;
      if (!xhOn) { xhOn = true; box(); xh.classList.add('on'); }
      if (!q) { q = true; raf(drawXH); }
    }, { passive: true });
    sheet.addEventListener('pointerleave', function () { xhOn = false; xh.classList.remove('on'); });
    W.addEventListener('resize', debounce(box, 120));
  })();

  /* ---------- 5. Object-snap tap marker and magnetic primary buttons ---------- */
  d.addEventListener('pointerdown', function (ev) {
    if (still() || ev.button !== 0 || !ev.target.closest) return;
    if (!ev.target.closest('a[href],button')) return;
    var m = d.createElement('span');
    m.className = 'snap'; m.setAttribute('aria-hidden', 'true');
    m.style.left = ev.clientX + 'px'; m.style.top = ev.clientY + 'px';
    m.addEventListener('animationend', function () { m.remove(); });
    d.body.appendChild(m);
    setTimeout(function () { if (m.parentNode) m.remove(); }, 1200);
  }, { passive: true });
  if (FINE.matches) $$('.btn-primary').forEach(function (btn) {
    var r = null;
    btn.addEventListener('pointerenter', function () { if (!still()) r = btn.getBoundingClientRect(); });
    btn.addEventListener('pointermove', function (ev) {
      if (!r || ev.pointerType !== 'mouse') return;
      var x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      btn.style.transform = 'translate3d(' + (x * 8).toFixed(2) + 'px,' + (y * 6).toFixed(2) + 'px,0)';
    }, { passive: true });
    btn.addEventListener('pointerleave', function () { r = null; btn.style.transform = ''; });
  });

  /* ---------- 6. Copy buttons ---------- */
  $$('[data-copy]').forEach(function (btn) {
    var lbl = $('.copy-t', btn), timer;
    btn.addEventListener('click', function () {
      var el = d.getElementById(btn.getAttribute('data-copy'));
      if (!el) return;
      var text = el.textContent.trim(), what = btn.getAttribute('data-what') || 'Text';
      function ok() {
        btn.classList.add('done'); if (lbl) lbl.textContent = 'Copied';
        say(what + ' copied');
        clearTimeout(timer);
        timer = setTimeout(function () { btn.classList.remove('done'); if (lbl) lbl.textContent = 'Copy'; }, 2200);
      }
      function legacy() {
        var ta = d.createElement('textarea'), done = false;
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        d.body.appendChild(ta); ta.select();
        try { done = d.execCommand('copy'); } catch (err) {}
        ta.remove(); btn.focus();
        if (done) { ok(); return; }
        try { var rg = d.createRange(); rg.selectNodeContents(el); var sel = W.getSelection(); sel.removeAllRanges(); sel.addRange(rg); } catch (err) {}
        say(what + ' selected. Press Control C or Command C to copy.');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, legacy);
      else legacy();
    });
  });

  /* ---------- 7. Interactive drawing key ---------- */
  (function () {
    var dwg = $('.dwg'), key = $('.key');
    if (!dwg || !key) return;
    var layers = $$('.lyr', dwg), sel = 0, hov = 0, foc = 0, names = [];
    key.setAttribute('aria-label', 'Drawing key. Select a layer to highlight it in the drawing.');
    var btns = $$('li', key).map(function (li, i) {
      var b = d.createElement('button');
      b.type = 'button'; b.className = 'kb'; b.setAttribute('aria-pressed', 'false');
      while (li.firstChild) b.appendChild(li.firstChild);
      li.appendChild(b);
      names.push(b.textContent.replace(/^\s*\d+\s*/, '').trim());
      b.addEventListener('click', function () { pick(i + 1); });
      b.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse') { hov = i + 1; paint(); } });
      b.addEventListener('pointerleave', function () { hov = 0; paint(); });
      b.addEventListener('focus', function () { var fv = true; try { fv = b.matches(':focus-visible'); } catch (err) {} if (fv) { foc = i + 1; paint(); } });
      b.addEventListener('blur', function () { foc = 0; paint(); });
      return b;
    });
    function paint() {
      var n = hov || foc || sel;
      dwg.classList.toggle('has-hl', n > 0);
      layers.forEach(function (g) { g.classList.toggle('hl', +g.getAttribute('data-layer') === n); });
      btns.forEach(function (b, i) { b.classList.toggle('hl', i + 1 === n); });
    }
    function pick(n) {
      sel = sel === n ? 0 : n;
      btns.forEach(function (b, i) { b.setAttribute('aria-pressed', i + 1 === sel ? 'true' : 'false'); });
      paint();
      say(sel ? 'Layer ' + sel + ', ' + names[sel - 1] + ', highlighted in the drawing' : 'Drawing highlight cleared');
    }
    dwg.addEventListener('click', function (ev) { var g = ev.target.closest('[data-layer]'); if (g) pick(+g.getAttribute('data-layer')); });
    dwg.addEventListener('pointerover', function (ev) {
      if (ev.pointerType !== 'mouse') return;
      var g = ev.target.closest('[data-layer]'); hov = g ? +g.getAttribute('data-layer') : 0; paint();
    });
    dwg.addEventListener('pointerleave', function () { hov = 0; paint(); });
    if (!still()) setTimeout(function () { dwg.classList.add('plotted'); }, 3000);
  })();

  /* ---------- 8. Projects carousel: scroll-snap, drag with inertia, buttons, dots, keys ---------- */
  (function () {
    var car = $('.carousel'), track = car && $('.car-track', car);
    if (!track) return;
    var slides = $$('.detail', track), n = slides.length, dots = $$('.car-dot', car), prev = $('.car-prev', car), next = $('.car-next', car);
    var num = $('.car-n', car), ttl = $('.car-title', car), titles = slides.map(function (s) { var h = $('h3', s); return h ? h.textContent.trim() : ''; });
    var pos = [], cur = 0, tgt = 0, tgtAt = 0, drag = null, dragged = false, q = false;
    function measureC() {
      var max = track.scrollWidth - track.clientWidth, o = slides[0].offsetLeft;
      pos = slides.map(function (s) { return Math.min(max, s.offsetLeft - o); });
    }
    function nearest(x) { var best = 0; pos.forEach(function (p, i) { if (Math.abs(p - x) < Math.abs(pos[best] - x)) best = i; }); return best; }
    function setCur(i) {
      if (i === cur && num.textContent === String(i + 1)) return;
      cur = i;
      num.textContent = i + 1;
      if (ttl) ttl.textContent = ': ' + titles[i];
      dots.forEach(function (dt, k) { if (k === i) dt.setAttribute('aria-current', 'true'); else dt.removeAttribute('aria-current'); });
      if (prev) prev.setAttribute('aria-disabled', i === 0 ? 'true' : 'false');
      if (next) next.setAttribute('aria-disabled', i === n - 1 ? 'true' : 'false');
    }
    function go(i, keepSnapOff) {
      i = clamp(i, 0, n - 1); tgt = i; tgtAt = Date.now();
      track.scrollTo({ left: pos[i], behavior: still() ? 'auto' : 'smooth' });
      if (keepSnapOff) {
        var t, done = function () { clearTimeout(t); track.removeEventListener('scrollend', done); track.classList.remove('is-drag'); };
        if ('onscrollend' in W) track.addEventListener('scrollend', done);
        t = setTimeout(done, 750);
      }
    }
    function base() { return Date.now() - tgtAt < 700 ? tgt : cur; }
    track.addEventListener('scroll', function () {
      if (q) return; q = true;
      raf(function () { q = false; setCur(nearest(track.scrollLeft)); });
    }, { passive: true });
    if (prev) prev.addEventListener('click', function () { go(base() - 1); });
    if (next) next.addEventListener('click', function () { go(base() + 1); });
    dots.forEach(function (dt, k) { dt.addEventListener('click', function () { go(k); }); });
    car.addEventListener('keydown', function (ev) {
      if (ev.target.closest('[role="tab"]')) return;
      var k = ev.key, to = k === 'ArrowRight' ? base() + 1 : k === 'ArrowLeft' ? base() - 1 : k === 'Home' ? 0 : k === 'End' ? n - 1 : null;
      if (to === null) return;
      ev.preventDefault(); go(to);
    });
    // Mouse drag-to-scroll; touch and trackpads use native scrolling with snap.
    track.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType !== 'mouse' || ev.button !== 0) return;
      drag = { x: ev.clientX, s: track.scrollLeft, moved: false, v: 0, lx: ev.clientX, lt: ev.timeStamp, from: cur, id: ev.pointerId };
    });
    track.addEventListener('pointermove', function (ev) {
      if (!drag) return;
      var dx = ev.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 5) return;
        drag.moved = true; track.classList.add('is-drag');
        try { track.setPointerCapture(drag.id); } catch (err) {}
      }
      track.scrollLeft = drag.s - dx;
      var dt = ev.timeStamp - drag.lt;
      if (dt > 0) { drag.v = 0.7 * ((ev.clientX - drag.lx) / dt) + 0.3 * drag.v; drag.lx = ev.clientX; drag.lt = ev.timeStamp; }
    });
    function endDrag(ev) {
      if (!drag) return;
      var dr = drag; drag = null;
      if (!dr.moved) return;
      dragged = true; setTimeout(function () { dragged = false; }, 0);
      if (ev && ev.timeStamp - dr.lt > 90) dr.v = 0; // pointer rested before release: no fling
      var i = nearest(track.scrollLeft - dr.v * 260);
      if (i === dr.from && Math.abs(dr.v) > 0.35) i = dr.from + (dr.v < 0 ? 1 : -1);
      go(clamp(i, dr.from - 1, dr.from + 1), true);
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('lostpointercapture', function () { if (drag && drag.moved) endDrag(); });
    track.addEventListener('click', function (ev) { if (dragged) { ev.preventDefault(); ev.stopPropagation(); } }, true);
    track.addEventListener('dragstart', function (ev) { ev.preventDefault(); });
    W.addEventListener('resize', debounce(function () { measureC(); track.scrollLeft = pos[cur]; }, 120));
    measureC(); setCur(0);
  })();

  /* ---------- 9. How I work: long-section tabs ---------- */
  (function () {
    var tl = $('.ls-tabs'), box = $('.method');
    if (!tl || !box) return;
    var tabs = $$('[role="tab"]', tl), panels = tabs.map(function (t) { return d.getElementById(t.getAttribute('aria-controls')); }), mi = 0;
    var V = mm('(max-width: 759.98px)');
    function orient() { tl.setAttribute('aria-orientation', V.matches ? 'vertical' : 'horizontal'); }
    orient(); onMQ(V, orient);
    box.classList.add('is-tabs');
    panels.forEach(function (p, i) { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', tabs[i].id); p.tabIndex = 0; });
    function select(i, focus, animate) {
      mi = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        var on = k === mi;
        t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
        t.classList.toggle('done', k < mi);
        panels[k].hidden = !on;
        panels[k].classList.remove('is-new');
      });
      tl.style.setProperty('--p', String(mi / (tabs.length - 1)));
      if (animate && !still()) { void panels[mi].offsetWidth; panels[mi].classList.add('is-new'); }
      if (focus) tabs[mi].focus();
    }
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { if (k !== mi) select(k, false, true); }); });
    tl.addEventListener('keydown', function (ev) {
      var k = ev.key, to = k === 'ArrowRight' || k === 'ArrowDown' ? mi + 1 : k === 'ArrowLeft' || k === 'ArrowUp' ? mi - 1 : k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : null;
      if (to === null) return;
      ev.preventDefault(); select(to, true, true);
    });
    select(0);
  })();

  /* ---------- 10. Mobile menu ---------- */
  (function () {
    var nav = $('.nav'), nt = $('.nav-toggle');
    if (!nav || !nt) return;
    function setOpen(o, refocus) { nav.classList.toggle('open', o); nt.setAttribute('aria-expanded', o ? 'true' : 'false'); if (!o && refocus) nt.focus(); }
    nt.addEventListener('click', function () { setOpen(nt.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (ev) { if (ev.target.closest('a')) setOpen(false); });
    d.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && nav.classList.contains('open')) setOpen(false, true); });
    d.addEventListener('click', function (ev) { if (nav.classList.contains('open') && !nav.contains(ev.target)) setOpen(false); });
    onMQ(mm('(min-width: 900px)'), function () { setOpen(false); });
  })();

  /* ---------- 11. Section entrances ---------- */
  if ('IntersectionObserver' in W && !still()) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.band').forEach(function (b) { io.observe(b); });
  }

  measure();
})();
