import React from "react";
import { NavLink } from "react-router-dom";
import { House, Car, QrCode, Bell, UserRound } from "lucide-react";

const navItems = [
  { label: "Home", to: "/dashboard", icon: House },
  { label: "Garage", to: "/vehicles", icon: Car },
  { label: "QR", to: "/virtual-qr", icon: QrCode },
  { label: "Alerts", to: "/notifications", icon: Bell },
  { label: "Profile", to: "/profile", icon: UserRound },
];

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white lg:hidden">
      <ul className="grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium ${
                    isActive ? "text-emerald-600" : "text-slate-500"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavigation;
