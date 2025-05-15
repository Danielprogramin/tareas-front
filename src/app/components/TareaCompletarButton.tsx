'use client';

import axios from '@/app/lib/axios';
import { useRouter } from 'next/navigation';

const TareaCompletarButton = ({ id }: { id: number }) => {
  const router = useRouter();

  const marcarComoCompletada = async () => {
    try {
      await axios.post(`/tarea/${id}/completar`);
      router.refresh(); // actualiza la lista
    } catch (err) {
      console.error('Error al completar tarea', err);
    }
  };

  return <button onClick={marcarComoCompletada}>✅ Completar</button>;
};

export default TareaCompletarButton;
