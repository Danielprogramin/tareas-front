'use client';

import axios from '@/app/lib/axios';
import { useRouter } from 'next/navigation';

const TareaDeleteButton = ({ id }: { id: number }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro que querés eliminar esta tarea?')) return;

    try {
      await axios.delete(`/tarea/${id}`);
      router.refresh(); // o router.push('/dashboard')
    } catch (err) {
      console.error('Error al eliminar tarea', err);
    }
  };

  return <button onClick={handleDelete}>🗑 Eliminar</button>;
};

export default TareaDeleteButton;
