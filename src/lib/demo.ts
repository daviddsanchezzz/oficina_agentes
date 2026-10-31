import { DATA } from './config';
import type { AgentRow, ApprovalRow, EventRow } from './types';

export function demoAgents(): Record<string, AgentRow> {
  const out: Record<string, AgentRow> = {};
  Object.keys(DATA).forEach((id) => {
    const d = DATA[id];
    out[id] = {
      id, name: d.name, role: d.role, zone: d.zone, status: d.st,
      now_text: null, bubble: d.bubble, mission: d.mission, wakes: d.wakes, reads: d.reads,
      permission: d.can, last_output: d.last, personality: d.style,
    };
  });
  return out;
}

export const demoApprovals: ApprovalRow[] = [
  { id: 'demo-1', agent_id: 'biel', status: 'pending', text: 'PR propuesto: reintento de los emails de confirmación. Revisa el cambio antes de fusionarlo.' },
  { id: 'demo-2', agent_id: 'julia', status: 'pending', text: 'Borrador del texto de la página de precios. No se publica nada sin tu visto bueno.' },
];

export const demoEvents: EventRow[] = [
  { id: 1, agent_id: 'alex', kind: 'info', text: 'Revisión de la mañana sin incidencias', created_at: new Date().toISOString() },
  { id: 2, agent_id: 'dani', kind: 'info', text: 'Actividad nueva detectada y plan ajustado', created_at: new Date().toISOString() },
];
