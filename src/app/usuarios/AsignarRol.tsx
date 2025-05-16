'use client';

import { useState } from 'react';
import { asignarRolAUsuario } from '@/app/features/usuarios/fetchUsuarios';

interface AsignarRolProps {
  usuarioId: string;
}

const AsignarRol = ({ usuarioId }: AsignarRolProps) => {
  const [rol, setRol] = useState('Usuario');
  const [mensaje, setMensaje] = useState('');

  const handleAsignar = async () => {
    try {
      await asignarRolAUsuario(usuarioId, rol);
      setMensaje('✅ Rol asignado');
    } catch (err: any) {
      setMensaje(`❌ Error: ${err.response?.data || 'Algo falló'}`);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="Usuario">Usuario</option>
        <option value="Admin">Admin</option>
      </select>
      <button onClick={handleAsignar} className="bg-blue-500 text-white px-2 py-1 rounded">
        Asignar
      </button>
      {mensaje && <span className="text-sm">{mensaje}</span>}
    </div>
  );
};

export default AsignarRol;
