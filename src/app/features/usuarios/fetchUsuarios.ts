// app/features/usuarios/fetchUsuarios.ts
import axios from '@/app/lib/axios';

export const fetchUsuariosConRoles = async () => {
  const res = await axios.get('/usuario'); // Asegúrate que coincida con tu ruta del API
  return res.data;
};

export const asignarRolAUsuario = async (usuarioId: string, rol: string) => {
  return await axios.post('/usuario/asignar-rol', { usuarioId, rol });
};

export const removerRolDeUsuario = async (usuarioId: string, rol: string) => {
  return await axios.post('/usuario/remover-rol', { usuarioId, rol });
};