import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../../../../assets/Group 8.png";
import {
  Bell,
  Car,
  ClipboardList,
  QrCode,
  UserRound,
  MessageSquare,
  FolderOpen,
  Info,
  FileText,
  Shield,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";

const menuSections = [
  {
    title: "My Account",
    items: [
      { label: "My Account", to: "/dashboard", icon: LayoutDashboard },
      { label: "My Garage", to: "/vehicles", icon: Car },
      { label: "My Orders", to: "/orders", icon: ClipboardList },
      { label: "My Virtual QRs", to: "/virtual-qr", icon: QrCode },
      { label: "Notifications", to: "/notifications", icon: Bell },
      { label: "Document Vault", to: "/document-vault", icon: FolderOpen },
      { label: "Support Chat", to: "/chat", icon: MessageSquare },
      { label: "Update Profile", to: "/profile/update", icon: UserRound },
    ],
  },
  {
    title: "Information",
    items: [
      { label: "About Us", to: "/about-us", icon: Info },
      { label: "Terms & Conditions", to: "/terms-and-conditions", icon: FileText },
      { label: "Privacy Policy", to: "/privacy-policy", icon: Shield },
    ],
  },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("user_token");
    localStorage.removeItem("marketplace_capabilities");
    localStorage.removeItem("user_login_phone");
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-80 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:z-20 lg:w-72 lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 min-w-0">
            <img
              src={logo}
              alt="DigiVahan"
              className="h-30 w-64 max-w-full object-contain object-left"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {section.title}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
