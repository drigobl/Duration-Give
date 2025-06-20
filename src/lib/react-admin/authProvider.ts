import { AuthProvider } from 'react-admin';
import { supabase } from '../supabase';

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
  },
  
  logout: async () => {
    await supabase.auth.signOut();
  },
  
  checkAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', session.user.id)
      .single();
      
    if (profile?.type !== 'admin') {
      throw new Error('Not authorized');
    }
  },
  
  checkError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      throw new Error('Not authenticated');
    }
  },
  
  getIdentity: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    return {
      id: session.user.id,
      fullName: profile?.name || session.user.email,
      avatar: profile?.avatar_url,
    };
  },
  
  getPermissions: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', session.user.id)
      .single();
      
    return profile?.type || 'donor';
  },
};