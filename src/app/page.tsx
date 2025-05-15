import Link from "next/link"
import { CheckCircle, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Logo y título */}
        <div className="space-y-4">
          <div className="mx-auto bg-primary rounded-full p-4 w-20 h-20 flex items-center justify-center">
            <ClipboardList className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Bienvenido a TaskMaster</h1>
          <p className="text-xl text-slate-600 max-w-md mx-auto">
            La forma más sencilla de organizar tus tareas diarias
          </p>
        </div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          <div className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm">
            <div className="rounded-full bg-primary/10 p-2 mb-3">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Organiza tus tareas</h3>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm">
            <div className="rounded-full bg-primary/10 p-2 mb-3">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Establece prioridades</h3>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm">
            <div className="rounded-full bg-primary/10 p-2 mb-3">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Aumenta tu productividad</h3>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="px-8">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link href="/register">Crear cuenta</Link>
          </Button>
        </div>

        {/* Nota de pie */}
        <p className="text-sm text-slate-500 pt-8">Comienza a gestionar tus tareas de forma eficiente hoy mismo</p>
      </div>
    </div>
  )
}
