"use client"

import { useAuth } from "@/app/hooks/useAuth"
import { useEffect, useState } from "react"
import axios from "@/app/lib/axios"
import { CheckCircle, ClipboardList, Clock, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Estadisticas {
  total: string
  completadas: string
  pendientes: string
}

const DashboardPage = () => {
  const { autenticado, loading: authLoading } = useAuth()
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    total: "0",
    completadas: "0",
    pendientes: "0",
  })
  const [loading, setLoading] = useState(true)

useEffect(() => {
  if (authLoading || !autenticado) return;

  const fetchEstadisticas = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/tarea/estadisticas");
      console.log("Estadísticas:", res.data);
      setEstadisticas(res.data);
    } catch (err) {
      console.error("Error al obtener estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEstadisticas();
}, [autenticado, authLoading]); // Asegurarse de que se dispare cuando authLoading cambia


  // Calcular el porcentaje de tareas completadas
  const completionRate =
    estadisticas.total !== "0"
      ? Math.round((Number.parseInt(estadisticas.completadas) / Number.parseInt(estadisticas.total)) * 100)
      : 0

  if (authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!autenticado) return null // redirigido por el hook

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de gestión de tareas. Aquí puedes ver un resumen de tus actividades.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta de Tareas Totales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Totales</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : estadisticas.total}</div>
            <p className="text-xs text-muted-foreground">Número total de tareas en el sistema</p>
          </CardContent>
        </Card>
        
        {/* Tarjeta de Tareas Pendientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : estadisticas.pendientes}</div>
            <p className="text-xs text-muted-foreground">Tareas que aún necesitan ser completadas</p>
          </CardContent>
        </Card>

        {/* Tarjeta de Tareas Completadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : estadisticas.completadas}</div>
            <p className="text-xs text-muted-foreground">Tareas que has marcado como completadas</p>
          </CardContent>
        </Card>

      </div>

      {/* Tarjeta de Progreso */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Tareas</CardTitle>
          <CardDescription>Porcentaje de tareas completadas respecto al total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-medium">Completadas</span>
              </div>
              <span className="text-sm font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Has completado {estadisticas.completadas} de {estadisticas.total} tareas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sección adicional para consejos o información */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Consejos para la productividad</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
              <span>Prioriza tus tareas más importantes al inicio del día</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
              <span>Divide proyectos grandes en tareas más pequeñas y manejables</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
              <span>Establece fechas límite realistas para mantener el enfoque</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
