import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';
import { validateAuthInput } from '../../utils/validation';
import { UserType } from '../../types/auth';

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      validateAuthInput(email, password);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      showToast('success', 'Login successful', 'Welcome back!');
      navigate(data.user?.user_metadata?.type === 'charity' ? '/charity-portal' : '/donor-portal');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      showToast('error', 'Authentication Error', message);
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

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            type
          });

        if (profileError) throw profileError;
      }

      showToast('success', 'Registration successful', 'Please check your email to verify your account');
      navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register';
      showToast('error', 'Authentication Error', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      showToast('success', 'Verification email sent');
    } catch (error) {
      showToast('error', 'Failed to send verification email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      showToast('success', 'Password reset email sent');
    } catch (error) {
      showToast('error', 'Failed to send reset email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    sendVerificationEmail,
    resetPassword,
    loading
  };
}