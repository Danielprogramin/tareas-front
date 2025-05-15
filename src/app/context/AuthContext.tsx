'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getUser, login as loginAPI, logout as logoutAPI } from '../features/auth/authService';

interface AuthContextType {
  token: string | null;
  usuario: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  autenticado: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      cargarUsuario(savedToken);
    }
  }, []);

  const cargarUsuario = async (jwt: string) => {
    try {
      const res = await getUser(jwt);
      setUsuario(res.data.email);
    } catch {
      setToken(null);
      setUsuario(null);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await loginAPI(email, password);
    const jwt = res.data.token;
    localStorage.setItem('token', jwt);
    setToken(jwt);
    await cargarUsuario(jwt);
  };

  const logout = async () => {
    await logoutAPI();
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  const autenticado = !!token;

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, autenticado }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
};
