"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/register" || pathname === "/";

  return (
    <>
      {!hideLayout && <Navbar />}
      <div className="flex">
        {!hideLayout && <Sidebar />}
        <main className="flex-1 p-6 bg-background min-h-screen">{children}</main>
      </div>
    </>
  );
};

export default ClientLayout;
