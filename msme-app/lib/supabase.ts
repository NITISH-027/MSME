import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Supabase client for database queries and file storage.
 * `null` when the required environment variables are not set —
 * callers should fall back to mock data in that case.
 *
 * Required env vars (add to .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Convenience accessor for the Supabase Storage bucket used by this app.
 * Usage:
 *   const { data, error } = await storage?.upload("path/file.jpg", file);
 *   const { data } = storage?.getPublicUrl("path/file.jpg");
 */
export const storage = supabase?.storage.from("msme-assets") ?? null;
