// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// interface Tarea {
//   id: number;
//   titulo: string;
//   descripcion: string;
// }

// interface Usuario {
//   id: number;
//   nombre: string;
//   email: string;
// }

// const AsignarTareas: React.FC = () => {
//   const [tareas, setTareas] = useState<Tarea[]>([]);
//   const [usuarios, setUsuarios] = useState<Usuario[]>([]);
//   const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
//   const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(null);
//   const [mostrarModal, setMostrarModal] = useState(false);

//   useEffect(() => {
//     // Obtener tareas
//     axios.get('/tareas')
//       .then(response => setTareas(response.data))
//       .catch(error => console.error('Error al obtener tareas:', error));

//     // Obtener usuarios
//     axios.get('/usuarios')
//       .then(response => setUsuarios(response.data))
//       .catch(error => console.error('Error al obtener usuarios:', error));
//   }, []);

//   const abrirModal = (tarea: Tarea) => {
//     setTareaSeleccionada(tarea);
//     setMostrarModal(true);
//   };

//   const cerrarModal = () => {
//     setTareaSeleccionada(null);
//     setUsuarioSeleccionado(null);
//     setMostrarModal(false);
//   };

//   const asignarTarea = () => {
//     if (tareaSeleccionada && usuarioSeleccionado) {
//       axios.post(`/api/tareas/${tareaSeleccionada.id}/asignar`, { usuarioId: usuarioSeleccionado })
//         .then(() => {
//           alert('Tarea asignada correctamente');
//           cerrarModal();
//         })
//         .catch(error => {
//           console.error('Error al asignar tarea:', error);
//           alert('Error al asignar la tarea');
//         });
//     }
//   };

//   return (
//     <div>
//       <h2>Lista de Tareas</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Título</th>
//             <th>Descripción</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tareas.map(tarea => (
//             <tr key={tarea.id}>
//               <td>{tarea.titulo}</td>
//               <td>{tarea.descripcion}</td>
//               <td>
//                 <button onClick={() => abrirModal(tarea)}>Asignar</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {mostrarModal && tareaSeleccionada && (
//         <div className="modal">
//           <h3>Asignar Tarea: {tareaSeleccionada.titulo}</h3>
//           <select
//             value={usuarioSeleccionado || ''}
//             onChange={e => setUsuarioSeleccionado(Number(e.target.value))}
//           >
//             <option value="">Seleccione un usuario</option>
//             {usuarios.map(usuario => (
//               <option key={usuario.id} value={usuario.id}>
//                 {usuario.nombre} ({usuario.email})
//               </option>
//             ))}
//           </select>
//           <div>
//             <button onClick={asignarTarea}>Asignar</button>
//             <button onClick={cerrarModal}>Cancelar</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AsignarTareas;
