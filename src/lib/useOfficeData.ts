'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { demoAgents, demoApprovals, demoEvents } from './demo';
import type { AgentRow, ApprovalRow, EventRow } from './types';

export type Mode = 'demo' | 'live';

export function useOfficeData() {
  const [mode] = useState<Mode>(supabase ? 'live' : 'demo');
  const [ready, setReady] = useState(!supabase);
  const [signedIn, setSignedIn] = useState(!supabase);
  const [agents, setAgents] = useState<Record<string, AgentRow>>(supabase ? {} : demoAgents());
  const [approvals, setApprovals] = useState<ApprovalRow[]>(supabase ? [] : demoApprovals);
  const [events, setEvents] = useState<EventRow[]>(supabase ? [] : demoEvents);

  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    let channel: ReturnType<typeof sb.channel> | null = null;

    async function load() {
      const [a, p, e] = await Promise.all([
        sb.from('agents').select('*'),
        sb.from('approvals').select('*').order('created_at', { ascending: false }).limit(100),
        sb.from('events').select('*').order('created_at', { ascending: false }).limit(100),
      ]);
      if (a.data) setAgents(Object.fromEntries((a.data as AgentRow[]).map((r) => [r.id, r])));
      if (p.data) setApprovals(p.data as ApprovalRow[]);
      if (e.data) setEvents(e.data as EventRow[]);
    }

    function subscribe() {
      channel = sb
        .channel('oficina')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, (pl) => {
          const row = pl.new as AgentRow;
          if (row && row.id) setAgents((prev) => ({ ...prev, [row.id]: row }));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'approvals' }, () => {
          sb.from('approvals').select('*').order('created_at', { ascending: false }).limit(100).then((r) => { if (r.data) setApprovals(r.data as ApprovalRow[]); });
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, (pl) => {
          setEvents((prev) => [pl.new as EventRow, ...prev].slice(0, 100));
        })
        .subscribe();
    }

    sb.auth.getSession().then(({ data }) => {
      setReady(true);
      if (data.session) { setSignedIn(true); load(); subscribe(); }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_ev, session) => {
      if (session) {
        setSignedIn(true);
        load();
        if (!channel) subscribe();
      } else {
        setSignedIn(false);
        setAgents({}); setApprovals([]); setEvents([]);
        if (channel) { sb.removeChannel(channel); channel = null; }
      }
    });
    return () => {
      sub.subscription.unsubscribe();
      if (channel) sb.removeChannel(channel);
    };
  }, []);

  const decide = useCallback(async (id: string, status: 'approved' | 'rejected') => {
    setApprovals((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    if (supabase) {
      await supabase.from('approvals').update({ status, decided_at: new Date().toISOString() }).eq('id', id);
    }
  }, []);

  const signIn = useCallback(async (email: string) => {
    if (!supabase) return 'Sin Supabase configurado';
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: window.location.origin } });
    return error ? error.message : null;
  }, []);

  const signOut = useCallback(async () => { if (supabase) await supabase.auth.signOut(); }, []);

  return { mode, ready, signedIn, agents, approvals, events, decide, signIn, signOut };
}
