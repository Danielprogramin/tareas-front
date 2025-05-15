'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/app/features/auth/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verificar = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAutenticado(false);
        router.replace('/login');
        setLoading(false);
        return;
      }

      try {
        await getUser(token); // ⬅️ Le pasás el token
        setAutenticado(true);
      } catch {
        localStorage.removeItem('token');
        setAutenticado(false);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    verificar();
  }, [router]);

  return { autenticado, loading };
};
