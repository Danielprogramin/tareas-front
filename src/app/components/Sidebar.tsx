"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, ListTodo, PlusCircle, Users, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/app/context/AuthContext"

// Definición de los elementos del menú con iconos
const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Tareas", path: "/tarea", icon: ListTodo },
  { label: "Crear Tarea", path: "/tarea/create", icon: PlusCircle },
  { label: "Usuarios", path: "/usuarios", icon: Users },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { usuario } = useAuth()

  // Obtener las iniciales del usuario para el avatar
  const getUserInitials = () => {
    if (!usuario) return "U"

    // Si el usuario es un email, tomar la primera letra
    if (usuario.includes("@")) {
      return usuario.charAt(0).toUpperCase()
    }

    // Si es un nombre, tomar las iniciales
    const parts = usuario.split(" ")
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
    }

    return usuario.charAt(0).toUpperCase()
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="bg-primary rounded-md p-1">
            <ListTodo className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="font-semibold text-lg">TaskMaster</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.label}>
                    <Link href={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/configuracion"} tooltip="Configuración">
                  <Link href="/configuracion">
                    <Settings className="h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-sidebar-accent/50">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt={usuario || "Usuario"} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate">{usuario || "Usuario"}</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1">
          <div className="container py-4">
            <div className="flex items-center mb-4">
            </div>
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default SidebarWrapper
