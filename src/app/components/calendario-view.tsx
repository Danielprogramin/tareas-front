"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format, isSameDay, isSameMonth, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronLeft, ChevronRight, Clock, Edit, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "@/app/lib/axios"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Tarea {
  id: number
  descripcion: string
  prioridad: "Baja" | "Media" | "Alta"
  completado: boolean
  fechaVencimiento: string | null
}

export function CalendarView() {
  const [date, setDate] = useState<Date>(new Date())
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDateTareas, setSelectedDateTareas] = useState<Tarea[]>([])
  const router = useRouter()

  // Función para obtener todas las tareas
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

  // Cargar tareas al montar el componente
  useEffect(() => {
    fetchTareas()
  }, [])

  // Actualizar tareas del día seleccionado cuando cambia la selección o las tareas
  useEffect(() => {
    if (selectedDate && tareas.length > 0) {
      const tareasDelDia = tareas.filter((tarea) => {
        if (!tarea.fechaVencimiento) return false
        return isSameDay(parseISO(tarea.fechaVencimiento), selectedDate)
      })
      setSelectedDateTareas(tareasDelDia)
    } else {
      setSelectedDateTareas([])
    }
  }, [selectedDate, tareas])

  // Función para marcar una tarea como completada
  const completarTarea = async (id: number) => {
    try {
      await axios.patch(`/tarea/${id}/completar`)
      fetchTareas() // Recargar tareas
    } catch (err) {
      console.error("Error al completar tarea", err)
    }
  }

  // Función para obtener el color según la prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Baja":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Media":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "Alta":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200"
    }
  }

  // Función para determinar el color de fondo del día según las tareas
  const getDayBackgroundColor = (dayTasks: Tarea[]) => {
    if (dayTasks.length === 0) return ""

    // Priorizar tareas no completadas por prioridad
    if (dayTasks.some((t) => t.prioridad === "Alta" && !t.completado)) return "bg-red-200"
    if (dayTasks.some((t) => t.prioridad === "Media" && !t.completado)) return "bg-amber-200"
    if (dayTasks.some((t) => t.prioridad === "Baja" && !t.completado)) return "bg-green-200"

    // Si todas están completadas
    return "bg-blue-100"
  }

  // Renderizar días con tareas en el calendario
  const renderDay = (day: Date) => {
    // Filtrar tareas para este día
    const dayTasks = tareas.filter((tarea) => {
      if (!tarea.fechaVencimiento) return false
      return isSameDay(parseISO(tarea.fechaVencimiento), day)
    })

    // Obtener el color de fondo según las tareas
    const bgColor = getDayBackgroundColor(dayTasks)

    // Contenido del tooltip
    const tooltipContent = (
      <div className="max-w-xs">
        <div className="font-medium mb-1">{format(day, "d 'de' MMMM, yyyy", { locale: es })}</div>
        {dayTasks.length === 0 ? (
          <div className="text-sm">No hay tareas para este día</div>
        ) : (
          <div className="space-y-1">
            {dayTasks.map((tarea) => (
              <div key={tarea.id} className="text-sm flex items-center gap-1">
                {tarea.completado ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full",
                      tarea.prioridad === "Alta"
                        ? "bg-red-500"
                        : tarea.prioridad === "Media"
                          ? "bg-amber-500"
                          : "bg-green-500",
                    )}
                  />
                )}
                <span className={cn(tarea.completado && "line-through text-muted-foreground")}>
                  {tarea.descripcion}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )

    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className={cn("w-full h-full flex items-center justify-center cursor-pointer", bgColor)}>
              <div className="font-medium">{format(day, "d")}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Navegar al mes anterior
  const prevMonth = () => {
    setDate((current) => {
      const prevMonthDate = new Date(current)
      prevMonthDate.setMonth(current.getMonth() - 1)
      return prevMonthDate
    })
  }

  // Navegar al mes siguiente
  const nextMonth = () => {
    setDate((current) => {
      const nextMonthDate = new Date(current)
      nextMonthDate.setMonth(current.getMonth() + 1)
      return nextMonthDate
    })
  }

  // Navegar al mes actual
  const currentMonth = () => {
    setDate(new Date())
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>
              {format(date, "MMMM yyyy", { locale: es }).charAt(0).toUpperCase() +
                format(date, "MMMM yyyy", { locale: es }).slice(1)}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={currentMonth}>
                Hoy
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>Visualiza tus tareas organizadas por fecha</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => setSelectedDate(date ?? null)}
                month={date}
                onMonthChange={setDate}
                className="rounded-md border max-w-none w-full"
                styles={{
                  head_cell: { width: "100px" },
                  cell: { width: "100px", height: "100px" },
                  button: { width: "100%", height: "100%" },
                  nav: { display: "none" },
                  caption: { display: "none" },
                }}
                components={{
                  Day: ({ date: dayDate }) => (
                    <button
                      className={cn(
                        "h-full w-full p-0 font-normal aria-selected:opacity-100",
                        dayDate && isSameMonth(dayDate, date) ? "text-foreground" : "text-muted-foreground opacity-50",
                        dayDate &&
                          selectedDate &&
                          isSameDay(dayDate, selectedDate) &&
                          "bg-primary text-primary-foreground",
                      )}
                    >
                      {dayDate ? renderDay(dayDate) : null}
                    </button>
                  ),
                }}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded bg-red-200" />
              <span>Alta prioridad</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded bg-amber-200" />
              <span>Media prioridad</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded bg-green-200" />
              <span>Baja prioridad</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded bg-blue-200" />
              <span>Completadas</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Tareas del día seleccionado */}
      {selectedDate && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Tareas para el {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
              </CardTitle>
              <Button size="sm" onClick={() => router.push("/dashboard/nueva")}>
                <Plus className="h-4 w-4 mr-1" /> Nueva tarea
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDateTareas.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No hay tareas para este día</p>
                <Button variant="outline" className="mt-2" onClick={() => router.push("/dashboard/nueva")}>
                  <Plus className="h-4 w-4 mr-1" /> Crear tarea
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {selectedDateTareas.map((tarea) => (
                    <div
                      key={tarea.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        tarea.completado ? "bg-slate-100" : getPriorityColor(tarea.prioridad),
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {tarea.completado ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                        <div>
                          <p className={cn("font-medium", tarea.completado && "line-through text-muted-foreground")}>
                            {tarea.descripcion}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                tarea.prioridad === "Alta"
                                  ? "border-red-200 text-red-700"
                                  : tarea.prioridad === "Media"
                                    ? "border-amber-200 text-amber-700"
                                    : "border-green-200 text-green-700",
                              )}
                            >
                              {tarea.prioridad}
                            </Badge>
                            {tarea.completado && (
                              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                                Completada
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!tarea.completado && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600"
                            onClick={() => completarTarea(tarea.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600"
                          onClick={() => router.push(`/dashboard/editar/${tarea.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
