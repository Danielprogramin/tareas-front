'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from '@/app/lib/axios';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Save, Clock, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

type Prioridad = 'Baja' | 'Media' | 'Alta';

export default function TareaEditForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const [data, setData] = useState<any>(null);
    const [originalData, setOriginalData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTarea = useCallback(async () => {
        try {
            const response = await axios.get(`/tarea/${id}`);
            setData({
                descripcion: response.data.descripcion || '',
                prioridad: response.data.prioridad as Prioridad || 'Baja',
                fechaVencimiento: response.data.fechaVencimiento
                    ? parseISO(response.data.fechaVencimiento)
                    : undefined,
                completado: response.data.completado || false,
            });
            setOriginalData(response.data);
        } catch (err: any) {
            console.error('Error cargando la tarea', err);
            setError('No se pudo cargar la tarea');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchTarea();
    }, [id, fetchTarea]);

    const handleChange = (field: string, value: any) => {
        setData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.put(`/tarea/${id}`, {
                id: parseInt(id!), // asegura que sea número
                descripcion: data.descripcion,
                prioridad: data.prioridad,
                fechaVencimiento: data.fechaVencimiento
                    ? data.fechaVencimiento.toISOString()
                    : null,
                completado: data.completado,
            });


            //   toast.success('Tarea actualizada correctamente');
            router.push('/tarea');
        } catch (err: any) {
            console.error('Error actualizando la tarea:', err.response?.data || err.message);
            //   toast.error('Error al guardar los cambios');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Baja':
                return 'text-green-500';
            case 'Media':
                return 'text-amber-500';
            case 'Alta':
                return 'text-red-500';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Clock className="animate-spin mr-2" />
                Cargando tarea...
            </div>
        );
    }

    if (error || !data) {
        return <div className="p-4 text-red-500">Error: {error || 'No se pudo cargar la tarea.'}</div>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Editar Tarea</CardTitle>
                <CardDescription>Modifica los detalles de tu tarea</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input
                            id="descripcion"
                            value={data.descripcion}
                            onChange={(e) => handleChange('descripcion', e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="prioridad">Prioridad</Label>
                        <Select
                            value={data.prioridad}
                            onValueChange={(value) => handleChange('prioridad', value)}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona prioridad" />
                            </SelectTrigger>
                            <SelectContent>
                                {(['Baja', 'Media', 'Alta'] as Prioridad[]).map((p) => (
                                    <SelectItem key={p} value={p}>
                                        <div className="flex items-center">
                                            <Flag className={cn('mr-2 h-4 w-4', getPriorityColor(p))} />
                                            <span>{p}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fecha">Fecha de vencimiento</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !data.fechaVencimiento && 'text-muted-foreground'
                                    )}
                                    disabled={isSubmitting}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.fechaVencimiento
                                        ? format(data.fechaVencimiento, 'PPP', { locale: es })
                                        : 'Seleccionar fecha'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={data.fechaVencimiento}
                                    onSelect={(date) => handleChange('fechaVencimiento', date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {data.fechaVencimiento && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 h-auto p-0 text-xs text-muted-foreground"
                                onClick={() => handleChange('fechaVencimiento', undefined)}
                                type="button"
                            >
                                Eliminar fecha
                            </Button>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="completado">¿Completado?</Label>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="completado"
                                checked={data.completado}
                                onCheckedChange={(checked) => handleChange('completado', checked)}
                                disabled={isSubmitting}
                            />
                            <span>{data.completado ? 'Sí' : 'No'}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" className="mt-4" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Clock className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar cambios
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
        </div>
    );
}
