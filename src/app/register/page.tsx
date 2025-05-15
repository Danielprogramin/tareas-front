'use client';

import React, { useState } from 'react';
import Link from "next/link"
import { ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from '@/app/features/auth/authService';
import { useRouter } from 'next/navigation';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      setMensaje('Registro exitoso. Redirigiendo...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (error: any) {
      console.error(error);
      setMensaje('Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary rounded-full p-3">
            <ListTodo className="h-8 w-8 text-white" />
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
            <CardDescription className="text-center">Regístrate para comenzar a gestionar tus tareas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu@ejemplo.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Crear cuenta
            </Button>
            {mensaje && <p>{mensaje}</p>}
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
    </form>
  )
};

export default RegisterForm;
