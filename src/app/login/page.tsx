'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle, ListTodo } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/app/features/auth/authService';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setMensaje('Sesión iniciada');
      window.location.href = '/dashboard'; // Usar window.location para forzar recarga completa
    } catch (error) {
      console.error('Error en login:', error);
      setMensaje('Credenciales incorrectas');
    }
  };

  return (
    <form onSubmit={handleLogin}>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary rounded-full p-3">
            <ListTodo className="h-8 w-8 text-white" />
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">TaskMaster</CardTitle>
            <CardDescription className="text-center">Inicia sesión para gestionar tus tareas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu@ejemplo.com"
                required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full cursor-pointer" 
              size="lg"
            >
              Iniciar sesión
            </Button>
             {mensaje && <p>{mensaje}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O</span>
              </div>
            </div>
            <div className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Regístrate
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-1">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span>Organiza tus tareas</span>
          </div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span>Establece prioridades</span>
          </div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span>Aumenta tu productividad</span>
          </div>
        </div>
      </div>
    </div>
    </form>
  )
};

export default LoginForm;
