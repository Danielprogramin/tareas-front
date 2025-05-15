export interface Tarea {
  id: number;
  descripcion: string;
  completado: boolean;
  prioridad: 'Baja' | 'Media' | 'Alta';
  fechaVencimiento?: string;
}
