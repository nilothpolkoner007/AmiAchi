import { createClient } from '@supabase/supabase-js';
import { getString, setString } from '@nativescript/core/application-settings';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: {
      getItem: (key) => getString(key),
      setItem: (key, value) => setString(key, value),
      removeItem: (key) => setString(key, '')
    },
    persistSession: true,
    detectSessionInUrl: false
  }
});