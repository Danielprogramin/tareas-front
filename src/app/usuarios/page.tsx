"use client"

import { useEffect, useState } from "react"
import { Loader2, PencilIcon, ShieldAlert, ShieldCheck, UserCircle, X } from "lucide-react"
import { fetchUsuariosConRoles, asignarRolAUsuario, removerRolDeUsuario } from "@/app/features/usuarios/fetchUsuarios"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const rolesDisponibles = ["Usuario", "Admin"]

interface Usuario {
  id: string
  email: string
  roles: string[]
}

const UsuariosTableConRoles = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [rolSeleccionado, setRolSeleccionado] = useState("")
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsuarios = async () => {
    setIsLoading(true)
    try {
      const data = await fetchUsuariosConRoles()
      setUsuarios(data)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
    //   toast({
    //     title: "Error",
    //     description: "No se pudieron cargar los usuarios",
    //     variant: "destructive",
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const abrirModal = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setRolSeleccionado("")
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setUsuarioSeleccionado(null)
    setRolSeleccionado("")
  }

  const manejarRol = async (accion: "asignar" | "remover") => {
    if (!usuarioSeleccionado || !rolSeleccionado) {
    //   toast({
    //     title: "Selecciona un rol",
    //     description: "Debes seleccionar un rol para continuar",
    //     variant: "destructive",
    //   })
      return
    }

    setIsSubmitting(true)
    try {
      if (accion === "asignar") {
        await asignarRolAUsuario(usuarioSeleccionado.id, rolSeleccionado)
        // toast({
        //   title: "Rol asignado",
        //   description: `El rol ${rolSeleccionado} ha sido asignado correctamente a ${usuarioSeleccionado.email}`,
        // })
      } else {
        await removerRolDeUsuario(usuarioSeleccionado.id, rolSeleccionado)
        // toast({
        //   title: "Rol removido",
        //   description: `El rol ${rolSeleccionado} ha sido removido correctamente de ${usuarioSeleccionado.email}`,
        // })
      }
      await fetchUsuarios() // Refrescar lista
      cerrarModal() // Cerrar el modal después de la acción
    } catch (err) {
      console.error("❌ Error modificando rol:", err)
    //   toast({
    //     title: "Error",
    //     description: "No se pudo modificar el rol del usuario",
    //     variant: "destructive",
    //   })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Renderizar el badge según el rol
  const getRolBadge = (rol: string) => {
    switch (rol) {
      case "Admin":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <ShieldAlert className="mr-1 h-3 w-3" /> Admin
          </Badge>
        )
      case "Usuario":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <UserCircle className="mr-1 h-3 w-3" /> Usuario
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {rol}
          </Badge>
        )
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Usuarios y Roles</CardTitle>
          <CardDescription>Gestiona los roles de los usuarios del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : usuarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UserCircle className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No hay usuarios</h3>
              <p className="text-sm text-muted-foreground mt-1">No se encontraron usuarios en el sistema</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Email</TableHead>
                    <TableHead className="w-[40%]">Roles actuales</TableHead>
                    <TableHead className="w-[15%]">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.email}</TableCell>
                      <TableCell>
                        {usuario.roles && usuario.roles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {usuario.roles.map((rol: string) => (
                              <div key={rol}>{getRolBadge(rol)}</div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin roles asignados</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => abrirModal(usuario)}>
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Modificar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para editar roles */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modificar roles de usuario</DialogTitle>
            <DialogDescription>
              {usuarioSeleccionado
                ? `Gestiona los roles para ${usuarioSeleccionado.email}`
                : "Selecciona un rol para asignar o remover"}
            </DialogDescription>
          </DialogHeader>

          {usuarioSeleccionado && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Roles actuales</h4>
                {usuarioSeleccionado.roles && usuarioSeleccionado.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {usuarioSeleccionado.roles.map((rol: string) => (
                      <div key={rol}>{getRolBadge(rol)}</div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Sin roles asignados</span>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Seleccionar rol</h4>
                <Select value={rolSeleccionado} onValueChange={setRolSeleccionado}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesDisponibles.map((rol) => (
                      <SelectItem key={rol} value={rol}>
                        {rol === "Admin" ? (
                          <div className="flex items-center">
                            <ShieldAlert className="mr-2 h-4 w-4 text-purple-500" />
                            <span>Admin</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <UserCircle className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Usuario</span>
                          </div>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button className="cursor-pointer" variant="outline" onClick={cerrarModal} disabled={isSubmitting}>
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 cursor-pointer"
                onClick={() => manejarRol("asignar")}
                disabled={isSubmitting || !rolSeleccionado}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <ShieldCheck className="h-4 w-4 mr-1" />
                )}
                Asignar
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                onClick={() => manejarRol("remover")}
                disabled={isSubmitting || !rolSeleccionado}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <X className="h-4 w-4 mr-1" />}
                Quitar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UsuariosTableConRoles
