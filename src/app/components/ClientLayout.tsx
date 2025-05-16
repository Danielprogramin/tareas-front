'use client';

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

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar children={undefined} />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
    </div>
  );
};

export default ClientLayout;
