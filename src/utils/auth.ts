import { supabase } from '../lib/supabase';

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(
  email: string, 
  password: string, 
  type: 'donor' | 'charity',
  metadata = {}
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        type,
        ...metadata
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function createProfile(userId: string, type: 'donor' | 'charity') {
  const { error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      type
    });

  if (error) throw error;
}