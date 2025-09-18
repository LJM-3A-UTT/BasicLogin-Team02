// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Valores: crea proyecto en supabase.com y copia URL / ANON KEY
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'PUBLIC_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// EJEMPLO: función para obtener perfil
export const getProfile = async (id: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};
