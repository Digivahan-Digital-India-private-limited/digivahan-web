import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, link: "/page/admin/master/dashboard" },
  { name: "Admin Management", icon: Users, link: "/page/admin/master/admins" },
  // { name: "Manage Permissions", icon: Sliders, link: "/page/admin/master/permissions" },
];

function MasterSidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Cookies.remove("master_admin_token");
    toast.success("Logged out successfully");
    navigate("/page/admin/master", { replace: true });
  };

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
        <button onClick={() => setOpen(true)} className="text-gray-600 hover:text-blue-600 transition">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h1 className="text-base font-bold text-blue-600">Master Panel</h1>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen
          ${collapsed ? "w-20" : "w-64"}
          bg-white
          shadow-[4px_0_12px_rgba(0,0,0,0.08)]
          z-40 flex flex-col
          transform transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <h1 className="text-xl font-bold text-blue-600">Master Panel</h1>
            </div>
          )}
          {collapsed && (
            <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto" />
          )}

          {/* Mobile close */}
          <button className="lg:hidden text-gray-500 ml-auto" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            className="hidden lg:block text-gray-400 hover:text-blue-600 transition ml-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.link;
            return (
              <Link
                key={item.name}
                to={item.link}
                onClick={() => setOpen(false)}
                title={collapsed ? item.name : ""}
                className={`
                  flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                {!collapsed && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t">
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default MasterSidebar;
