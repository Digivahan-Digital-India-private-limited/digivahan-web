import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  Bell,
  ChevronDown,
  House,
  LogOut,
  Menu,
  Store,
  UserRound,
  X,
} from "lucide-react";
import logo from "../../../../assets/Group 8.png";
import { getProfile } from "../../../profile/services/profileApi";
import { listNotifications } from "../../../notifications/services/notificationsApi";

const desktopLinks = [
  { label: "Marketplace Home", to: "/marketplace" },
  { label: "Buy Cars", to: "/marketplace/buy" },
  { label: "Sell Cars", to: "/marketplace/sell" },
  { label: "Trust Center", to: "/marketplace/trust" },
  { label: "Reviews", to: "/marketplace/reviews" },
  { label: "Support", to: "/marketplace/support" },
];

const guideLinks = [
  { label: "How It Works", to: "/marketplace#how-it-works" },
  { label: "FAQs", to: "/marketplace#faq" },
  { label: "EMI Calculator", to: "/marketplace/tools/emi" },
  { label: "Service Cost", to: "/marketplace/tools/service-cost" },
];

const MarketplaceNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
    staleTime: 60 * 1000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: listNotifications,
    staleTime: 30 * 1000,
  });

  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleLogout = () => {
    Cookies.remove("user_token");
    localStorage.removeItem("marketplace_capabilities");
    localStorage.removeItem("user_login_phone");
    queryClient.removeQueries({ queryKey: ["user-profile"] });
    queryClient.removeQueries({ queryKey: ["user-notifications"] });
    navigate("/login", { replace: true });
  };

  const onGuideClick = (path) => {
    setOpen(false);
    const [targetPath, hash] = path.split("#");

    if (location.pathname !== targetPath) {
      navigate(path);
      return;
    }

    if (!hash) {
      return;
    }

    requestAnimationFrame(() => {
      const node = document.getElementById(hash);
      node?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/marketplace" className="shrink-0" onClick={() => setOpen(false)}>
            <img src={logo} alt="DigiVahan" className="h-14 w-auto object-contain sm:h-16" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {desktopLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold leading-none transition ${
                    isActive
                      ? "bg-sky-100 text-sky-800"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold leading-none text-slate-700 transition hover:bg-slate-100"
              >
                Guides & Tools
                <ChevronDown size={14} />
              </button>
              <div className="pointer-events-none invisible absolute left-0 top-full z-30 w-44 pt-2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                  {guideLinks.map((item) => (
                    <button
                      key={item.to}
                      type="button"
                      onClick={() => onGuideClick(item.to)}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mp-animate-pulse-glow inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_26px_-14px_rgba(249,115,22,0.95)] transition hover:from-amber-600 hover:to-orange-600"
          >
            <House size={15} />
            <span className="whitespace-nowrap">DigiVahan Home</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <Store size={15} />
            <span className="whitespace-nowrap">My Account</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" /> : null}
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
            <img
              src={profile?.avatar || "https://randomuser.me/api/portraits/men/75.jpg"}
              alt={profile?.name || "User"}
              className="h-8 w-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="pr-1">
              <p className="text-xs font-medium text-slate-500">Welcome</p>
              <p className="text-sm font-semibold leading-none text-slate-900">
                {profile?.name || "DigiVahan User"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            aria-label="Profile"
          >
            <UserRound size={18} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
            {desktopLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-semibold ${
                    isActive ? "bg-sky-100 text-sky-800" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {guideLinks.map((item) => (
              <button
                key={item.to}
                type="button"
                onClick={() => onGuideClick(item.to)}
                className="rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-3 py-2 text-left text-sm font-semibold text-white"
            >
              <House size={15} />
              DigiVahan Home
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/dashboard");
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700"
            >
              My Account
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-rose-200 px-3 py-2 text-left text-sm font-semibold text-rose-600"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default MarketplaceNavbar;
