import React from "react";
import { NavLink } from "react-router-dom";
import { ClipboardList, House, ShoppingBag, Store } from "lucide-react";

const navItems = [
  { label: "Hub", to: "/marketplace", icon: House },
  { label: "Buy", to: "/marketplace/buy", icon: ShoppingBag },
  { label: "Sell", to: "/marketplace/sell", icon: ClipboardList },
  { label: "Account", to: "/dashboard", icon: Store },
];

const MarketplaceBottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white lg:hidden">
      <ul className="grid grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium ${
                    isActive ? "text-sky-700" : "text-slate-500"
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

export default MarketplaceBottomNavigation;
