/* =========================================================
   Dulce Caribe — Animaciones de scroll y acomodo de mascotas
   ========================================================= */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mobile = () => innerWidth < 760;

  /* ---------- aparición al entrar en pantalla ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('.rv, .tl').forEach(el => io.observe(el));

  /* ---------- contadores ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const to = +e.target.dataset.count, t0 = performance.now();
    (function f(t) { const p = Math.min((t - t0) / 1100, 1); e.target.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
  }), { threshold: .6 });
  if (!reduce) $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- progreso + parallax suave ---------- */
  const bar = document.getElementById('bar');
  const fls = $$('.fl');
  const amp = () => mobile() ? 8 : 14;          // desplazamiento máximo del parallax (px)
  let ticking = false;
  function frame() {
    ticking = false;
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    if (reduce) return;
    const A = amp(), vh = innerHeight;
    fls.forEach(el => {
      const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return;
      const p = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2)));
      el.style.transform = `translate3d(0,${(p * A * Math.sign(+el.dataset.speed || 1)).toFixed(1)}px,0)`;
    });
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });

  /* ---------- composición del inicio (PC): profundidad con mouse + scroll ---------- */
  const art = $$('.hero-art .a');
  let mx = 0, my = 0, artT = false;
  const moveArt = () => {
    artT = false;
    const sy = Math.min(scrollY, innerHeight);
    art.forEach(a => { const d = +a.dataset.depth || 0; a.style.transform = `translate3d(${(mx * d * 14).toFixed(1)}px,${(my * d * 14 - sy * d * .06).toFixed(1)}px,0)`; });
  };
  if (!reduce && art.length) {
    addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; if (!artT) { artT = true; requestAnimationFrame(moveArt); } }, { passive: true });
    addEventListener('scroll', () => { if (!artT && scrollY < innerHeight * 1.2) { artT = true; requestAnimationFrame(moveArt); } }, { passive: true });
  }

  /* ---------- acomodo: ninguna mascota encima de texto ---------- */
  const OBST = 'h1,h2,h3,p,li,footer,.eyebrow,.btn,.card,.dots,.q,.chip,.tag,.big25,.coin,.sum,.fine,.incl,.mi,.avatars,.qr,.scroll-hint,.marq,.hero-art';
  const rectsOf = el => {
    if (/^(H2|H3|P|LI)$/.test(el.tagName)) { const rg = document.createRange(); rg.selectNodeContents(el); return [...rg.getClientRects()]; }
    return [el.getBoundingClientRect()];
  };
  const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

  function place() {
    const root = document.documentElement;
    root.classList.add('measuring');                 // mide sin transformaciones de entrada
    fls.forEach(el => { el.classList.remove('off'); el.style.top = el.style.left = el.style.right = el.style.bottom = el.style.width = ''; el.style.transform = 'none'; });

    const obst = [];
    $$(OBST).forEach(el => { if (el.closest('.fl')) return; rectsOf(el).forEach(r => { if (r.width && r.height) obst.push(r); }); });
    const A = amp(), gap = mobile() ? 6 : 12, pad = mobile() ? 10 : 20;
    const navB = document.querySelector('.nav').getBoundingClientRect().bottom + 8;
    const placed = [];

    fls.forEach(el => {
      if (!el.offsetParent) return;                  // oculto por breakpoint
      const secEl = el.parentElement, sec = secEl.getBoundingClientRect();
      const minTop = sec.top + (secEl.id === 'hero' ? navB : 0);
      const free = r => {
        if (r.left < 4 || r.right > innerWidth - 4) return false;
        if (r.top - A < minTop || r.bottom + A > sec.bottom) return false;
        const R = { left: r.left - gap, right: r.right + gap, top: r.top - gap - A, bottom: r.bottom + gap + A };
        return !obst.some(o => hit(R, o)) && !placed.some(o => hit(R, o));
      };
      let r = el.getBoundingClientRect();
      if (!free(r)) {
        // busca el hueco libre más cercano; si no cabe, prueba más pequeña antes de ocultarla
        const W = r.width, x0 = r.left, y0 = r.top, rightSide = x0 + W / 2 > innerWidth / 2, lowHalf = y0 - sec.top > sec.height / 2;
        let f = null;
        for (const k of [1, .82, .66]) {
          const w = W * k, h = w, ax = rightSide ? x0 + W - w : x0, ay = lowHalf ? y0 + W - h : y0, cand = [];
          const xs = [ax, sec.left + pad, sec.right - pad - w];
          for (let y = minTop + A + 2; y <= sec.bottom - h - A - 2; y += 14) xs.forEach(x => cand.push([x, y]));
          cand.sort((a, b) => (Math.abs(a[0] - ax) + Math.abs(a[1] - ay)) - (Math.abs(b[0] - ax) + Math.abs(b[1] - ay)));
          const c = cand.find(([x, y]) => free({ left: x, top: y, right: x + w, bottom: y + h }));
          if (c) { f = [c[0], c[1], w]; break; }
        }
        if (!f) { el.classList.add('off'); return; }
        el.style.width = f[2] + 'px';
        el.style.left = (f[0] - sec.left) + 'px'; el.style.top = (f[1] - sec.top) + 'px';
        el.style.right = el.style.bottom = 'auto';
        r = { left: f[0], top: f[1], right: f[0] + f[2], bottom: f[1] + f[2] };
      }
      placed.push(r);
    });
    root.classList.remove('measuring');
    frame();
  }

  let lastW = innerWidth, rt;
  addEventListener('resize', () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(place, 180); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(place);
  addEventListener('load', place);
  frame();
})();
