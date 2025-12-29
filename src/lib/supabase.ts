import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Support both standard name and the one provided by the user
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!url || !key) {
    if (typeof window === 'undefined') {
      console.error('SERVER-SIDE ERROR: Supabase credentials missing.');
      console.error('Detected ENV variables:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
      console.log('Current NEXT_PUBLIC_SUPABASE_URL:', url ? 'Defined' : 'UNDEFINED');
      console.log('Current key status:', key ? 'Defined' : 'UNDEFINED');
    }
    return { url: '', key: '' };
  }

  return { url, key };
};

const { url, key } = getSupabaseConfig();
export const supabase = createClient(url, key);

// Admin client for server-side operations (bypasses RLS)
const getAdminConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url: url || '', key: adminKey || '' };
};

const adminConfig = getAdminConfig();
export const supabaseAdmin = adminConfig.key 
  ? createClient(adminConfig.url, adminConfig.key) 
  : supabase;
