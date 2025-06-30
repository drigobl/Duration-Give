import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { validateAuthInput } from '@/utils/validation';
import { UserType } from '@/types/auth';
import { Logger } from '@/utils/logger';
import { RateLimiter } from '@/utils/security/rateLimiter';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function useAuth() {
  const authContext = useAuthContext();
  const { disconnect } = useWeb3();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const rateLimiter = RateLimiter.getInstance();

  const login = async (email: string, password: string, accountType: 'donor' | 'charity') => {
    try {
      setLoading(true);
      validateAuthInput(email, password);

      // Check rate limiting
      if (rateLimiter.isRateLimited(email, true)) {
        throw new Error(`Too many login attempts. Please try again in ${LOCKOUT_DURATION / 60000} minutes.`);
      }

      try {
        await authContext.login(email, password, accountType);
        
        // Reset rate limiting on successful login
        rateLimiter.reset(email);
      } catch (authError) {
        // Log the detailed error
        Logger.error('Auth context login failed', { 
          error: authError instanceof Error ? 
            { message: authError.message, stack: authError.stack } : 
            authError,
          email
        });
        throw authError;
      }
    } catch (error) {
      rateLimiter.increment(email);
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      
      // If account type mismatch, disconnect wallet
      if (message.includes('registered as a') || message.includes('account type')) {
        // Disconnect wallet
        await disconnect();
      }
      
      showToast('error', 'Authentication Error', message);
      Logger.error('Login failed', { 
        error: error instanceof Error ? 
          { message: error.message, stack: error.stack } : 
          error, 
        email 
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    type: UserType,
    metadata = {}
  ) => {
    try {
      setLoading(true);
      validateAuthInput(email, password);
      
      await authContext.register(email, password, type, metadata);
      
      // Navigate to the appropriate login page
      navigate(`/login?type=${type}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register';
      showToast('error', 'Registration Error', message);
      Logger.error('Registration failed', { 
        error: error instanceof Error ? 
          { message: error.message, stack: error.stack } : 
          error, 
        email, 
        type 
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      await authContext.resetPassword(email);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      showToast('error', 'Reset Password Error', message);
      Logger.error('Password reset failed', { 
        error: error instanceof Error ? 
          { message: error.message, stack: error.stack } : 
          error, 
        email 
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendUsernameReminder = async (email: string) => {
    try {
      setLoading(true);
      await authContext.sendUsernameReminder(email);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send username reminder';
      showToast('error', 'Username Reminder Error', message);
      Logger.error('Username reminder failed', { 
        error: error instanceof Error ? 
          { message: error.message, stack: error.stack } : 
          error, 
        email 
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Disconnect wallet first
      await disconnect();
      
      // Then logout from auth
      await authContext.logout();
      
      // Use window.location to stay on the same domain
      window.location.href = `${window.location.origin}/`;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to log out';
      showToast('error', 'Logout Error', message);
      Logger.error('Logout failed', { 
        error: error instanceof Error ? 
          { message: error.message, stack: error.stack } : 
          error 
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    ...authContext,
    login,
    register,
    resetPassword,
    sendUsernameReminder,
    logout,
    loading
  };
}