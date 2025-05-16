"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { LayoutDashboard, ListTodo, LogOut, Menu, Moon, Settings, Sun, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "@/app/components/theme-provider"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/app/hooks/use-mobile"

const Navbar = () => {
  const { autenticado, logout, usuario } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Detectar scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
    setMobileMenuOpen(false)
  }

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

  // Componente para los enlaces de navegación
  const NavLink = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => {
    const isActive = pathname === href

    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground/80 hover:text-primary hover:bg-primary/5",
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        {icon}
        {children}
      </Link>
    )
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm" : "bg-background border-b",
      )}
    >
      <div className="container flex h-16 items-center justify-end">
        {/* Acciones de usuario */}
        <div className="flex items-center gap-2">
          {/* Botón de tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Cambiar tema</span>
          </Button>

          {/* Usuario y menú de perfil */}
          {autenticado ? (
            <>
              {/* Menú de usuario en escritorio */}
              {!isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" alt={usuario || "Usuario"} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{usuario}</p>
                        <p className="text-xs leading-none text-muted-foreground">Usuario</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/perfil">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/configuracion">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Botón de menú móvil */}
              {isMobile && (
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                    <SheetHeader className="border-b pb-4 mb-4">
                      <SheetTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <span>{usuario}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-full absolute right-4 top-4"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-1">
                      <NavLink href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>
                        Dashboard
                      </NavLink>
                      <NavLink href="/tarea" icon={<ListTodo className="h-5 w-5" />}>
                        Tareas
                      </NavLink>
                      <NavLink href="/usuarios" icon={<User className="h-5 w-5" />}>
                        Usuarios
                      </NavLink>
                      <NavLink href="/configuracion" icon={<Settings className="h-5 w-5" />}>
                        Configuración
                      </NavLink>
                      <div className="mt-4 pt-4 border-t">
                        <Button variant="destructive" className="w-full" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Cerrar sesión
                        </Button>
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
