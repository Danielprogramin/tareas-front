"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Check, Clock, Edit, Loader2, MoreHorizontal, Trash } from "lucide-react"
import axios from "@/app/lib/axios"
import { format, isPast, parseISO } from "date-fns"
import { es } from "date-fns/locale"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"

interface Tarea {
  id: number
  descripcion: string
  prioridad: "Baja" | "Media" | "Alta"
  completado: boolean
  fechaVencimiento: string | null
}

// Componente para el botón de completar tarea
const TareaCompletarButton = ({ id, onComplete }: { id: number; onComplete: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleCompletar = async () => {
    setIsLoading(true)
    try {
      await axios.post(`/tarea/${id}/completar`)
      onComplete()
    } catch (err) {
      console.error("Error al completar tarea", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCompletar}
      disabled={isLoading}
      className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 cursor-pointer"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      <span className="sr-only">Completar</span>
    </Button>
  )
}

// Componente para el botón de eliminar tarea
const TareaDeleteButton = ({ id, onDelete }: { id: number; onDelete: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await axios.delete(`/tarea/${id}`)
      onDelete()
    } catch (err) {
      console.error("Error al eliminar tarea", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isLoading}
      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
      <span className="sr-only">Eliminar</span>
    </Button>
  )
}

const TareaTable = () => {
  const params = useParams();
  const id = parseInt(params?.id as string);
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchTareas = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get("/tarea")
      setTareas(res.data)
    } catch (err) {
      console.error("Error al cargar tareas", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTareas()
  }, [])

  // Función para obtener el color según la prioridad
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Baja":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Baja
          </Badge>
        )
      case "Media":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Media
          </Badge>
        )
      case "Alta":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Alta
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null

    try {
      const date = parseISO(dateString)
      const isOverdue = isPast(date) && new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)

      return {
        formatted: format(date, "d MMM yyyy", { locale: es }),
        isOverdue,
      }
    } catch (e) {
      return null
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tareas</CardTitle>
          <CardDescription>Gestiona tus tareas pendientes y completadas</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando tareas...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tareas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tareas</CardTitle>
          <CardDescription>Gestiona tus tareas pendientes y completadas</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">No hay tareas</h3>
            <p className="text-sm text-muted-foreground">Crea una nueva tarea para comenzar</p>
            <Button className="mt-2" onClick={() => router.push("/tarea/create")}>
              Crear tarea
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas</CardTitle>
        <CardDescription>Gestiona tus tareas pendientes y completadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Descripción</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tareas.map((tarea) => {
                const dateInfo = tarea.fechaVencimiento ? formatDate(tarea.fechaVencimiento) : null

                return (
                  <TableRow key={tarea.id}>
                    <TableCell className="font-medium">{tarea.descripcion}</TableCell>
                    <TableCell>{getPriorityBadge(tarea.prioridad)}</TableCell>
                    <TableCell>
                      {dateInfo ? (
                        <div className="flex items-center gap-1">
                          <CalendarIcon
                            className={cn(
                              "h-4 w-4",
                              dateInfo.isOverdue && !tarea.completado ? "text-red-500" : "text-muted-foreground",
                            )}
                          />
                          <span
                            className={cn(dateInfo.isOverdue && !tarea.completado ? "text-red-500 font-medium" : "")}
                          >
                            {dateInfo.formatted}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tarea.completado ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="mr-1 h-3 w-3" /> Completada
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Clock className="mr-1 h-3 w-3" /> Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!tarea.completado && <TareaCompletarButton id={tarea.id} onComplete={fetchTareas} />}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/tarea/edit?id=${tarea.id}`)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>

                        <TareaDeleteButton id={tarea.id} onDelete={fetchTareas} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default TareaTable
