export type AgentStatus = 'active' | 'sleeping' | 'building' | 'alert';

export interface AgentRow {
  id: string;
  name: string;
  role: string;
  zone: string;
  status: AgentStatus;
  now_text: string | null;
  bubble: string | null;
  mission: string | null;
  wakes: string | null;
  reads: string | null;
  permission: string | null;
  last_output: string | null;
  personality: string | null;
  updated_at?: string;
}

export interface ApprovalRow {
  id: string;
  agent_id: string;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface EventRow {
  id: number | string;
  agent_id: string;
  kind: 'info' | 'alert' | 'question';
  text: string;
  created_at: string;
}
