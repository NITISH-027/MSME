import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}

/** Returns true when Supabase is properly configured. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
