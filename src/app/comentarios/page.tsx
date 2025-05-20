"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageCircle, Loader2, Send } from "lucide-react"
import axios from "@/app/lib/axios"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Comentario {
  id: number
  texto: string
  fecha: string
}

interface ComentarioFormProps {
  tareaId: number
  onSuccess?: () => void
}

// Componente de formulario de comentarios
const ComentarioForm = ({ tareaId, onSuccess }: ComentarioFormProps) => {
  const [texto, setTexto] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim()) return

    setLoading(true)

    try {
      await axios.post("/comentario", { tareaId, texto })
      setTexto("")
      onSuccess?.()
    } catch (err) {
      console.error("Error al guardar comentario:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-start gap-2">
        <Textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="min-h-[80px] flex-1"
          required
        />
        <Button type="submit" size="icon" disabled={loading} className="mt-1 cursor-pointer">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  )
}

// Componente de lista de comentarios
const ComentarioList = ({ tareaId, refresh }: { tareaId: number; refresh: number }) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComentarios = async () => {
    try {
      const res = await axios.get(`/comentario/tarea/${tareaId}`)
      setComentarios(res.data)
    } catch (error) {
      console.error("Error al obtener comentarios:", error)
    } finally {
      setLoading(false)
    }
  }

  // Efecto para cargar comentarios
  useEffect(() => {
    fetchComentarios()
  }, [tareaId, refresh])

  // Formatear fecha
  const formatearFecha = (fechaStr: string) => {
    try {
      const fecha = parseISO(fechaStr)
      return format(fecha, "d MMM yyyy, HH:mm", { locale: es })
    } catch (e) {
      return fechaStr
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (comentarios.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No hay comentarios aún.</p>
        <p className="text-sm">Sé el primero en comentar esta tarea.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 my-4">
      {comentarios.map((c) => (
        <div key={c.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p>{c.texto}</p>
            </div>
            <p className="text-xs text-muted-foreground">{formatearFecha(c.fecha)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente principal del modal de comentarios
interface ComentariosModalProps {
  tareaId: number
  titulo?: string
}

export default function ComentariosModal({ tareaId, titulo = "Comentarios de la tarea" }: ComentariosModalProps) {
  const [refreshCounter, setRefreshCounter] = useState(0)
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setRefreshCounter((prev) => prev + 1)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
          <MessageCircle className="h-4 w-4" />
          <span>Comentarios</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>Visualiza y añade comentarios relacionados con esta tarea.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <ComentarioList tareaId={tareaId} refresh={refreshCounter} />
        </ScrollArea>

        <Separator />

        <ComentarioForm tareaId={tareaId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
