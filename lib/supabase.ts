import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

/** True when real Supabase env vars are set (e.g. on Vercel or .env.local). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Supabase throws "supabaseUrl is required" if url/key are empty.
 * That breaks `next build` / prerender on Vercel when env vars are missing.
 * Use public demo placeholders only so the bundle loads; set real vars in Vercel for production.
 * @see https://supabase.com/docs/guides/getting-started
 */
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MzIwOTY0MzAsImV4cCI6MTk0NzY3MzQ0MH0.placeholder';

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : fallbackUrl,
  isSupabaseConfigured ? supabaseAnonKey : fallbackAnonKey
);

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from signup');

    // Create user profile in public.users table
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      created_at: new Date().toISOString(),
    });

    if (profileError) throw profileError;

    return { success: true, user: authData.user };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Signup failed' };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from signin');

    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Login failed' };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Logout failed' };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error: any) {
    return null;
  }
}
