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
  url: 'https://pyzmrhzqrthdbedfdskw.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5em1yaHpxcnRoZGJlZGZkc2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwMTY4NDMsImV4cCI6MjEwOTU5Mjg0M30.neC6fS4WeCNGEBz3w5CcpgzhOaLp5OMzAos2xYLNFsk',
};

