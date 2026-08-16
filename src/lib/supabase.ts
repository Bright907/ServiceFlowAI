import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createMockSupabase() {
  // Minimal mock to keep the app running in dev when env vars are missing.
  const mock = {
    auth: {
      async getSession() {
        return { data: { session: null } };
      },
      onAuthStateChange(_cb: unknown) {
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      async signUp() {
        return { error: null };
      },
      async signInWithPassword() {
        return { error: null };
      },
      async signOut() {
        return { error: null };
      },
    },
    from(_table: string) {
      // Chainable stub for .from(...).select(...).eq(...).maybeSingle() and .insert(...)
      const chain = {
        _table: _table,
        select(_cols?: string) {
          return Promise.resolve({ data: null, error: null });
        },
        eq(_col: string, _val: any) {
          return this;
        },
        maybeSingle() {
          return this.select();
        },
        insert(_rows: any) {
          return Promise.resolve({ data: null, error: null });
        },
      };
      return chain;
    },
  } as any;
  return mock as any;
}

let client: any = null;
if (supabaseUrl && supabaseAnonKey) {
  client = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // eslint-disable-next-line no-console
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set — using mock client.');
  client = createMockSupabase();
}

export const supabase = client;
export const supabaseEnabled = !!(supabaseUrl && supabaseAnonKey);
