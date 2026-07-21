import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
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
  CalendarDays,
  UserX,
  Webhook,
  BriefcaseBusiness,
  BarChart2,
  Layers,
} from "lucide-react";
import { MyContext } from "../../ContextApi/DataProvider";


const menuItems = [
  { key: "dashboard",                name: "Dashboard",               icon: LayoutDashboard,  link: "/admin-panel" },
  { key: "orders",                   name: "Orders",                  icon: ShoppingCart,      link: "/orders-panel" },
  { key: "qr_management",           name: "QR Management",           icon: QrCode,            link: "/qr-panel" },
  { key: "user_management",         name: "User Management",         icon: Users,             link: "/user-management" },
  { key: "analytics",               name: "Analytics",               icon: BarChart2,         link: "/analytics" },
  { key: "customer_queries",        name: "Customer Queries",        icon: MessageSquare,     link: "/customer-queries" },
  { key: "raise_concern",           name: "Raise Concern",           icon: AlertTriangle,     link: "/manage-concerns" },
  { key: "delete_account_requests", name: "Delete Account Request",  icon: UserX,             link: "/delete-account-requests" },
  { key: "report_issue",            name: "Report Issue",            icon: FileText,          link: "/report-issues" },
  { key: "manage_appointment",      name: "Manage Appointment",      icon: CalendarDays,      link: "/manage-appointment" },
  { key: "challan_webhook",         name: "Challan Webhook",         icon: Webhook,           link: "/challan-webhook-admin" },
  { key: "app_management",          name: "App Management",          icon: Layers,            link: "/management" },
  { key: "hr_manager",              name: "HR Manager",              icon: BriefcaseBusiness, link: "/hr-manager" },
];

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { LogoutAdmin } = useContext(MyContext);

  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("admin_permissions") || "{}");
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = Cookies.get("admin_token");
        if (!token) return;
        const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";
        const res = await fetch(`${BASE_URL}/api/auth/admin/my-permissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const fetchedPerms = data.pages || {};
          setPermissions(fetchedPerms);
          localStorage.setItem("admin_permissions", JSON.stringify(fetchedPerms));
        }
      } catch (error) {
        console.error("Failed to sync permissions", error);
      }
    };
    fetchPermissions();
  }, []);

  // ✅ Show ONLY pages where permission is explicitly true
  // New admins start with all permissions = false (no access)
  // Master Admin must grant access to each page individually
  const visibleItems = menuItems.filter(item =>
    permissions[item.key] === true
  );

  const handleLogout = async () => {
    const result = await LogoutAdmin();
    if (result) {
      navigate("/login-page");
    }
  };

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
          {visibleItems.length === 0 ? (
            /* ✅ No permissions assigned yet */
            !collapsed && (
              <div className="flex flex-col items-center justify-center text-center py-8 px-2">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-500 mb-1">No Access Yet</p>
                <p className="text-xs text-gray-400 leading-relaxed">Contact Master Admin to grant you page permissions.</p>
              </div>
            )
          ) : (
            visibleItems.map((item, index) => (
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
            ))
          )}
        </nav>

        {/* Logout (Always at bottom, no overlap) */}
        <div className="px-3 py-4 border-t">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Logout' : ''}
          >
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
