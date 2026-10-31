// Plano isométrico de la oficina, construido en código (antes era un export generado).
import { DESKS } from './look';

export const SW = 1180, SH = 690;
const OX = 490, OY = 80, KX = 0.7, KY = 0.35, ZK = 0.9;
type Pt = [number, number];
const P = (x: number, y: number, z = 0): Pt => [OX + (x - y) * KX, OY + (x + y) * KY - z * ZK];
const f1 = (n: number) => n.toFixed(1);
const pt = (p: Pt) => f1(p[0]) + ',' + f1(p[1]);
const poly = (pts: Pt[], fill: string, extra = '') => `<polygon points="${pts.map(pt).join(' ')}" fill="${fill}" ${extra}/>`;

function shade(c: string, f: number) {
  c = c.replace('#', '');
  if (c.length === 3) c = c.split('').map((ch) => ch + ch).join('');
  const v = [0, 2, 4].map((i) => Math.max(0, Math.min(255, Math.floor(parseInt(c.slice(i, i + 2), 16) * f))));
  return '#' + v.map((n) => n.toString(16).padStart(2, '0')).join('');
}

function box(x: number, y: number, w: number, d: number, h: number, c: string, z0 = 0, stroke = true) {
  const top = [P(x, y, z0 + h), P(x + w, y, z0 + h), P(x + w, y + d, z0 + h), P(x, y + d, z0 + h)];
  const fy = [P(x, y + d, z0), P(x + w, y + d, z0), P(x + w, y + d, z0 + h), P(x, y + d, z0 + h)];
  const fx = [P(x + w, y, z0), P(x + w, y + d, z0), P(x + w, y + d, z0 + h), P(x + w, y, z0 + h)];
  const st = stroke ? `stroke="${shade(c, 0.6)}" stroke-width="0.6" stroke-linejoin="round"` : '';
  return poly(fy, shade(c, 0.82), st) + poly(fx, shade(c, 0.66), st) + poly(top, c, st);
}

function bbox(x: number, y: number, w: number, d: number, h: number, pad = 3, up = 0) {
  const ps: Pt[] = [];
  [x, x + w].forEach((a) => [y, y + d].forEach((b) => [0, h].forEach((z) => ps.push(P(a, b, z)))));
  const xs = ps.map((p) => p[0]), ys = ps.map((p) => p[1]);
  const mx = Math.min(...xs), my = Math.min(...ys);
  return [mx - pad, my - pad - up, Math.max(...xs) - mx + 2 * pad, Math.max(...ys) - my + 2 * pad + up];
}

const ents: [number, string][] = [];
function entity(bb: number[], inner: string, z: number) {
  const [bx, by, bw, bh] = bb;
  const zi = Math.floor(z) + 1000;
  ents.push([zi, `<div style="position:absolute;left:${(bx / SW * 100).toFixed(3)}%;top:${(by / SH * 100).toFixed(3)}%;width:${(bw / SW * 100).toFixed(3)}%;z-index:${zi};pointer-events:none"><svg viewBox="${f1(bx)} ${f1(by)} ${f1(bw)} ${f1(bh)}" style="display:block;width:100%;height:auto;overflow:visible" aria-hidden="true">${inner}</svg></div>`]);
}

const rectf = (x: number, y: number, w: number, h: number, fill: string, extra = '') => poly([P(x, y), P(x + w, y), P(x + w, y + h), P(x, y + h)], fill, extra);
function grid(x: number, y: number, w: number, h: number, step = 30) {
  let s = '';
  for (let i = 0; i <= w; i += step) { const a = P(x + i, y), b = P(x + i, y + h); s += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`; }
  for (let j = 0; j <= h; j += step) { const a = P(x, y + j), b = P(x + w, y + j); s += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`; }
  return `<g stroke="#000" stroke-opacity="0.07" stroke-width="0.8">${s}</g>`;
}
const shadow = (x: number, y: number, w: number, d: number, h: number) => {
  const k = h * 0.5;
  return poly([P(x + w, y), P(x + w + k, y + k), P(x + w + k, y + d + k), P(x + k, y + d + k), P(x, y + d)], '#000', 'opacity="0.14"');
};
const planeX = (x: number, y1: number, y2: number, z1: number, z2: number, fill: string, extra = '') => poly([P(x, y1, z1), P(x, y2, z1), P(x, y2, z2), P(x, y1, z2)], fill, extra);
const planeY = (y: number, x1: number, x2: number, z1: number, z2: number, fill: string, extra = '') => poly([P(x1, y, z1), P(x2, y, z1), P(x2, y, z2), P(x1, y, z2)], fill, extra);

function plant(x: number, y: number, r = 11) {
  const p = P(x, y, 0);
  return shadow(x - 6, y - 6, 12, 12, 12) + box(x - 6, y - 6, 12, 12, 10, '#C0714C') +
    `<g class="sway" style="transform-origin:${f1(p[0])}px ${f1(p[1])}px"><ellipse cx="${f1(p[0])}" cy="${f1(p[1] - 20)}" rx="${r}" ry="${r + 4}" fill="#3F8F52"/><ellipse cx="${f1(p[0] - 3)}" cy="${f1(p[1] - 26)}" rx="${Math.floor(r / 2) + 2}" ry="${Math.floor(r / 2) + 4}" fill="#5FB16F"/></g>`;
}

function deskEntity(id: string, cx: number, cy: number, w: number) {
  const x = cx - Math.floor(w / 2), y = cy - 4, d = 34, h = 24;
  const bb = bbox(x, y, w, d, h, 4, 34);
  let s = box(x, y, w, d, h, '#C8975F');
  const mon = (mx: number, my: number, mw: number, content: (mx: number, my: number, mw: number, z0: number, hh: number) => string) => {
    const f = [P(mx, my + 3, h + 3), P(mx + mw, my + 3, h + 3), P(mx + mw, my + 3, h + 22), P(mx, my + 3, h + 22)];
    return box(mx, my, mw, 3, 22, '#2A3342', h) + poly(f, '#0F1A2E') + content(mx, my + 3.2, mw, h + 3, 19);
  };
  const lines = (cols: [number, string][]) => (mx: number, my: number, mw: number, z0: number, hh: number) => cols.map(([lw, c], i) => {
    const p1 = P(mx + 3, my, z0 + hh - 4 - i * 3.4), p2 = P(mx + 3 + lw, my, z0 + hh - 4 - i * 3.4);
    return `<line x1="${f1(p1[0])}" y1="${f1(p1[1])}" x2="${f1(p2[0])}" y2="${f1(p2[1])}" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`;
  }).join('');
  const chart = (mx: number, my: number, mw: number, z0: number) => {
    const ps = [3, 6, 5, 9, 8, 12, 11].map((v, i) => P(mx + 3 + i * (mw - 6) / 6, my, z0 + 4 + v));
    const l = ps[ps.length - 1];
    return `<polyline points="${ps.map(pt).join(' ')}" fill="none" stroke="#5BE3B0" stroke-width="1.6"/><circle cx="${f1(l[0])}" cy="${f1(l[1])}" r="1.6" fill="#FF8A7A"/>`;
  };
  const dots = (mx: number, my: number, mw: number, z0: number) => {
    let o = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const p = P(mx + 4 + c * (mw - 8) / 3, my, z0 + 4 + r * 5); o += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="1.5" fill="${['#5BE3B0', '#5BE3B0', '#FFB547', '#5BE3B0'][(r + c) % 4]}"/>`; }
    return o;
  };
  const design = (mx: number, my: number, mw: number, z0: number) => {
    let o = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const x1 = mx + 3 + c * (mw - 6) / 4, x2 = mx + 3 + (c + 0.8) * (mw - 6) / 4, zb = z0 + 3 + r * 5;
      o += `<polygon points="${pt(P(x1, my, zb))} ${pt(P(x2, my, zb))} ${pt(P(x2, my, zb + 3.6))} ${pt(P(x1, my, zb + 3.6))}" fill="${['#F2C94C', '#D6568F', '#4A6FD6', '#2FB89A'][(r * 2 + c) % 4]}"/>`;
    }
    return o;
  };
  const mx = x + w - 40, my = y + 6;
  if (id === 'laia') s += mon(mx, my, 26, chart);
  else if (id === 'biel') {
    s += mon(x + 4, my, 26, lines([[14, '#7FD6FF'], [18, '#FFB547'], [10, '#5BE3B0'], [16, '#D6568F'], [12, '#7FD6FF']]));
    s += mon(x + 36, my, 26, lines([[18, '#5BE3B0'], [10, '#7FD6FF'], [16, '#FFB547'], [12, '#D6568F'], [15, '#5BE3B0']]));
  } else if (id === 'julia') {
    s += mon(mx, my, 26, design);
    ['#FFD66B', '#FF9C8A', '#9BE3A6'].forEach((c, k) => { s += box(x + 6 + k * 9, y + 20, 7, 7, 0.8, c, h, false); });
  } else if (id === 'alex') {
    s += mon(mx, my, 26, dots) + box(x + 8, y + 8, 12, 12, 12, '#3B4558', h);
    for (let k = 0; k < 3; k++) { const p = P(x + 20, y + 10 + k * 3, h + 9); s += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="1.1" fill="${['#5BE3B0', '#FFB547', '#5BE3B0'][k]}" class="led" style="animation-delay:${(k * 0.5).toFixed(1)}s"/>`; }
  } else if (id === 'marta') {
    s += mon(mx, my, 30, lines([[18, '#E8EEF7'], [12, '#E8EEF7'], [20, '#FFB547'], [14, '#E8EEF7']])) + box(x + 8, y + 10, 18, 7, 3, '#fff', h) + box(x + 34, y + 20, 16, 3.5, 5, '#2A3342', h);
  } else if (id === 'pau') {
    s += box(x + 8, y + 8, 22, 3, 26, '#F4F1EA', h);
    const q = P(x + 19, y + 11.5, h + 14);
    s += `<text x="${f1(q[0])}" y="${f1(q[1] + 4)}" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="12" font-weight="700" fill="#D6568F">?</text>`;
  } else if (id === 'nuria') {
    const c = P(x + 20, y + 14, h + 7);
    s += `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="8" ry="7" fill="#fff" stroke="#2A3342" stroke-width="1.6"/><line x1="${f1(c[0])}" y1="${f1(c[1])}" x2="${f1(c[0] + 3)}" y2="${f1(c[1] - 3)}" stroke="#2A3342" stroke-width="1.2"/><line x1="${f1(c[0])}" y1="${f1(c[1])}" x2="${f1(c[0] - 1)}" y2="${f1(c[1] - 4)}" stroke="#2A3342" stroke-width="1.2"/>`;
  } else if (id === 'oriol') {
    const c = P(x + 20, y + 14, h + 5);
    s += `<path d="M${f1(c[0] - 8)} ${f1(c[1])} q8 -14 16 0" fill="none" stroke="#2A3342" stroke-width="2.2"/><circle cx="${f1(c[0] - 8)}" cy="${f1(c[1])}" r="3" fill="#2A3342"/><circle cx="${f1(c[0] + 8)}" cy="${f1(c[1])}" r="3" fill="#2A3342"/>`;
  }
  s += box(x + w / 2 - 12, y + d - 12, 24, 9, 1.6, '#CFD6E4', h);
  entity(bb, s, x + w / 2 + y + d / 2);
}

export function buildScene() {
  ents.length = 0;
  let st = '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE3FF"/><stop offset="1" stop-color="#E7F4FF"/></linearGradient>';
  for (let i = 0; i < 7; i++) st += `<radialGradient id="lg${i}"><stop offset="0" stop-color="#FFE9A8" stop-opacity="0.95"/><stop offset="0.5" stop-color="#FFD27A" stop-opacity="0.35"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient>`;
  st += '</defs>';
  st += `<rect width="${SW}" height="${SH}" fill="#0C1624"/>`;
  [[P(10, 670, 0), P(950, 670, 0), P(950, 670, -14), P(10, 670, -14), '#8A7F6C'], [P(950, 10, 0), P(950, 670, 0), P(950, 670, -14), P(950, 10, -14), '#6F6656']].forEach((q: any) => { st += poly([q[0], q[1], q[2], q[3]], q[4]); });
  ([[10, 10, 250, 200, '#E8D8C0'], [260, 10, 300, 200, '#D9DCE3'], [560, 10, 390, 200, '#EFE3CB'], [10, 210, 940, 25, '#D8D1C2'], [10, 235, 470, 435, '#DDE8D6'], [480, 235, 470, 435, '#D5DFEF']] as any[]).forEach(([x, y, w, h, c]) => { st += rectf(x, y, w, h, c) + grid(x, y, w, h); });
  st += rectf(70, 150, 120, 50, '#B7503C', 'opacity="0.35"');
  st += rectf(20, 440, 235, 215, '#C9D8C0', 'stroke="#8FA886" stroke-width="1.5" stroke-dasharray="5 5"');
  st += rectf(290, 545, 170, 110, '#C7B5D6', 'opacity="0.5"');
  st += rectf(930, 205, 20, 30, '#7B6A55');
  const WH = 56;
  st += box(4, 4, 6, 676, WH, '#E9ECF2') + box(4, 4, 952, 6, WH, '#E9ECF2');
  [[260, 340], [380, 460], [500, 580], [40, 100], [120, 190]].forEach(([a, b]) => { st += planeX(10, a, b, 16, 46, 'url(#sky)', 'stroke="#9BA6BD" stroke-width="1.2"'); });
  [[300, 360], [440, 500], [600, 680], [720, 800], [840, 920]].forEach(([a, b]) => { st += planeY(10, a, b, 16, 46, 'url(#sky)', 'stroke="#9BA6BD" stroke-width="1.2"'); });
  st += planeY(10, 340, 480, 18, 40, '#222B3D', 'stroke="#11182A"') + planeY(10, 350, 470, 22, 36, '#2F4B7A', 'opacity="0.85"');
  st += box(11, 22, 10, 92, 52, '#9A6C44');
  for (let k = 0; k < 3; k++) {
    st += planeX(21, 26, 110, 10 + k * 14, 20 + k * 14, '#C99B66');
    for (let j = 0; j < 8; j++) st += planeX(21, 30 + j * 10, 36 + j * 10, 11 + k * 14, 19 + k * 14, ['#D6568F', '#4A6FD6', '#F2C94C', '#2FB89A'][(j + k) % 4]);
  }
  st += shadow(580, 11, 170, 26, 22) + box(580, 11, 170, 26, 24, '#A5AAB5') + box(690, 14, 22, 14, 14, '#2A3342', 24) + box(760, 11, 26, 28, 64, '#C9D3DF');
  [0, 7, 14].forEach((dx) => { const p = P(695 + dx, 20, 40); st += `<path d="M${f1(p[0])},${f1(p[1])} q-3,-6 0,-12 q3,-6 0,-12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" class="steam" style="animation-delay:${(dx / 7 * 0.6).toFixed(1)}s"/>`; });
  [[350, 54], [410, 54], [470, 54], [350, 150], [410, 150], [470, 150], [308, 100], [512, 100]].forEach(([x, y]) => { st += shadow(x - 7, y - 7, 14, 14, 9) + box(x - 7, y - 7, 14, 14, 9, '#4B5A7A'); });
  st += box(150, 448, 60, 12, 14, '#2A2F3E');
  for (let k = 0; k < 3; k++) { const p = P(160 + k * 18, 450, 18); st += `<ellipse cx="${f1(p[0])}" cy="${f1(p[1])}" rx="4" ry="2.2" fill="#111"/>`; }
  [[236, 30], [30, 190], [932, 32], [455, 640], [30, 250], [935, 250], [500, 250]].forEach(([x, y]) => { st += plant(x, y, 11); });
  const a0 = P(950, 208, 0), a1 = P(950, 208, 40), b0 = P(950, 236, 0), b1 = P(950, 236, 40);
  st += `<line x1="${f1(a0[0])}" y1="${f1(a0[1])}" x2="${f1(a1[0])}" y2="${f1(a1[1])}" stroke="#2A3A57" stroke-width="5"/><line x1="${f1(b0[0])}" y1="${f1(b0[1])}" x2="${f1(b1[0])}" y2="${f1(b1[1])}" stroke="#2A3A57" stroke-width="5"/>`;

  Object.keys(DESKS).forEach((id) => {
    const [cx, cy, w] = DESKS[id];
    st += shadow(cx - Math.floor(w / 2), cy - 4, w, 34, 24);
    st += box(cx - 16, cy - 21, 16, 14, 9, '#3A465E');
    deskEntity(id, cx, cy, w);
  });
  // mesa de pie de Dani
  st += shadow(165, 560, 60, 26, 26);
  { const w_ = P(185, 566, 26);
    entity(bbox(165, 560, 60, 26, 26, 4, 18), box(165, 560, 60, 26, 26, '#B9C1CF') + `<circle cx="${f1(w_[0])}" cy="${f1(w_[1])}" r="5.5" fill="#222B3D"/><circle cx="${f1(w_[0])}" cy="${f1(w_[1])}" r="3.4" fill="#0F1A2E"/><circle cx="${f1(w_[0])}" cy="${f1(w_[1])}" r="1.3" fill="#5BE3B0"/>` + box(205, 568, 6, 6, 16, '#4A9BE8', 26), 165 + 30 + 560 + 13); }
  // cinta de correr
  st += shadow(68, 470, 54, 80, 12);
  entity(bbox(68, 470, 54, 80, 14, 4, 26), box(68, 470, 54, 80, 10, '#3A4256') + poly([P(74, 476, 10), P(116, 476, 10), P(116, 544, 10), P(74, 544, 10)], '#5A647C') + box(70, 470, 50, 6, 40, '#2A2F3E'), 95 + 510 - 30);
  entity(bbox(150, 604, 86, 22, 10, 4), box(150, 604, 86, 22, 12, '#4B5A7A'), 193 + 615);
  st += shadow(318, 76, 184, 64, 22);
  entity(bbox(318, 76, 184, 64, 18, 4), box(318, 76, 184, 64, 18, '#8E6B4B'), 410 + 108);
  st += shadow(300, 560, 150, 36, 18);
  entity(bbox(300, 560, 150, 36, 22, 4, 6), box(300, 560, 150, 36, 14, '#8AA7B5') + box(300, 560, 150, 8, 22, '#7592A1'), 375 + 578);
  entity(bbox(335, 615, 80, 26, 12, 3), box(335, 615, 80, 26, 10, '#B98A5B'), 375 + 628);
  st += shadow(860, 168, 84, 28, 16);
  entity(bbox(860, 168, 84, 28, 20, 4), box(860, 168, 84, 28, 12, '#8AA7B5') + box(860, 168, 84, 7, 20, '#7592A1'), 902 + 182);
  [[630, 100], [780, 100]].forEach(([x, y]) => { st += shadow(x, y, 44, 44, 22); entity(bbox(x, y, 44, 44, 22, 4), box(x, y, 44, 44, 22, '#C79E6B'), x + 22 + y + 22); });
  for (let i = 0; i < 5; i++) {
    const x = 804 + i * 27;
    st += shadow(x, 606, 22, 24, 50);
    let s = box(x, 606, 22, 24, 52, '#2A3342');
    for (let j = 0; j < 4; j++) {
      const p = P(x + 4, 630, 10 + j * 11);
      s += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="1.5" fill="${['#5BE3B0', '#FFB547', '#5BE3B0', '#7FD6FF'][j]}" class="led" style="animation-delay:${((i * 4 + j) * 0.31).toFixed(1)}s"/>` + poly([P(x + 9, 630, 8 + j * 11), P(x + 19, 630, 8 + j * 11), P(x + 19, 630, 12 + j * 11), P(x + 9, 630, 12 + j * 11)], '#11182A');
    }
    entity(bbox(x, 606, 22, 24, 52, 3), s, x + 11 + 618);
  }
  [[500, 600], [640, 760]].forEach(([x1, x2]) => {
    st += shadow(x1, 634, x2 - x1, 3, 50);
    let s = box(x1, 634, x2 - x1, 3, 56, '#F4F1EA');
    const cols = ['#FFD66B', '#7FD6FF', '#FF9C8A', '#9BE3A6'];
    const n = Math.floor((x2 - x1) / 20);
    for (let k = 0; k < n; k++) for (let r = 0; r < 2; r++) {
      if ((k + r) % 3 === 2) continue;
      s += poly([P(x1 + 4 + k * 20, 637.2, 10 + r * 20), P(x1 + 16 + k * 20, 637.2, 10 + r * 20), P(x1 + 16 + k * 20, 637.2, 22 + r * 20), P(x1 + 4 + k * 20, 637.2, 22 + r * 20)], cols[(k * 2 + r) % 4]);
    }
    entity(bbox(x1, 634, x2 - x1, 3, 56, 3), s, (x1 + x2) / 2 + 636);
  });
  const chunks = (a: number, b: number) => { const k = Math.max(1, Math.round((b - a) / 40)), s = (b - a) / k; return Array.from({ length: k }, (_, i) => [a + i * s, a + (i + 1) * s]); };
  const wx = (x: number, y1: number, y2: number) => entity(bbox(x - 3, y1, 6, y2 - y1, 34, 2), box(x - 3, y1, 6, y2 - y1, 34, '#E9ECF2'), x + (y1 + y2) / 2);
  const wy = (y: number, x1: number, x2: number) => entity(bbox(x1, y - 3, x2 - x1, 6, 34, 2), box(x1, y - 3, x2 - x1, 6, 34, '#E9ECF2'), (x1 + x2) / 2 + y);
  chunks(10, 210).forEach(([a, b]) => { wx(260, a, b); wx(560, a, b); });
  chunks(235, 670).forEach(([a, b]) => wx(480, a, b));
  [[10, 180], [230, 340], [420, 620], [900, 950]].forEach(([x1, x2]) => chunks(x1, x2).forEach(([a, b]) => wy(210, a, b)));
  let lab = '';
  ([[150, 226, 'Despacho'], [390, 226, 'Sala de reuniones'], [700, 226, 'Cafetería'], [60, 262, 'Planta Vida'], [500, 262, 'Planta Vetra'], [30, 632, 'Gimnasio'], [355, 668, 'Zona relax'], [548, 668, 'Tablero de Vetra'], [848, 664, 'Servidores']] as any[]).forEach(([x, y, t]) => {
    const p = P(x, y);
    lab += `<span style="position:absolute;left:${(p[0] / SW * 100).toFixed(2)}%;top:${(p[1] / SH * 100).toFixed(2)}%;z-index:${x + y + 1002};padding:2px 7px;border-radius:999px;background:rgba(255,255,255,0.78);color:#2A3A57;font-family:'IBM Plex Mono',monospace;font-size:10.5px;letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap;pointer-events:none">${t}</span>`;
  });
  let lamps = '';
  [[135, 100], [410, 108], [780, 100], [240, 420], [720, 420], [480, 222], [880, 500]].forEach(([x, y], i) => { const p = P(x, y, 10); lamps += `<ellipse cx="${f1(p[0])}" cy="${f1(p[1])}" rx="120" ry="64" fill="url(#lg${i})"/>`; });
  ents.sort((a, b) => a[0] - b[0]);
  return { staticSvg: st, entitiesHtml: lab + ents.map((e) => e[1]).join(''), lampsSvg: lamps, doorClosed: P(950, 236, 0), doorOpen: P(978, 214, 0), doorHinge: P(950, 208, 0) };
}

export const SCENE = buildScene();
