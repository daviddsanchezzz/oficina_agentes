// @ts-nocheck
// Simulación de la oficina: horarios, rutas, escenas y movimiento.
import { DATA } from './config';

export const IDS = Object.keys(DATA);
export const SW = 1180, SH = 690, OX = 490, OY = 80, KX = 0.7, KY = 0.35, ZK = 0.9;
const COR = 222;
export const DOOR = [952, 222];
const WALK = 75;
export const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAYS_S = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const WEEKDAYS = [0, 1, 2, 3, 4];
export const SCENES = [
  { id: 'standup', label: 'Reunión rápida de la mañana', days: WEEKDAYS, start: 570, end: 590, lineMin: 3.5,
    seats: { marta: [410, 60], biel: [350, 165], alex: [410, 165], julia: [470, 165] },
    lines: [['marta', 'Buenos días. ¿Qué hay hoy?'], ['alex', 'Los despliegues de anoche, sin incidencias.'], ['biel', 'Tengo un PR de emails listo para David.'], ['julia', 'Y un borrador de precios para su visto bueno.'], ['marta', 'Perfecto, lo pongo arriba en su bandeja.']] },
  { id: 'lunes', label: 'Reunión de planificación del lunes', days: [0], start: 600, end: 640, lineMin: 4,
    seats: { marta: [410, 60], dani: [350, 60], laia: [470, 60], biel: [350, 165], alex: [410, 165], julia: [470, 165] },
    lines: [['marta', 'Lunes: preparo el resumen de la semana.'], ['dani', 'Toca descarga: la carga de Strava sube.'], ['laia', 'Ninguna posición ha superado el umbral.'], ['alex', 'Un aviso de seguridad menor en Vetra.'], ['biel', 'Lo cubro con tests de Jest.'], ['julia', 'Pruebo el precio nuevo del plan.'], ['marta', 'Cerrado. Gracias a todos.']] },
  { id: 'cafe1', label: 'Pausa del café', days: WEEKDAYS, start: 690, end: 710, lineMin: 4,
    seats: { dani: [688, 70], julia: [724, 70] },
    lines: [['julia', '¿Probamos otro texto para la web?'], ['dani', 'Primero el café.'], ['julia', 'Trato hecho.'], ['dani', 'Luego salgo a correr.']] },
  { id: 'comida', label: 'Hora de comer', days: WEEKDAYS, start: 840, end: 880, lineMin: 5,
    seats: { marta: [610, 122], laia: [694, 122], biel: [652, 160], dani: [760, 122], julia: [844, 122], alex: [802, 160] },
    lines: [['marta', '¿Qué tal la mañana?'], ['biel', 'Lo de los emails, casi listo.'], ['dani', 'Yo me pido la ensalada.'], ['julia', 'Y yo el café de después.']] },
  { id: 'cafe2', label: 'Pausa de la tarde', days: WEEKDAYS, start: 960, end: 975, lineMin: 4,
    seats: { biel: [688, 70], alex: [724, 70] },
    lines: [['biel', '¿Algún error nuevo en los registros?'], ['alex', 'Nada, tranquilo.'], ['biel', 'Pues me voy a por tests.']] },
  { id: 'domingo', label: 'Resumen del domingo', days: [6], start: 1140, end: 1180, lineMin: 8,
    seats: { marta: DATA.marta.seat },
    lines: [['marta', 'Resumen semanal listo en tu bandeja.']] }
];

export function area(x, y) {
  if (y < 216) return x < 260 ? 'des' : (x < 560 ? 'reu' : 'caf');
  if (y <= 232) return 'cor';
  return x < 480 ? 'vida' : 'vetra';
}
function exitPts(x, y) {
  const a = area(x, y);
  if (a === 'cor') return [];
  if (a === 'vida' || a === 'vetra') {
    const lanes = [170, 320, 460, 620, 770];
    let lane = lanes[0];
    lanes.forEach((l) => { if (Math.abs(l - x) < Math.abs(lane - x)) lane = l; });
    const o = [];
    if (Math.abs(lane - x) > 6) o.push([lane, y]);
    o.push([lane, COR]);
    return o;
  }
  const gaps = { des: [185, 225], reu: [345, 415], caf: [625, 895] };
  const g = gaps[a];
  const gx = Math.max(g[0], Math.min(g[1], x));
  const o = [];
  if (Math.abs(gx - x) > 1) o.push([gx, y]);
  o.push([gx, COR]);
  return o;
}
export function planPath(x1, y1, x2, y2) {
  if (area(x1, y1) === area(x2, y2)) return [[x2, y2]];
  const out = exitPts(x1, y1);
  const inn = exitPts(x2, y2).reverse();
  return out.concat(inn).concat([[x2, y2]]);
}
export function patrolPos(id, t) {
  const D = DATA[id];
  if (!D.kf) return D.seat;
  const u = (t + D.off) % D.cyc;
  const k = D.kf;
  for (let i = 1; i < k.length; i++) {
    if (u <= k[i][0]) {
      const a = k[i - 1], b = k[i];
      const span = b[0] - a[0];
      const f = span > 0.0001 ? (u - a[0]) / span : 1;
      return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    }
  }
  return D.seat;
}
export function present(id, week) {
  const D = DATA[id];
  if (!D.shift) return true;
  const d = Math.floor(week / 1440) % 7;
  const m = week % 1440;
  if (d < 5) return D.shift.some((s) => m >= s[0] && m < s[1]);
  return D.weekend.some((s) => s[0] === d && m >= s[1] && m < s[2]);
}
export function sceneFor(id, week) {
  const d = Math.floor(week / 1440) % 7;
  const m = week % 1440;
  for (let i = 0; i < SCENES.length; i++) {
    const s = SCENES[i];
    if (s.days.indexOf(d) >= 0 && m >= s.start && m < s.end && s.seats[id]) return s;
  }
  return null;
}
export function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }
export function moveAlong(a, budget) {
  while (budget > 0 && a.path.length) {
    const n = a.path[0];
    const d = dist(a.x, a.y, n[0], n[1]);
    if (d <= budget) {
      budget -= d;
      a.x = n[0]; a.y = n[1];
      a.path.shift();
      a.moved = true;
    } else {
      a.x += (n[0] - a.x) / d * budget;
      a.y += (n[1] - a.y) / d * budget;
      budget = 0;
      a.moved = true;
    }
  }
}
export function stepAgent(a, id, week, rt, dt) {
  const D = DATA[id];
  if (!D.shift) return;
  a.moved = false;
  const here = present(id, week);
  if (!here) {
    if (a.mode === 'away') return;
    if (a.mode !== 'leaving') { a.path = planPath(a.x, a.y, DOOR[0], DOOR[1]); a.mode = 'leaving'; a.sceneId = null; }
    moveAlong(a, dt * WALK);
    if (!a.path.length) { a.mode = 'away'; a.x = DOOR[0]; a.y = DOOR[1]; }
    return;
  }
  if (a.mode === 'away') { a.x = DOOR[0]; a.y = DOOR[1]; a.mode = 'return'; a.path = []; }
  const sc = sceneFor(id, week);
  if (sc) {
    if (a.sceneId !== sc.id) { a.sceneId = sc.id; a.path = planPath(a.x, a.y, sc.seats[id][0], sc.seats[id][1]); a.mode = 'goto'; }
    moveAlong(a, dt * WALK);
    if (!a.path.length) a.mode = 'hold';
    return;
  }
  a.sceneId = null;
  const tg = patrolPos(id, rt);
  if (a.mode === 'patrol') {
    a.moved = dist(a.x, a.y, tg[0], tg[1]) > 0.05;
    a.x = tg[0]; a.y = tg[1];
    return;
  }
  const end = a.path.length ? a.path[a.path.length - 1] : [a.x, a.y];
  if (!a.path.length || dist(end[0], end[1], tg[0], tg[1]) > 40) { a.path = planPath(a.x, a.y, tg[0], tg[1]); a.mode = 'return'; }
  moveAlong(a, dt * WALK);
  if (dist(a.x, a.y, tg[0], tg[1]) < 16 && a.path.length <= 1) { a.mode = 'patrol'; a.path = []; }
}
export function snapAll(sim, week, rt) {
  IDS.forEach((id) => {
    const D = DATA[id];
    const a = sim[id];
    a.path = []; a.moved = false; a.sceneId = null;
    if (!D.shift) { a.x = D.seat[0]; a.y = D.seat[1]; a.mode = 'static'; return; }
    if (!present(id, week)) { a.x = DOOR[0]; a.y = DOOR[1]; a.mode = 'away'; return; }
    const sc = sceneFor(id, week);
    if (sc) { a.x = sc.seats[id][0]; a.y = sc.seats[id][1]; a.mode = 'hold'; a.sceneId = sc.id; return; }
    const p = patrolPos(id, rt);
    a.x = p[0]; a.y = p[1]; a.mode = 'patrol';
  });
}
export function scr(x, y, z) { return [OX + (x - y) * KX, OY + (x + y) * KY - (z || 0) * ZK]; }
export function darkness(h) {
  if (h >= 21 || h < 5) return 1;
  if (h < 8) return 1 - (h - 5) / 3;
  if (h < 18) return 0;
  return (h - 18) / 3;
}
export function two(n) { return (n < 10 ? '0' : '') + n; }

export function realWeek() {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(new Date());
    const g = (k) => parts.filter((x) => x.type === k)[0].value;
    const dmap = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    let h = Number(g('hour'));
    if (h === 24) h = 0;
    return dmap[g('weekday')] * 1440 + h * 60 + Number(g('minute')) + Number(g('second')) / 60;
  } catch (e) {
    const n = new Date();
    return ((n.getDay() + 6) % 7) * 1440 + n.getHours() * 60 + n.getMinutes();
  }
}


// ---------- vista derivada ----------
const LOOK = {
  active: { label: 'Trabajando', ink: '#5BE3B0', tint: '#12392F', border: '#2A4468', bs: 'solid' },
  waiting: { label: 'Espera tu OK', ink: '#FF8A7A', tint: '#40201F', border: '#2A4468', bs: 'solid' },
  alert: { label: 'Aviso', ink: '#FF8A7A', tint: '#40201F', border: '#2A4468', bs: 'solid' },
  sleeping: { label: 'Descansando', ink: '#9DB2CE', tint: '#1D3050', border: '#2A4468', bs: 'solid' },
  building: { label: 'Vacante', ink: '#6AA8FF', tint: '#16305A', border: '#3C5A85', bs: 'dashed' },
  away: { label: 'Fuera de la oficina', ink: '#7F97B8', tint: '#1D3050', border: '#2A4468', bs: 'solid' },
};

export function initSim() {
  const sim = {};
  IDS.forEach((id) => { sim[id] = { x: 0, y: 0, mode: 'patrol', path: [], moved: false, sceneId: null }; });
  return sim;
}

export function computeView(sim, week, agents, approvals, openId) {
  const minute = week % 1440;
  const day = Math.floor(week / 1440) % 7;
  const pendingBy = {};
  approvals.forEach((p) => { if (p.status === 'pending') pendingBy[p.agent_id] = p; });
  const views = {};
  let inOffice = 0;
  let nearDoor = false;
  let nBuilding = 0;
  IDS.forEach((id) => {
    const d = DATA[id];
    const row = agents[id] || {};
    const a = sim[id];
    const dbStatus = row.status || d.st;
    const vacant = dbStatus === 'building';
    if (vacant) nBuilding += 1;
    const away = !vacant && a.mode === 'away';
    let status = dbStatus === 'sleeping' || dbStatus === 'active' || dbStatus === 'alert' || vacant ? dbStatus : 'active';
    if (pendingBy[id]) status = 'waiting';
    if (away) status = 'away';
    if (!vacant && !away) inOffice += 1;
    if (!vacant && !away && dist(a.x, a.y, DOOR[0], DOOR[1]) < 70) nearDoor = true;
    const l = LOOK[status];
    const on = id === openId;
    const sc = sceneFor(id, week);
    let say = '';
    let speaking = false;
    if (sc && !away && a.mode === 'hold') {
      const ln = sc.lines[Math.floor((minute - sc.start) / sc.lineMin) % sc.lines.length];
      if (ln[0] === id) { say = ln[1]; speaking = true; }
    }
    const baseNow = row.now_text || row.bubble || d.bubble;
    let now = baseNow;
    if (vacant) now = 'Puesto sin cubrir';
    else if (away) now = 'Fuera de horario';
    else if (sc && (a.mode === 'hold' || a.mode === 'goto')) now = sc.label;
    else if (a.moved) now = 'Moviéndose por la oficina';
    const inCafe = a.y < 216 && a.x > 560 && !a.moved;
    const atDesk = dist(a.x, a.y, d.seat[0], d.seat[1]) < 10;
    const atRun = d.run && dist(a.x, a.y, d.run[0], d.run[1]) < 12;
    let cls = 'spr idle';
    if (speaking) cls = 'spr talk';
    else if (a.moved || atRun) cls = 'spr walk';
    else if (atDesk && dbStatus !== 'sleeping' && !vacant) cls = 'spr type';
    const s = scr(a.x, a.y);
    views[id] = {
      id,
      name: row.name || d.name, mono: d.mono, role: row.role || d.role, zone: row.zone || d.zone,
      mission: row.mission || d.mission, wakes: row.wakes || d.wakes, reads: row.reads || d.reads,
      can: row.permission || d.can, last: row.last_output || d.last, style: row.personality || d.style, now,
      statusLabel: l.label, ink: l.ink, tint: l.tint,
      cBorder: on ? '#FFB547' : l.border, cBs: on ? 'solid' : l.bs, cBg: on ? '#182B49' : '#12223A',
      pressed: on, ring: on ? '#FFB547' : 'transparent',
      ghostOp: vacant ? '1' : '0', avOp: vacant ? '0.45' : (away ? '0.6' : '1'),
      left: (s[0] / SW * 100).toFixed(3) + '%', top: (s[1] / SH * 100).toFixed(3) + '%',
      z: Math.round(a.x + a.y) + 1001, op: away ? '0' : (vacant ? '0.45' : '1'),
      cls, mugOp: inCafe ? '1' : '0', say, bubOp: say ? '1' : '0',
      badgeOp: (status === 'waiting' || status === 'alert') ? '1' : '0',
      zOp: (status === 'sleeping' && !away) ? '1' : '0',
      approval: pendingBy[id] || null,
    };
  });
  const hour = minute / 60;
  const dk = darkness(hour);
  let dusk = 0;
  if (hour >= 17 && hour < 20) dusk = 0.16 * Math.sin(Math.PI * (hour - 17) / 3);
  else if (hour >= 6 && hour < 8.5) dusk = 0.1 * Math.sin(Math.PI * (hour - 6) / 2.5);
  const activeScene = SCENES.filter((s) => s.days.indexOf(day) >= 0 && minute >= s.start && minute < s.end)[0];
  let phase = 'Jornada normal';
  if (activeScene) phase = activeScene.label;
  else if (dk > 0.95) phase = 'Noche: la oficina está vacía';
  else if (day >= 5) phase = 'Fin de semana';
  else if (hour < 8.5) phase = 'Amanece';
  else if (hour >= 19) phase = 'Se hace de noche';
  return {
    views, nActive: inOffice, nWaiting: Object.keys(pendingBy).length, nBuilding,
    clockLabel: DAYS[day] + ' ' + two(Math.floor(minute / 60)) + ':' + two(Math.floor(minute % 60)),
    phaseLabel: phase,
    nightOp: (dk * 0.58).toFixed(3), duskOp: dusk.toFixed(3), lampOp: Math.min(1, dk * 1.6).toFixed(3),
    doorOpen: nearDoor,
  };
}
