import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Store, UserRound } from "lucide-react";
import Cookies from "js-cookie";
import { getProfile } from "../../../profile/services/profileApi";
import { listNotifications } from "../../../notifications/services/notificationsApi";

const Header = ({
  onOpenSidebar,
  title = "My Account",
  userName = "Rajat",
  actionButton,
}) => {
  const navigate = useNavigate();
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
  const displayName = profile?.name || userName;
  const displayAvatar =
    profile?.avatar || "https://randomuser.me/api/portraits/men/75.jpg";

  const handleLogout = () => {
    Cookies.remove("user_token");
    localStorage.removeItem("marketplace_capabilities");
    localStorage.removeItem("user_login_phone");
    queryClient.removeQueries({ queryKey: ["user-profile"] });
    queryClient.removeQueries({ queryKey: ["user-notifications"] });
    queryClient.removeQueries({ queryKey: ["user-vehicles"] });
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-600">DigiVahan</p>
            <h1 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {actionButton ? (
            <button
              type="button"
              onClick={() => navigate(actionButton.to)}
              className={`inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-sm font-semibold transition sm:px-4 ${
                actionButton.variant === "secondary"
                  ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "bg-linear-to-r from-amber-300 via-yellow-400 to-orange-400 text-slate-900 shadow-[0_8px_20px_-12px_rgba(251,146,60,0.9)] hover:-translate-y-0.5"
              }`}
            >
              <Store size={16} />
              <span className="hidden sm:inline">{actionButton.label}</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            )}
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
            <img
              src={displayAvatar}
              alt={displayName}
              className="h-8 w-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden pr-1 sm:block">
              <p className="text-xs font-medium text-slate-500">Welcome</p>
              <p className="text-sm font-semibold text-slate-900 leading-none">{displayName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Profile"
          >
            <UserRound size={18} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 lg:w-auto lg:px-3"
            aria-label="Logout"
          >
            <LogOut size={18} />
            <span className="hidden lg:inline text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
