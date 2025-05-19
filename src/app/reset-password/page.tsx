"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Eye, EyeOff, ListTodo, Loader2, ShieldAlert, ShieldCheck } from "lucide-react"
import axios from "@/app/lib/axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const email = searchParams.get("email")
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Calcular la fortaleza de la contraseña
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    // Longitud mínima
    if (password.length >= 8) strength += 25
    // Contiene números
    if (/\d/.test(password)) strength += 25
    // Contiene letras minúsculas y mayúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
    // Contiene caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) strength += 25

    setPasswordStrength(strength)
  }, [password])

  // Función para obtener el color de la barra de progreso
  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500"
    if (passwordStrength < 75) return "bg-amber-500"
    return "bg-green-500"
  }

  // Función para obtener el texto de fortaleza
  const getStrengthText = () => {
    if (passwordStrength < 50) return "Débil"
    if (passwordStrength < 75) return "Media"
    return "Fuerte"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirm) {
      setMensaje({
        tipo: "error",
        texto: "Las contraseñas no coinciden. Por favor, verifica que sean iguales.",
      })
      return
    }

    if (passwordStrength < 50) {
      setMensaje({
        tipo: "error",
        texto:
          "La contraseña es demasiado débil. Debe tener al menos 8 caracteres, incluir números, mayúsculas y caracteres especiales.",
      })
      return
    }

    setLoading(true)
    setMensaje(null)

    try {
      await axios.post("/email/reset-password", {
        email,
        token,
        newPassword: password,
      })

      setMensaje({
        tipo: "success",
        texto: "Contraseña restablecida correctamente. Serás redirigido al inicio de sesión en unos segundos.",
      })
      setTimeout(() => router.push("/login"), 3000)
    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: "Error al restablecer la contraseña. El enlace puede haber expirado o ser inválido.",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Si no hay email o token, mostrar un mensaje de error
  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Enlace inválido</CardTitle>
            <CardDescription className="text-center">
              El enlace para restablecer la contraseña es inválido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se encontraron los parámetros necesarios en el enlace. Por favor, solicita un nuevo enlace de
                recuperación.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/forgot-password">Solicitar nuevo enlace</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
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
            <CardTitle className="text-2xl text-center">Restablecer contraseña</CardTitle>
            <CardDescription className="text-center">Crea una nueva contraseña para tu cuenta {email}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {mensaje && (
                <Alert variant={mensaje.tipo === "success" ? "default" : "destructive"} className="mb-4">
                  {mensaje.tipo === "success" ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                  <AlertTitle>{mensaje.tipo === "success" ? "¡Éxito!" : "Error"}</AlertTitle>
                  <AlertDescription>{mensaje.texto}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                  </Button>
                </div>

                {password && (
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span>Fortaleza:</span>
                      <span
                        className={
                          passwordStrength >= 75
                            ? "text-green-600"
                            : passwordStrength >= 50
                              ? "text-amber-600"
                              : "text-red-600"
                        }
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <Progress value={passwordStrength} className={`h-1 ${getStrengthColor()}`} />
                    <ul className="text-xs space-y-1 text-muted-foreground mt-2">
                      <li className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-600" : ""}`}>
                        {password.length >= 8 ? <Check className="h-3 w-3" /> : "•"} Al menos 8 caracteres
                      </li>
                      <li className={`flex items-center gap-1 ${/\d/.test(password) ? "text-green-600" : ""}`}>
                        {/\d/.test(password) ? <Check className="h-3 w-3" /> : "•"} Al menos un número
                      </li>
                      <li
                        className={`flex items-center gap-1 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? "text-green-600" : ""}`}
                      >
                        {/[a-z]/.test(password) && /[A-Z]/.test(password) ? <Check className="h-3 w-3" /> : "•"}{" "}
                        Mayúsculas y minúsculas
                      </li>
                      <li
                        className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}`}
                      >
                        {/[^A-Za-z0-9]/.test(password) ? <Check className="h-3 w-3" /> : "•"} Al menos un carácter
                        especial
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                  </Button>
                </div>
                {password && confirm && password !== confirm && (
                  <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Restableciendo...
                  </>
                ) : (
                  "Restablecer contraseña"
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
