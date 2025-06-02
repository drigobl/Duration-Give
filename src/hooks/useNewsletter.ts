 import { useState } from 'react';
  import { supabase } from '@/lib/supabase';

  export function useNewsletter() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subscribe = async (email: string) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.functions.invoke('subscribe', {
          body: { email }
        });

        if (error) throw error;

        return { success: true, data };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Subscription failed';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    };

    return { subscribe, loading, error };
  }