'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DATA } from '../lib/config';
import { AVATARS, DOOR_CLOSED, DOOR_HINGE, DOOR_OPEN, ENTITIES_HTML, LAMPS_SVG, SCENE_STATIC, SPRITES } from '../lib/generated/scene';
import { IDS, SH, SW, computeView, initSim, realWeek, snapAll, stepAgent } from '../lib/sim';
import { useOfficeData } from '../lib/useOfficeData';

const GROUPS: [string, string[]][] = [
  ['Despacho', ['marta']],
  ['Planta Vida', ['dani', 'laia', 'pau', 'nuria']],
  ['Planta Vetra', ['alex', 'biel', 'julia', 'oriol']],
];
const MONO = "'IBM Plex Mono', monospace";

function Login({ onSend }: { onSend: (email: string) => Promise<string | null> }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0C1624', color: '#E8EEF7', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <form
        onSubmit={async (e) => { e.preventDefault(); const err = await onSend(email); setMsg(err ? err : 'Te he enviado un enlace de acceso. Ábrelo en este navegador.'); }}
        style={{ width: 'min(380px, 92vw)', display: 'flex', flexDirection: 'column', gap: 14, padding: 24, border: '1px solid #2A4468', borderRadius: 16, background: '#12223A' }}
      >
        <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFB547' }}>Acceso privado</span>
        <h1 style={{ margin: 0, fontSize: 24 }}>La oficina de David</h1>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#9DB2CE' }}>
          Correo
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ height: 44, padding: '0 12px', borderRadius: 10, border: '1px solid #3C5A85', background: '#0F1D32', color: '#E8EEF7', fontSize: 16 }} />
        </label>
        <button type="submit" style={{ height: 44, borderRadius: 10, border: 0, background: '#5BE3B0', color: '#06231A', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Enviar enlace</button>
        {msg && <p style={{ margin: 0, fontSize: 14, color: '#C9D6E8' }}>{msg}</p>}
      </form>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 10, borderTop: '1px solid #2A4468' }}>
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7F97B8' }}>{title}</span>
      <span style={{ fontSize: 14, lineHeight: 1.45 }}>{children}</span>
    </div>
  );
}

export default function Office() {
  const data = useOfficeData();
  const simRef = useRef<any>(null);
  const rtRef = useRef(0);
  const [week, setWeek] = useState(0);
  const [, setTick] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const sim = initSim();
    simRef.current = sim;
    let w = realWeek();
    snapAll(sim, w, 0);
    setWeek(w);
    const iv = setInterval(() => {
      w = realWeek();
      rtRef.current += 0.25;
      IDS.forEach((id: string) => stepAgent(sim[id], id, w, rtRef.current, 0.25));
      setWeek(w);
      setTick((t) => t + 1);
    }, 250);
    return () => clearInterval(iv);
  }, []);

  const view = simRef.current ? computeView(simRef.current, week, data.agents, data.approvals, openId) : null;

  if (data.mode === 'live' && data.ready && !data.signedIn) return <Login onSend={data.signIn} />;
  if (!view) return <div style={{ minHeight: '100vh', background: '#0C1624' }} />;

  const v = view.views;
  const cur = openId ? v[openId] : null;
  const curEvents = openId ? data.events.filter((e) => e.agent_id === openId).slice(0, 4) : [];
  const doorEnd = view.doorOpen ? DOOR_OPEN : DOOR_CLOSED;

  return (
    <div className="shell" style={{ height: '100vh', boxSizing: 'border-box', display: 'flex', overflow: 'hidden', background: '#0C1624', color: '#E8EEF7', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <nav className="side" aria-label="Equipo" style={{ flex: '0 0 340px', boxSizing: 'border-box', height: '100%', overflowY: 'auto', padding: '22px 16px 28px', display: 'flex', flexDirection: 'column', gap: 18, borderRight: '1px solid #1D3050' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 4px 4px' }}>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFB547' }}>{data.mode === 'demo' ? 'Modo demo · datos de ejemplo' : 'En vivo · Supabase'}</span>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em' }}>La oficina de David</h1>
        </div>
        {GROUPS.map(([zone, ids]) => (
          <div key={zone} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7F97B8', padding: '0 4px' }}>{zone}</span>
            {ids.map((id) => {
              const a = v[id];
              return (
                <button key={id} onClick={() => setOpenId(id)} aria-pressed={a.pressed}
                  style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px 8px 8px', borderRadius: 12, border: `1px ${a.cBs} ${a.cBorder}`, background: a.cBg, minHeight: 64, boxSizing: 'border-box', width: '100%', color: 'inherit', font: 'inherit' }}>
                  <span style={{ flex: '0 0 44px', height: 54, borderRadius: 10, background: a.tint, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                    <svg viewBox="-16 -52 32 56" width="40" height="54" aria-hidden="true"><g opacity={a.avOp} dangerouslySetInnerHTML={{ __html: AVATARS[id] }} /></svg>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>{a.name}</span>
                    <span style={{ fontSize: 13, color: '#9DB2CE' }}>{a.role}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: a.ink }}>
                      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: a.ink }} />{a.statusLabel}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ))}
        {data.mode === 'live' && <button onClick={data.signOut} style={{ alignSelf: 'flex-start', height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid #2A4468', background: 'transparent', color: '#9DB2CE', cursor: 'pointer' }}>Cerrar sesión</button>}
      </nav>

      <main className="stagewrap" style={{ flex: '1 1 auto', minWidth: 0, height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div className="stage" style={{ position: 'relative', width: 'min(100%, calc(100vh * 1.7101))', flex: '0 0 auto' }}>
          <div style={{ position: 'relative', width: '100%', containerType: 'inline-size', background: '#0C1624' }}>
            <div style={{ paddingBottom: `${(SH / SW) * 100}%` }} />
            <div style={{ position: 'absolute', inset: 0 }}>
              <StaticScene />
              <svg viewBox={`0 0 ${SW} ${SH}`} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }} aria-hidden="true">
                <line x1={DOOR_HINGE[0]} y1={DOOR_HINGE[1]} x2={doorEnd[0]} y2={doorEnd[1]} stroke="#6B4A2E" strokeWidth="5" strokeLinecap="round" />
              </svg>
              {IDS.map((id: string) => {
                const a = v[id];
                const svg = SPRITES[id].replace(/__(\w+)__/g, (_m: string, k: string) => ({ ring: a.ring, ghostOp: a.ghostOp, mugOp: a.mugOp } as any)[k]);
                return (
                  <div key={id} style={{ position: 'absolute', left: a.left, top: a.top, zIndex: a.z, width: 0, height: 0, opacity: a.op, transition: 'left 0.25s linear, top 0.25s linear, opacity 0.6s', pointerEvents: 'none' }}>
                    <button onClick={() => setOpenId(id)} aria-label={`Ver ficha de ${a.name}`} className={a.cls}
                      style={{ pointerEvents: 'auto', position: 'absolute', left: 0, top: 0, width: '5cqw', minWidth: 34, transform: 'translate(-50%,-86%)', padding: 0, border: 0, background: 'none', cursor: 'pointer', display: 'block' }}>
                      <span dangerouslySetInnerHTML={{ __html: svg }} />
                      <span style={{ position: 'absolute', left: '50%', top: '92%', transform: 'translateX(-50%)', padding: '1px 7px', borderRadius: 999, background: '#1B2740', color: '#fff', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', lineHeight: 1.5 }}>{a.name}</span>
                    </button>
                    <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-50%, calc(-100% - 5.6cqw - 6px))', opacity: a.bubOp, transition: 'opacity 0.3s', pointerEvents: 'none', width: 'max-content', maxWidth: 230, padding: '6px 10px', borderRadius: 10, background: '#fff', color: '#1B2233', fontSize: 12.5, lineHeight: 1.35, border: '1.5px solid #2A3A57', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', zIndex: 50 }}>{a.say}</div>
                    <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-50%, calc(-100% - 5.2cqw - 2px))', opacity: a.badgeOp, pointerEvents: 'none' }}>
                      <span className="pulse" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, marginLeft: 30, borderRadius: '50%', background: '#E5483A', border: '2px solid #fff', color: '#fff', fontSize: 13, fontWeight: 700 }}>!</span>
                    </div>
                    <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(10px, calc(-100% - 4.6cqw))', opacity: a.zOp, pointerEvents: 'none', fontFamily: MONO, fontWeight: 600, color: '#2A3A57', fontSize: 14 }}>
                      <span className="zz">z</span><span className="zz" style={{ animationDelay: '0.9s', fontSize: 11 }}>z</span>
                    </div>
                  </div>
                );
              })}
              <svg viewBox={`0 0 ${SW} ${SH}`} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 9000, pointerEvents: 'none' }} aria-hidden="true">
                <rect width={SW} height={SH} fill="#0A1440" opacity={view.nightOp} />
                <rect width={SW} height={SH} fill="#FF9A3C" opacity={view.duskOp} />
                <g opacity={view.lampOp} dangerouslySetInnerHTML={{ __html: LAMPS_SVG }} />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 14, left: 16, zIndex: 9600, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 10px', maxWidth: 'calc(100% - 32px)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '8px 14px', border: '1px solid #2A4468', borderRadius: 12, background: 'rgba(18,34,58,0.92)' }}>
            <span style={{ fontSize: 18, fontWeight: 600, fontFamily: MONO }}>{view.clockLabel}</span>
            <span style={{ fontSize: 13, color: '#9DB2CE' }}>{view.phaseLabel}</span>
          </div>
          {[['#5BE3B0', view.nActive, 'en la oficina', 'solid'], ['#FF8A7A', view.nWaiting, 'esperan tu OK', 'solid'], ['#6AA8FF', view.nBuilding, 'vacantes', 'dashed']].map(([c, n, t, bs]) => (
            <div key={t as string} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: `1px ${bs} ${bs === 'dashed' ? '#3C5A85' : '#2A4468'}`, borderRadius: 999, background: 'rgba(18,34,58,0.92)', fontSize: 13 }}>
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: c as string }} /><span><b>{n}</b> {t}</span>
            </div>
          ))}
        </div>

        {cur && (
          <aside aria-label="Detalle del agente" style={{ display: 'flex', position: 'absolute', top: 12, right: 12, maxHeight: 'calc(100% - 24px)', zIndex: 9500, width: 'min(340px, calc(100% - 24px))', boxSizing: 'border-box', overflow: 'auto', flexDirection: 'column', gap: 12, padding: 18, borderRadius: 14, background: 'rgba(18,34,58,0.97)', border: '1px solid #3C5A85', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span aria-hidden="true" style={{ flex: '0 0 44px', height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 15, fontWeight: 500, background: cur.tint, color: cur.ink }}>{cur.mono}</span>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{cur.name}</h3>
                <span style={{ fontSize: 13, color: '#9DB2CE' }}>{cur.role} · {cur.zone}</span>
                <span style={{ fontSize: 13, color: cur.ink }}>{cur.statusLabel}</span>
              </div>
              <button onClick={() => setOpenId(null)} aria-label="Cerrar ficha" style={{ cursor: 'pointer', flex: '0 0 44px', height: 44, borderRadius: 10, border: '1px solid #3C5A85', background: 'transparent', color: 'inherit', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#C9D6E8' }}>{cur.mission}</p>
            {cur.approval && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid #E5483A', borderRadius: 12, background: '#2A1A1D', padding: 12 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FF8A7A' }}>Espera tu aprobación</span>
                <span style={{ fontSize: 14, lineHeight: 1.45 }}>{cur.approval.text}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button onClick={() => data.decide(cur.approval.id, 'approved')} style={{ cursor: 'pointer', height: 44, padding: '0 18px', borderRadius: 10, border: 0, background: '#5BE3B0', color: '#06231A', fontSize: 14, fontWeight: 600 }}>Aprobar</button>
                  <button onClick={() => data.decide(cur.approval.id, 'rejected')} style={{ cursor: 'pointer', height: 44, padding: '0 18px', borderRadius: 10, border: '1px solid #3C5A85', background: 'transparent', color: '#E8EEF7', fontSize: 14 }}>Rechazar</button>
                </div>
              </div>
            )}
            <Block title="Ahora">{cur.now}</Block>
            <Block title="Carácter">{cur.style}</Block>
            <Block title="Despierta">{cur.wakes}</Block>
            <Block title="Lee">{cur.reads}</Block>
            <Block title="Permiso">{cur.can}</Block>
            <Block title="Última salida">{cur.last}</Block>
            {curEvents.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 10, borderTop: '1px solid #2A4468' }}>
                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7F97B8' }}>Historial</span>
                {curEvents.map((e) => (
                  <span key={e.id} style={{ fontSize: 13, lineHeight: 1.4, color: e.kind === 'alert' ? '#FF8A7A' : '#C9D6E8' }}>{new Date(e.created_at).toLocaleString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} · {e.text}</span>
                ))}
              </div>
            )}
          </aside>
        )}
      </main>
    </div>
  );
}

function StaticScene() {
  const html = useMemo(() => ENTITIES_HTML, []);
  return (
    <>
      <svg viewBox={`0 0 ${SW} ${SH}`} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 1 }} role="img" aria-label="Plano isométrico de la oficina" dangerouslySetInnerHTML={{ __html: SCENE_STATIC }} />
      <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
