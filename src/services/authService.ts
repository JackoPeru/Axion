import { isSupabaseConfigured } from '../config/env';
import { supabase } from './supabaseClient';

export type CloudAuthMode = 'sign-in' | 'sign-up';

export async function authenticateWithEmail(email: string, password: string, mode: CloudAuthMode) {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: 'Supabase non configurato. Uso profilo locale.', userId: undefined };
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || password.length < 6) {
    return { error: 'Inserisci email valida e password di almeno 6 caratteri.', userId: undefined };
  }

  const result = mode === 'sign-up'
    ? await supabase.auth.signUp({ email: normalizedEmail, password })
    : await supabase.auth.signInWithPassword({ email: normalizedEmail, password });

  if (result.error) {
    return { error: result.error.message, userId: undefined };
  }

  return { error: undefined, userId: result.data.user?.id };
}
