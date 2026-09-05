import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oqhowdjidqswyeygpksx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lUariqwK0PxxbwhL4olrxA_ff7oODOm';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);