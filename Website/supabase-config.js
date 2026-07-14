// Shared Supabase connection — safe to be public, protected by Row Level Security policies
const SUPABASE_URL = 'https://siegeuocsetbquffagyr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_54coUONsmxn6znJVXth9Kg_UGeFfUMA';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
