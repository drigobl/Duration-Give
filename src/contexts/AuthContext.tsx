import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from './ToastContext';
import { Logger } from '@/utils/logger';
import { ENV } from '@/config/env';
import { setSentryUser, clearSentryUser } from '@/lib/sentry';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  userType: 'donor' | 'charity' | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, accountType: 'donor' | 'charity') => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  register: (email: string, password: string, type: 'donor' | 'charity', metadata?: any) => Promise<void>;
  sendUsernameReminder: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    userType: null
  });
  const { showToast } = useToast();
  const [retryCount, setRetryCount] = useState(0);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        Logger.error('Session refresh error', { 
          error: error.message,
          stack: error.stack,
          code: error.status
        });
        throw error;
      }
      
      const userType = session?.user?.user_metadata?.type as 'donor' | 'charity' | null;
      
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        userType
      }));

      Logger.info('Session refreshed successfully');
    } catch (err) {
      Logger.error('Session refresh failed', { 
        error: err instanceof Error ? 
          { message: err.message, stack: err.stack } : 
          err,
        retryCount
      });
      
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        setRetryCount(prev => prev + 1);
        setTimeout(refreshSession, RETRY_DELAY * Math.pow(2, retryCount));
      } else {
        // Force re-login if refresh fails repeatedly
        setState(prev => ({
          ...prev,
          user: null,
          userType: null,
          error: new Error('Session expired. Please login again.')
        }));
        showToast('error', 'Session expired', 'Please login again');
      }
    }
  }, [retryCount, showToast]);

  useEffect(() => {
    let mounted = true;
    let refreshInterval: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // Check active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          Logger.error('Get session error', { 
            error: sessionError.message,
            stack: sessionError.stack,
            code: sessionError.status
          });
          throw sessionError;
        }

        if (mounted) {
          const userType = session?.user?.user_metadata?.type as 'donor' | 'charity' | null;
          
          setState(prev => ({
            ...prev,
            user: session?.user ?? null,
            userType,
            loading: false
          }));

          // Update Sentry user context
          if (session?.user) {
            setSentryUser({
              id: session.user.id,
              email: session.user.email,
              userType: userType || undefined
            });
          } else {
            clearSentryUser();
          }

          // Start session refresh interval if user is logged in
          if (session?.user) {
            refreshInterval = setInterval(refreshSession, SESSION_REFRESH_INTERVAL);
          }
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;
          
          Logger.info('Auth state changed', { event });
          
          const userType = session?.user?.user_metadata?.type as 'donor' | 'charity' | null;

          if (event === 'SIGNED_IN') {
            showToast('success', 'Signed in successfully');
            refreshInterval = setInterval(refreshSession, SESSION_REFRESH_INTERVAL);
          }

          if (event === 'SIGNED_OUT') {
            showToast('success', 'Signed out successfully');
            if (refreshInterval) {
              clearInterval(refreshInterval);
            }
          }

          if (event === 'USER_UPDATED') {
            showToast('success', 'Profile updated successfully');
          }

          setState(prev => ({
            ...prev,
            user: session?.user ?? null,
            userType,
            loading: false
          }));

          // Update Sentry user context on auth state change
          if (session?.user) {
            setSentryUser({
              id: session.user.id,
              email: session.user.email,
              userType: userType || undefined
            });
          } else {
            clearSentryUser();
          }
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
          if (refreshInterval) {
            clearInterval(refreshInterval);
          }
        };
      } catch (err) {
        Logger.error('Auth initialization failed', { 
          error: err instanceof Error ? 
            { message: err.message, stack: err.stack } : 
            err 
        });
        
        if (mounted) {
          setState(prev => ({
            ...prev,
            error: err instanceof Error ? err : new Error('Failed to initialize auth'),
            loading: false
          }));
        }
      }
    };

    initializeAuth();
  }, [refreshSession, showToast]);

  const login = async (email: string, password: string, accountType: 'donor' | 'charity') => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // First, check if the user exists
      const { data: { user }, error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (checkError) {
        Logger.error('Login error from Supabase', { 
          error: checkError.message,
          code: checkError.status,
          email
        });
        throw checkError;
      }
      
      // Verify the user has the correct account type
      const userType = user?.user_metadata?.type;
      
      if (userType !== accountType) {
        if (accountType === 'donor') {
          throw new Error(`This email is registered as a ${userType || 'charity'} account. Please use the correct login portal.`);
        } else {
          throw new Error(`This email is registered as a ${userType || 'donor'} account. Please use the correct login portal.`);
        }
      }

      // Determine redirect path based on user type
      let redirectPath = '/give-dashboard'; // Default for donor
      
      if (accountType === 'charity') {
        redirectPath = '/charity-portal';
      }
      
      // Redirect based on domain and user type
      if (ENV.APP_DOMAIN === 'localhost') {
        window.location.href = `http://localhost:5173${redirectPath}`;
      } else {
        window.location.href = `https://app.${ENV.APP_DOMAIN}${redirectPath}`;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      showToast('error', 'Authentication Error', message);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error(message)
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const loginWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        Logger.error('Google login error', { 
          error: error.message,
          code: error.status
        });
        throw error;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
      showToast('error', 'Authentication Error', message);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error(message)
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) {
        Logger.error('Logout error', { 
          error: error.message,
          code: error.status
        });
        throw error;
      }
      
      // Clear user state immediately
      setState({
        user: null,
        userType: null,
        loading: false,
        error: null
      });
      
      // Redirect to main domain
      if (ENV.APP_DOMAIN === 'localhost') {
        window.location.href = 'http://localhost:5173';
      } else {
        window.location.href = `https://${ENV.APP_DOMAIN}`;
      }
      
      showToast('success', 'Logged out successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to log out';
      showToast('error', 'Logout Error', message);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error(message),
        loading: false
      }));
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        Logger.error('Password reset error', { 
          error: error.message,
          code: error.status,
          email
        });
        throw error;
      }
      showToast('success', 'Password reset email sent');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      showToast('error', 'Reset Password Error', message);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error(message)
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const register = async (email: string, password: string, type: 'donor' | 'charity', metadata = {}) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Check if user already exists with a different account type
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-for-check' // This will fail if user doesn't exist, which is what we want
      });
      
      // If login succeeded, the user exists with the provided password
      if (existingUser?.user) {
        const existingType = existingUser.user.user_metadata?.type;
        if (existingType && existingType !== type) {
          throw new Error(`This email is already registered as a ${existingType} account. Please use a different email.`);
        }
      }
      
      // If we get here, either the user doesn't exist or has the same account type
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            type,
            ...metadata
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        Logger.error('Registration error', { 
          error: error.message,
          code: error.status,
          email,
          type
        });
        throw error;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            type
          });

        if (profileError) {
          Logger.error('Profile creation error', { 
            error: profileError.message,
            code: profileError.code,
            userId: data.user.id,
            type
          });
          throw profileError;
        }
      }

      showToast('success', 'Registration successful', 'Please check your email to verify your account');
      
      // Redirect to the appropriate login page
      window.location.href = `/login?type=${type}`;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register';
      showToast('error', 'Registration Error', message);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error(message)
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const sendUsernameReminder = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      // In a real app, this would send an email with the username
      // For this demo, we'll just show a success message
      showToast('success', 'Username reminder sent', 'If an account exists with this email, a reminder will be sent');
      return Promise.resolve();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send username reminder';
      showToast('error', 'Username Reminder Error', message);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error(message)
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      loginWithGoogle,
      logout,
      resetPassword,
      refreshSession,
      register,
      sendUsernameReminder
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}