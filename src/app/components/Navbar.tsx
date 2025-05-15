"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { autenticado, logout, usuario } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="w-full h-16 bg-sidebar flex items-center justify-between px-6 border-b border-sidebar-border">
      <div className="text-xl font-bold">Tareas App</div>
      <nav className="flex gap-4 items-center">
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/tarea" className="hover:underline">Tareas</Link>
        {autenticado && (
          <>
            <span className="mx-2 text-sm text-gray-500">{usuario}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
