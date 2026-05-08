import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 👇 Removed useAuth and <Navigate> here because <ProtectedRoute> handles it!

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />
        <main
          className="flex-1 overflow-y-auto p-4 md:p-8"
          style={{
            animation: "fadeSlideIn 220ms ease forwards",
          }}
        >
          <style>
            {`
              @keyframes fadeSlideIn {
                from { opacity: 0; transform: translateY(6px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
