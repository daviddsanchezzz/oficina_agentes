import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Sin variables de entorno la app funciona en modo demo con datos de ejemplo.
export const supabase: SupabaseClient | null = url && anon ? createClient(url, anon) : null;
