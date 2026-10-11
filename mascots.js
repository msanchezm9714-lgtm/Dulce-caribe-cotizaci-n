/* =========================================================
   Dulce Caribe — Mascotas ilustradas
   Uso en HTML: <div data-m="berry" data-c="#FF4D5E"></div>
   Tipos: sun cloud heart star berry cherry lemon orange pineapple
          daisy blossom bolt cupcake cone rainbow
   ========================================================= */
(() => {
  const INK = '#2D2926', CHEEK = '#FF7AA8', LEAF = '#4ABA6F';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let uid = 0;

  /* ---------- color ---------- */
  const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v * (1 - t) + hex(b)[i] * t).toString(16).padStart(2, '0')).join('');
  const dark = (c, t = .22) => mix(c, INK, t);
  const rnd = n => (Math.random() * n).toFixed(2);

  /* ---------- piezas de dibujo ---------- */
  // Forma con contorno grueso + sombra interior abajo-derecha (+ textura opcional recortada a la forma)
  const body = (S, fill, inner = '', off = 6) => {
    const id = 'dc' + (++uid);
    return `<defs><clipPath id="${id}">${S}</clipPath></defs>
      <g fill="${INK}" stroke="${INK}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">${S}</g>
      <g clip-path="url(#${id})"><g fill="${dark(fill)}">${S}</g><g fill="${fill}" transform="translate(-${off} -${off})">${S}</g>${inner}</g>`;
  };
  const shine = (d, w = 4) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" opacity=".92"/>`;
  const dot = (x, y, r = 2.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".92"/>`;
  const spark = (x, y, s, c = '#fff') =>
    `<path class="tw" style="animation-delay:${rnd(2)}s" d="M${x} ${y - s}Q${x + s * .2} ${y - s * .2} ${x + s} ${y}Q${x + s * .2} ${y + s * .2} ${x} ${y + s}Q${x - s * .2} ${y + s * .2} ${x - s} ${y}Q${x - s * .2} ${y - s * .2} ${x} ${y - s}Z" fill="${c}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  const leaf = (d, vein) => `<path d="${d}" fill="${LEAF}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>` +
    (vein ? `<path d="${vein}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".5"/>` : '');
  const stem = (d, c = '#8A5A3A') => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
  const lines = arr => `<g fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round">${arr.map(d => `<path d="${d}"/>`).join('')}</g>`;
  // Brazo con guante blanco de caricatura
  const arm = (sx, sy, hx, hy, wave) => {
    const mx = (sx + hx) / 2 + (hy - sy) * .3, my = (sy + hy) / 2 - (hx - sx) * .3, right = hx > sx;
    const g = `<path d="M${sx} ${sy}Q${mx} ${my} ${hx} ${hy}" fill="none" stroke="${INK}" stroke-width="4.2" stroke-linecap="round"/>
      <circle cx="${hx}" cy="${hy}" r="7.6" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="${hx + (right ? -4.5 : 4.5)}" cy="${hy - 5}" rx="2.8" ry="4.4" fill="#fff" stroke="${INK}" stroke-width="2.6" transform="rotate(${right ? -28 : 28} ${hx} ${hy})"/>
      <path d="M${hx - 3} ${hy + 1.5}v3.5M${hx + 1} ${hy + 2}v3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
    return wave ? `<g class="wave${right ? '' : ' l'}" style="transform-origin:${sx}px ${sy}px;animation-delay:${rnd(1)}s">${g}</g>` : g;
  };

  /* ---------- caras ---------- */
  function face(x, y, k = 1, o = {}) {
    const ex = 10 * k, rx = 7.4 * k, ry = 9.4 * k, sw = 2.6 * k, E = o.eyes || 'round', Mo = o.mouth || 'smile';
    const pupil = cx => `<g class="pupil" data-k="${k}"><circle cx="${cx + k}" cy="${y + 1.6 * k}" r="${4.7 * k}" fill="${INK}"/><circle cx="${cx - .7 * k}" cy="${y - .5 * k}" r="${1.7 * k}" fill="#fff"/></g>`;
    const round = cx => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" stroke="${INK}" stroke-width="${sw}"/>` + pupil(cx);
    const happy = cx => `<path d="M${cx - 5.5 * k} ${y + 2 * k}Q${cx} ${y - 6 * k} ${cx + 5.5 * k} ${y + 2 * k}" fill="none" stroke="${INK}" stroke-width="${3.2 * k}" stroke-linecap="round"/>`;
    const lid = cx => round(cx) + `<path d="M${cx - rx} ${y - .4 * k}A${rx} ${ry} 0 0 1 ${cx + rx} ${y - .4 * k}Z" fill="${o.lid || '#FFD93D'}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    let eyes = '', blink = true;
    if (E === 'round') eyes = round(x - ex) + round(x + ex);
    else if (E === 'happy') { eyes = happy(x - ex) + happy(x + ex); blink = false; }
    else if (E === 'wink') eyes = round(x - ex) + happy(x + ex);
    else if (E === 'lid') eyes = lid(x - ex) + lid(x + ex);
    else if (E === 'shades') {
      blink = false;
      eyes = `<path d="M${x - ex - 9 * k} ${y - 3.5 * k}H${x + ex + 9 * k}" stroke="${INK}" stroke-width="${3 * k}" stroke-linecap="round"/>` +
        [x - ex, x + ex].map(cx => `<path d="M${cx - 8.6 * k} ${y - 4 * k}H${cx + 8.6 * k}Q${cx + 8.6 * k} ${y + 8.5 * k} ${cx} ${y + 8.5 * k}Q${cx - 8.6 * k} ${y + 8.5 * k} ${cx - 8.6 * k} ${y - 4 * k}Z" fill="${INK}" stroke="${INK}" stroke-width="${2 * k}" stroke-linejoin="round"/>` +
          `<path d="M${cx - 5 * k} ${y - 1 * k}L${cx - 1.6 * k} ${y + 3.6 * k}" stroke="#fff" stroke-width="${2 * k}" stroke-linecap="round" opacity=".85"/>`).join('');
    }
    const brows = o.brows === 'mad'
      ? `<path d="M${x - ex - 5 * k} ${y - ry - 5 * k}L${x - ex + 5 * k} ${y - ry - 1.5 * k}M${x + ex + 5 * k} ${y - ry - 5 * k}L${x + ex - 5 * k} ${y - ry - 1.5 * k}" stroke="${INK}" stroke-width="${3.2 * k}" stroke-linecap="round"/>` : '';
    const m = {
      smile: `<path d="M${x - 6 * k} ${y + 14 * k}Q${x} ${y + 21 * k} ${x + 6 * k} ${y + 14 * k}" fill="none" stroke="${INK}" stroke-width="${3 * k}" stroke-linecap="round"/>`,
      smirk: `<path d="M${x - 5 * k} ${y + 16 * k}Q${x + 2 * k} ${y + 20 * k} ${x + 8 * k} ${y + 13 * k}" fill="none" stroke="${INK}" stroke-width="${3 * k}" stroke-linecap="round"/>`,
      o: `<ellipse cx="${x}" cy="${y + 17 * k}" rx="${3.2 * k}" ry="${4 * k}" fill="${INK}"/>`,
      open: `<path d="M${x - 7 * k} ${y + 13 * k}Q${x} ${y + 15.5 * k} ${x + 7 * k} ${y + 13 * k}Q${x + 6 * k} ${y + 24 * k} ${x} ${y + 24 * k}Q${x - 6 * k} ${y + 24 * k} ${x - 7 * k} ${y + 13 * k}Z" fill="${INK}" stroke="${INK}" stroke-width="${2 * k}" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y + 21.2 * k}" rx="${3.6 * k}" ry="${2.3 * k}" fill="${CHEEK}"/>`,
      grin: `<path d="M${x - 9 * k} ${y + 12 * k}Q${x} ${y + 15 * k} ${x + 9 * k} ${y + 12 * k}Q${x + 7.5 * k} ${y + 25 * k} ${x} ${y + 25 * k}Q${x - 7.5 * k} ${y + 25 * k} ${x - 9 * k} ${y + 12 * k}Z" fill="${INK}" stroke="${INK}" stroke-width="${2 * k}" stroke-linejoin="round"/><path d="M${x - 7 * k} ${y + 13.6 * k}Q${x} ${y + 16 * k} ${x + 7 * k} ${y + 13.6 * k}L${x + 6.4 * k} ${y + 16.8 * k}Q${x} ${y + 18.8 * k} ${x - 6.4 * k} ${y + 16.8 * k}Z" fill="#fff"/><ellipse cx="${x}" cy="${y + 22 * k}" rx="${4 * k}" ry="${2.2 * k}" fill="${CHEEK}"/>`
    };
    const cheeks = o.cheeks === false ? '' :
      `<ellipse cx="${x - ex - 6 * k}" cy="${y + 10 * k}" rx="${4.4 * k}" ry="${2.7 * k}" fill="${CHEEK}" opacity=".8"/><ellipse cx="${x + ex + 6 * k}" cy="${y + 10 * k}" rx="${4.4 * k}" ry="${2.7 * k}" fill="${CHEEK}" opacity=".8"/>`;
    return cheeks + `<g class="${blink ? 'eyes' : ''}" style="animation-delay:${rnd(4)}s">${eyes}</g>` + brows + m[Mo];
  }

  const sprinkles = list => list.map(([x, y, c, a]) =>
    `<rect x="${x - 4}" y="${y - 1.7}" width="8" height="3.4" rx="1.7" fill="${c}" stroke="${INK}" stroke-width="1.3" transform="rotate(${a} ${x} ${y})"/>`).join('');
  const peel = (pts, c, t = .3, r = 1.4) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${dark(c, t)}"/>`).join('');

  /* ---------- catálogo ---------- */
  const M = {
    sun(c = '#FFD93D', c2 = '#FF8A3D') {
      let r = '';
      for (let i = 0; i < 16; i++) { const L = i % 2 ? 10 : 18; r += `<path d="M45 25L55 25L50 ${25 - L}Z" transform="rotate(${i * 22.5} 50 50)"/>`; }
      return `<g class="spinr">${body(r, c2, '', 0)}</g>` + body('<circle cx="50" cy="50" r="27"/>', c) +
        shine('M30 46Q31 34 41 29') + dot(29, 54, 1.9) + face(50, 50, .88, { mouth: 'open' });
    },
    cloud(c = '#6595F9') {
      const S = '<circle cx="28" cy="62" r="17"/><circle cx="50" cy="46" r="24"/><circle cx="74" cy="58" r="19"/><rect x="26" y="56" width="52" height="24" rx="12"/>';
      return body(S, c) + shine('M34 40Q38 30 48 27') + dot(29, 52) + face(52, 58, .85) + spark(92, 30, 6, '#FFD93D') + spark(8, 36, 4.5);
    },
    heart(c = '#FF5A4F') {
      return body('<path d="M50 90C8 62 4 34 24 22C37 15 48 23 50 33C52 23 63 15 76 22C96 34 92 62 50 90Z"/>', c) +
        shine('M19 42Q19 29 30 25') + dot(21, 50, 2) + face(50, 48, .9, { mouth: 'grin' }) + spark(92, 14, 6.5, '#FFD93D') + spark(8, 12, 5);
    },
    star(c = '#FFD93D') {
      return arm(29, 62, 12, 78, false) + arm(71, 60, 94, 54, true) +
        body('<polygon points="50,6 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36"/>', c) +
        shine('M45 21L49 13') + shine('M30 42L38 41', 3.5) + face(50, 52, .72, { eyes: 'lid', lid: c, mouth: 'smirk' }) +
        spark(96, 14, 6.5) + spark(6, 18, 5, '#FB66E5');
    },
    berry(c = '#FF4D5E') {
      const S = '<path d="M50 94C22 80 12 54 16 40C20 28 34 26 50 30C66 26 80 28 84 40C88 54 78 80 50 94Z"/>';
      const seeds = [[26, 46], [74, 46], [22, 60], [78, 60], [32, 77], [68, 77], [50, 88], [37, 38], [63, 38]]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="3.5" fill="#FFE9A8" stroke="${INK}" stroke-width="1.4" transform="rotate(${(x - 50) * .8} ${x} ${y})"/>`).join('');
      let lv = ''; [-66, -33, 0, 33, 66].forEach(a => lv += `<ellipse cx="50" cy="18" rx="6.5" ry="12" transform="rotate(${a} 50 30)"/>`);
      return arm(18, 58, 3, 44, true) + arm(82, 60, 95, 72, false) + body(S, c) + seeds + body(lv, LEAF, '', 3) +
        stem('M50 19Q51 10 57 5', LEAF) + shine('M23 45Q24 37 30 34') + face(50, 58, .8, { mouth: 'open' });
    },
    cherry(c = '#E5322D') {
      const one = (x, y, o) => body(`<circle cx="${x}" cy="${y}" r="20"/>`, c) + shine(`M${x - 13} ${y - 3}Q${x - 12} ${y - 13} ${x - 3} ${y - 15}`, 3.5) + face(x, y + 1, .62, o);
      return stem('M30 54Q34 28 58 10', LEAF) + stem('M70 54Q66 30 58 10', LEAF) +
        leaf('M58 10Q72 -4 92 8Q74 22 58 10Z', 'M61 10Q75 6 88 8') +
        one(30, 72, { mouth: 'smile' }) + one(70, 72, { eyes: 'wink', mouth: 'open' }) + spark(94, 40, 5, '#FFD93D');
    },
    lemon(c = '#FFE14D') {
      const S = '<path d="M4 50Q8 42 16 38Q30 22 50 22Q70 22 84 38Q92 42 96 50Q92 58 84 62Q70 78 50 78Q30 78 16 62Q8 58 4 50Z"/>';
      return body(S, c, peel([[28, 33], [72, 33], [20, 60], [80, 60], [38, 72], [62, 72], [50, 27]], c, .35)) +
        leaf('M66 24Q74 4 94 6Q90 24 66 24Z', 'M70 21Q80 12 90 9') + shine('M17 45Q23 33 35 28') +
        face(50, 50, .9, { eyes: 'shades', mouth: 'grin' }) + spark(8, 22, 5);
    },
    orange(c = '#FF8A3D') {
      return body('<circle cx="50" cy="58" r="35"/>', c, peel([[30, 44], [70, 44], [26, 70], [74, 70], [50, 86], [40, 30], [62, 31]], c)) +
        stem('M50 24Q50 15 54 11') + leaf('M53 19Q61 1 82 5Q78 24 53 19Z', 'M57 17Q67 9 78 7') +
        shine('M23 52Q25 37 37 30') + dot(23, 62) + face(50, 60, .95, { mouth: 'grin' });
    },
    pineapple(c = '#FFB627') {
      let grid = ''; for (let i = -4; i <= 4; i++) grid += `<path d="M${30 + i * 12} 30L${70 + i * 12} 100M${70 - i * 12} 30L${30 - i * 12} 100"/>`;
      let crown = ''; [-42, -20, 0, 20, 42].forEach((a, i) => crown += `<ellipse cx="50" cy="${i === 2 ? 11 : 15}" rx="6" ry="${i === 2 ? 16 : 13}" transform="rotate(${a} 50 34)"/>`);
      return body(crown, LEAF, '', 3) +
        body('<ellipse cx="50" cy="64" rx="27" ry="31"/>', c, `<g stroke="${dark(c, .45)}" stroke-width="2" opacity=".55">${grid}</g>`) +
        shine('M29 52Q30 41 37 36') + face(50, 64, .82, { mouth: 'open' }) + spark(90, 26, 5.5) + spark(10, 46, 4.5, '#FB66E5');
    },
    daisy(c = '#ffffff') {
      let p = '', cr = '';
      for (let i = 0; i < 12; i++) { p += `<ellipse cx="50" cy="19" rx="8.5" ry="16" transform="rotate(${i * 30} 50 50)"/>`; cr += `<path d="M50 9L50 21" transform="rotate(${i * 30} 50 50)"/>`; }
      return `<g class="spinr slow">${body(p, c, `<g stroke="${INK}" stroke-width="1.8" stroke-linecap="round" opacity=".22">${cr}</g>`, 3)}</g>` +
        body('<circle cx="50" cy="50" r="21"/>', '#FFD93D') + shine('M36 45Q37 37 44 34', 3) + face(50, 51, .72, { mouth: 'grin' });
    },
    blossom(c = '#FF9BD8') {
      let p = '', hl = '';
      for (let i = 0; i < 5; i++) { p += `<circle cx="50" cy="26" r="17" transform="rotate(${i * 72} 50 50)"/>`; hl += `<path d="M43 17Q47 12 54 13" transform="rotate(${i * 72} 50 50)"/>`; }
      return `<g class="spinr slow">${body(p, c, `<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85">${hl}</g>`, 4)}</g>` +
        body('<circle cx="50" cy="50" r="16"/>', '#FFD93D') + face(50, 50, .56, { mouth: 'open' }) + spark(92, 12, 5.5, '#FFD93D');
    },
    bolt(c = '#6595F9') {
      return lines(['M8 30L19 34', 'M4 44L15 46', 'M92 66L81 62']) +
        body('<polygon points="60,4 20,58 46,58 36,96 82,38 56,38"/>', c) + shine('M53 14L41 31', 3.5) +
        face(53, 49, .52, { brows: 'mad', mouth: 'grin', cheeks: false }) + spark(92, 12, 6.5, '#FFD93D') + spark(16, 84, 4.5);
    },
    cupcake(c = '#FB66E5') {
      const pleats = `<g stroke="${INK}" stroke-width="2.2" opacity=".3">${[30, 40, 50, 60, 70].map(x => `<line x1="${x}" y1="58" x2="${50 + (x - 50) * .75}" y2="96"/>`).join('')}</g>`;
      const F = '<circle cx="30" cy="52" r="13"/><circle cx="70" cy="52" r="13"/><circle cx="50" cy="44" r="19"/><circle cx="38" cy="34" r="11"/><circle cx="62" cy="34" r="11"/><circle cx="50" cy="25" r="12"/>';
      return body('<path d="M22 58L78 58L70 95L30 95Z"/>', '#2EC4B6', pleats) + body(F, c) + shine('M28 44Q30 34 37 29', 3.5) +
        sprinkles([[36, 45, '#6595F9', 30], [63, 47, '#FFD93D', -40], [45, 33, '#ffffff', 60], [58, 25, LEAF, -20], [27, 56, '#FFD93D', 10], [73, 55, '#6595F9', -60], [50, 52, '#ffffff', -30]]) +
        stem('M52 9Q54 3 60 0', LEAF) + body('<circle cx="50" cy="13" r="6.5"/>', '#E5322D', '', 2) + dot(48, 11, 1.5) +
        face(50, 73, .64, { mouth: 'open' }) + spark(92, 20, 5.5, '#FFD93D');
    },
    cone(c = '#FB66E5') {
      let grid = ''; for (let i = 0; i < 6; i++) grid += `<path d="M${22 + i * 10} 50L${52 + i * 10} 100M${78 - i * 10} 50L${48 - i * 10} 100"/>`;
      const S = '<path d="M20 50C18 24 34 12 50 12C66 12 82 24 80 50C80 57 75 59 73 54C71 63 64 63 62 56C59 65 51 65 49 57C46 64 39 63 37 56C33 61 22 60 20 50Z"/>';
      return body('<path d="M30 54L70 54L50 98Z"/>', '#F2A65A', `<g stroke="${dark('#F2A65A', .5)}" stroke-width="2">${grid}</g>`) +
        body(S, c) + shine('M27 38Q29 26 37 21', 3.5) +
        sprinkles([[36, 21, '#6595F9', 30], [64, 22, '#FFD93D', -40], [48, 17, '#ffffff', 70], [26, 30, LEAF, -20], [74, 31, '#ffffff', 40]]) +
        stem('M58 6Q60 0 66 -2', LEAF) + body('<circle cx="56" cy="10" r="6"/>', '#E5322D', '', 2) + face(50, 34, .78, { mouth: 'grin' });
    },
    rainbow() {
      const arc = (r, col, w) => `<path d="M${50 - r} 78A${r} ${r} 0 0 1 ${50 + r} 78" fill="none" stroke="${col}" stroke-width="${w}"/>`;
      return arc(32, INK, 35) + arc(40, '#FF5A4F', 6.6) + arc(32, '#FFD93D', 6.6) + arc(24, '#2EC4B6', 6.6) + shine('M20 62Q22 50 28 44', 2.6) +
        body('<circle cx="16" cy="80" r="12"/><circle cx="30" cy="83" r="10"/><circle cx="84" cy="80" r="12"/><circle cx="70" cy="83" r="10"/><circle cx="50" cy="78" r="15"/><circle cx="38" cy="85" r="9"/><circle cx="62" cy="85" r="9"/>', '#ffffff') +
        face(50, 77, .55, { eyes: 'happy', mouth: 'open' }) + spark(90, 28, 6, '#FFD93D') + spark(10, 34, 4.5, '#FB66E5');
    }
  };

  /* ---------- montar ---------- */
  document.querySelectorAll('[data-m]').forEach(el => {
    const fn = M[el.dataset.m]; if (!fn) return;
    el.innerHTML = `<svg class="mascot" viewBox="-8 -8 116 116" aria-hidden="true" focusable="false">${fn(el.dataset.c || undefined, el.dataset.c2 || undefined)}</svg>`;
    const s = el.firstChild;
    s.addEventListener('click', () => { s.classList.remove('jump'); void s.getBoundingClientRect(); s.classList.add('jump'); });
    s.addEventListener('animationend', e => { if (e.animationName === 'jump') s.classList.remove('jump'); });
  });

  /* ---------- ojos que siguen el cursor / miran alrededor en celular ---------- */
  const svgs = [...document.querySelectorAll('.mascot')];
  const setLook = (s, dx, dy) => s.querySelectorAll('.pupil').forEach(p => { const k = +p.dataset.k; p.style.transform = `translate(${dx * k}px,${dy * k}px)`; });
  let px = 0, py = 0, pend = false;
  const look = () => {
    pend = false;
    svgs.forEach(s => {
      const r = s.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2), a = Math.atan2(dy, dx), d = Math.min(1, Math.hypot(dx, dy) / 220) * 2.6;
      setLook(s, Math.cos(a) * d, Math.sin(a) * d);
    });
  };
  addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; px = e.clientX; py = e.clientY; if (!pend) { pend = true; requestAnimationFrame(look); } }, { passive: true });
  if (!reduce && !matchMedia('(hover: hover)').matches) {
    setInterval(() => svgs.forEach(s => { if (Math.random() < .35) { const a = Math.random() * Math.PI * 2; setLook(s, Math.cos(a) * 2.4, Math.sin(a) * 2.4); } }), 1600);
  }
})();
