import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  QrCode,
  MessageSquare,
  Star,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
  Users,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Smartphone,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, link: "/admin-panel" },
  { name: "Orders", icon: ShoppingCart, link: "/orders-panel" },
  { name: "QR Management", icon: QrCode, link: "/qr-panel" },
  { name: "Customer Queries", icon: MessageSquare, link: "/customer-queries" },
  { name: "Reviews", icon: Star, link: "/admin/reviews" },
  { name: "Issues / Priority", icon: AlertTriangle, link: "/admin/issues" },
  { name: "Reports", icon: FileText, link: "/admin/reports" },
  { name: "Manage User App", icon: Users, link: "/manage-user" },
  { name: "iOS App", icon: Smartphone, link: "/ios/login" },
  { name: "Settings", icon: Settings, link: "" },
];

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border-b">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-blue-600">Admin Panel</h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0
          h-screen
          ${collapsed ? 'w-20' : 'w-64'}
          bg-white
          shadow-[4px_0_12px_rgba(0,0,0,0.08)]
          z-40
          transform transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h1 className={`text-xl font-bold text-blue-600 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            {!collapsed && "Admin Panel"}
          </h1>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
          {/* Desktop Toggle Button */}
          <button 
            className="hidden lg:block text-gray-600 hover:text-blue-600 transition"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.name : ''}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className={`text-sm font-medium transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                {!collapsed && item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout (Always at bottom, no overlap) */}
        <div className="px-3 py-4 border-t">
          <button className={`flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition ${collapsed ? 'justify-center' : ''}`} title={collapsed ? 'Logout' : ''}>
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`text-sm font-medium transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              {!collapsed && "Logout"}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
