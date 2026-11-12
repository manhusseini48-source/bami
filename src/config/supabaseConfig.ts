/**
 * Bami AI - Supabase Configuration
 * 
 * You can set your Supabase project credentials in any of these 3 ways:
 * 1. Inside Admin Panel -> Tab "همگام‌سازی ابری سوپابیس" (Saved permanently in browser & synced)
 * 2. In server .env file: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * 3. Right here in this file as default fallback
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const DEFAULT_SUPABASE_CONFIG: SupabaseConfig = {
  url: '',
  anonKey: '',
};
