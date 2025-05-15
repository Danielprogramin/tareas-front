"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, CheckCircle2, Clock, Flag } from "lucide-react"
import axios from "@/app/lib/axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const TareaForm = () => {
  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState<"Baja" | "Media" | "Alta">("Baja")
  const [fecha, setFecha] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axios.post("/tarea", {
        descripcion,
        prioridad,
        fechaVencimiento: fecha ? fecha.toISOString() : null,
      })

      // Resetear el formulario
      setDescripcion("")
      setPrioridad("Baja")
      setFecha(undefined)

      router.push('/tarea') // o router.push('/dashboard')
    } catch (err: any) {
      console.error("Error al crear tarea", err.response?.data || err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para obtener el color según la prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Baja":
        return "text-green-500"
      case "Media":
        return "text-amber-500"
      case "Alta":
        return "text-red-500"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Nueva Tarea</CardTitle>
        <CardDescription>Crea una nueva tarea para tu lista</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              placeholder="¿Qué necesitas hacer?"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prioridad">Prioridad</Label>
            <Select value={prioridad} onValueChange={(value) => setPrioridad(value as any)}>
              <SelectTrigger id="prioridad" className="w-full">
                <SelectValue placeholder="Selecciona la prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baja">
                  <div className="flex items-center">
                    <Flag className={cn("mr-2 h-4 w-4", getPriorityColor("Baja"))} />
                    <span>Baja</span>
                  </div>
                </SelectItem>
                <SelectItem value="Media">
                  <div className="flex items-center">
                    <Flag className={cn("mr-2 h-4 w-4", getPriorityColor("Media"))} />
                    <span>Media</span>
                  </div>
                </SelectItem>
                <SelectItem value="Alta">
                  <div className="flex items-center">
                    <Flag className={cn("mr-2 h-4 w-4", getPriorityColor("Alta"))} />
                    <span>Alta</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de vencimiento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="fecha"
                  className={cn("w-full justify-start text-left font-normal", !fecha && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fecha ? format(fecha, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={fecha} onSelect={setFecha} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter>
        
          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Crear Tarea
              </>
            )}
          </Button>
     
        </CardFooter>
      </form>
    </Card>
    </div>
  )
}

export default TareaForm
