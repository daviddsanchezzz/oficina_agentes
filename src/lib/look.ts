// Aspecto de cada persona del plano.
export const LOOK: Record<string, any> = {
  marta: { skin: '#F1C9A5', hair: '#3B2A20', hs: 'bun', shirt: '#7B61D1',
    body: '<path d="M-4.5,-28 L0,-19 L4.5,-28z" fill="#fff"/><path d="M-10.5,-24 L-3,-14 L-10.5,-8z" fill="#5E48B0"/><path d="M10.5,-24 L3,-14 L10.5,-8z" fill="#5E48B0"/>' },
  dani: { skin: '#D9A47A', hair: '#1F1A17', hs: 'short', beard: true, shirt: '#2FB89A', pants: '#1E2433', shorts: true, legc: '#D9A47A', armc: '#D9A47A',
    face: '<rect x="-10.4" y="-43" width="20.8" height="3.2" rx="1.2" fill="#E5483A"/>' },
  laia: { skin: '#F4D3B5', hair: '#6B3E2A', hs: 'long', shirt: '#3E8E7E',
    face: '<circle cx="-3.6" cy="-37" r="3.4" fill="none" stroke="#2A2F3E" stroke-width="0.9"/><circle cx="3.6" cy="-37" r="3.4" fill="none" stroke="#2A2F3E" stroke-width="0.9"/><line x1="-0.3" y1="-37" x2="0.3" y2="-37" stroke="#2A2F3E" stroke-width="0.9"/>' },
  pau: { skin: '#E5B993', hair: '#2B2B3A', hs: 'short', shirt: '#5AA0D6' },
  nuria: { skin: '#C98E66', hair: '#18120F', hs: 'curly', shirt: '#E39B4B' },
  alex: { skin: '#F1C9A5', hair: '#A8742B', hs: 'short', shirt: '#E0644F',
    body: '<path d="M-6,-28 Q0,-21 6,-28 L6,-25 Q0,-18 -6,-25z" fill="#B94835"/><line x1="-2" y1="-20" x2="-2" y2="-13" stroke="#fff" stroke-width="0.9"/><line x1="2" y1="-20" x2="2" y2="-13" stroke="#fff" stroke-width="0.9"/>' },
  biel: { skin: '#D9A47A', hair: '#3A2A1E', hs: 'short', beard: true, shirt: '#4A6FD6',
    face: '<path d="M-10.8,-37 A10.8,10.8 0 0 1 10.8,-37" fill="none" stroke="#1F2533" stroke-width="2"/><rect x="-12.6" y="-39" width="3.4" height="7" rx="1.6" fill="#1F2533"/><rect x="9.2" y="-39" width="3.4" height="7" rx="1.6" fill="#1F2533"/>' },
  julia: { skin: '#F4D3B5', hair: '#B5472E', hs: 'long', shirt: '#D6568F', body: '<ellipse cx="0" cy="-27" rx="9" ry="3.2" fill="#F2C94C"/>' },
  oriol: { skin: '#E5B993', hair: '#22262E', hs: 'curly', shirt: '#7FA33F' },
};

export const DESKS: Record<string, [number, number, number]> = {
  marta: [135, 120, 110], laia: [95, 305, 96], pau: [245, 305, 96], nuria: [395, 305, 96],
  alex: [695, 305, 96], biel: [545, 305, 96], julia: [845, 305, 96], oriol: [560, 455, 96],
};

// Personaje de frente, con los pies en el origen. Las clases CSS animan piernas, brazos y boca.
export function char(id: string, bound: boolean): string {
  const a = LOOK[id];
  const s = a.skin, h = a.hair, c = a.shirt, pa = a.pants || '#37425C', arm = a.armc || c, legc = a.legc || pa;
  let o = '<ellipse cx="0" cy="1" rx="13" ry="4" fill="#000" opacity="0.25"/>';
  o += `<g class="legL"><rect x="-6.5" y="-10" width="5.2" height="10.5" rx="2.2" fill="${legc}"/></g><g class="legR"><rect x="1.3" y="-10" width="5.2" height="10.5" rx="2.2" fill="${legc}"/></g>`;
  if (a.shorts) o += `<rect x="-7" y="-14" width="14" height="7" rx="2" fill="${pa}"/>`;
  o += `<g class="armL"><rect x="-14" y="-26" width="5" height="15" rx="2.5" fill="${arm}"/><circle cx="-11.5" cy="-10.5" r="2.6" fill="${s}"/></g>`;
  const mug = `<g opacity="${bound ? '__mugOp__' : '0'}"><rect x="7" y="-17" width="6" height="7" rx="1.5" fill="#F4F1EA" stroke="#9A8F7A" stroke-width="0.6"/><path d="M13 -15 q3 1 0 4" fill="none" stroke="#9A8F7A" stroke-width="0.8"/><path d="M9 -19 q-1 -2 1 -3" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.8"/></g>`;
  o += `<g class="armR"><rect x="9" y="-26" width="5" height="15" rx="2.5" fill="${arm}"/><circle cx="11.5" cy="-10.5" r="2.6" fill="${s}"/>${mug}</g>`;
  o += `<rect x="-10.5" y="-28" width="21" height="22" rx="8" fill="${c}"/>`;
  o += a.body || '';
  const hs = a.hs;
  if (hs === 'long') o += `<rect x="-11.2" y="-38" width="5" height="19" rx="2.5" fill="${h}"/><rect x="6.2" y="-38" width="5" height="19" rx="2.5" fill="${h}"/>`;
  o += `<circle cx="0" cy="-37" r="10" fill="${s}"/>`;
  if (a.beard) o += `<path d="M-8.5,-35 Q0,-24 8.5,-35 L8.5,-32 Q0,-22 -8.5,-32z" fill="${h}"/>`;
  o += `<path d="M-10.4,-36 A10.4,10.4 0 0 1 10.4,-36 Q0,-43 -10.4,-36z" fill="${h}"/>`;
  if (hs === 'bun') o += `<circle cx="0" cy="-49" r="4.5" fill="${h}"/>`;
  if (hs === 'curly') o += `<circle cx="-7" cy="-44" r="4.5" fill="${h}"/><circle cx="0" cy="-47" r="5" fill="${h}"/><circle cx="7" cy="-44" r="4.5" fill="${h}"/>`;
  o += '<g class="eye"><circle cx="-3.5" cy="-37" r="1.4" fill="#1B2233"/><circle cx="3.5" cy="-37" r="1.4" fill="#1B2233"/></g>';
  o += a.beard ? '<ellipse class="mouth" cx="0" cy="-30.5" rx="2.2" ry="0.9" fill="#F6E2D3"/>' : '<ellipse class="mouth" cx="0" cy="-31.8" rx="2.2" ry="0.9" fill="#B5503F"/>';
  o += a.face || '';
  return o;
}

export function sprite(id: string): string {
  return '<svg viewBox="-24 -62 48 72" style="display:block;width:100%;height:auto;overflow:visible" aria-hidden="true"><ellipse cx="0" cy="0" rx="19" ry="6.5" fill="none" stroke-width="2.4" stroke="__ring__"/><g opacity="__ghostOp__"><ellipse cx="0" cy="0" rx="18" ry="6" fill="none" stroke="#6B7896" stroke-width="1.4" stroke-dasharray="3 3"/></g>' + char(id, true) + '</svg>';
}
