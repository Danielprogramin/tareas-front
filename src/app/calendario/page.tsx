import { CalendarView } from "@/app/components/calendario-view"

export default function CalendarPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendario de Tareas</h1>
        <p className="text-muted-foreground">Visualiza y gestiona tus tareas organizadas por fecha</p>
      </div>
       <div className="flex justify-center">
      <CalendarView />
      </div>
    </div>
  )
}
