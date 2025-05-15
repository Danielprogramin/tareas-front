import React from "react";
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Tareas", path: "/tarea" },
    { label: "Crear Tarea", path: "/tarea/create" },
  ];

  return (
    <aside className="w-64 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col p-4">
      <div className="text-2xl font-bold mb-8">Menú</div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="px-4 py-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
