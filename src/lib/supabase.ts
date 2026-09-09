import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bzihuvbsbhsjkldjydli.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6aWh1dmJzYmhzamtsZGp5ZGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NjcwMTksImV4cCI6MjEwNDU0MzAxOX0.iG49dqbzOBM_oJ7GRkVClw8JdSCcjUPfWviW6l29T9o';

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.warn('Supabase client initialization warning:', err);
  }
}

export const supabase = supabaseInstance;
