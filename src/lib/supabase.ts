import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://affrhpisytwomloctfjz.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZnJocGlzeXR3b21sb2N0Zmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Mzg0NTMsImV4cCI6MjEwMjMxNDQ1M30.ZKSu77QtdhrML5o0JamxFsh6g4gnTvl0wN7j6_GW0jA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
