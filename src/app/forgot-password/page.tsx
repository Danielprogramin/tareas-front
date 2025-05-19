"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ListTodo, Mail, Loader2 } from "lucide-react"
import axios from "@/app/lib/axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMensaje(null)

    try {
      await axios.post("/email/forgot-password", { email })
      setMensaje({
        tipo: "success",
        texto: "Se ha enviado un enlace de recuperación a tu correo electrónico.",
      })
      // Opcional: limpiar el campo de email después de éxito
      setEmail("")
    } catch (err) {
      console.error(err)
      setMensaje({
        tipo: "error",
        texto: "No se pudo enviar el correo. Por favor, verifica tu dirección e intenta nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary rounded-full p-3">
            <ListTodo className="h-8 w-8 text-white" />
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Recuperar contraseña</CardTitle>
            <CardDescription className="text-center">
              Ingresa tu correo electrónico para recibir un enlace de recuperación
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {mensaje && (
                <Alert variant={mensaje.tipo === "success" ? "default" : "destructive"} className="mb-4">
                  {mensaje.tipo === "success" ? <Mail className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  <AlertTitle>{mensaje.tipo === "success" ? "Correo enviado" : "Error"}</AlertTitle>
                  <AlertDescription>{mensaje.texto}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar enlace de recuperación"
                )}
              </Button>
            </CardContent>
          </form>
          <CardFooter>
            <div className="w-full flex justify-center">
              <Button variant="link" asChild>
                <Link href="/login" className="flex items-center text-sm text-primary">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Volver al inicio de sesión
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
