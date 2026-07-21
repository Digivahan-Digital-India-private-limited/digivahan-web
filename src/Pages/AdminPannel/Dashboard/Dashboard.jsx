import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "./StateCard";

import {
  Clock,
  QrCode,
  AlertCircle,
  ThumbsDown,
  AlertTriangle,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MyContext } from "../../../ContextApi/DataProvider";

// Charts Data
const happyCustomersData = [
  { month: "Jan", customers: 1200 },
  { month: "Feb", customers: 1800 },
  { month: "Mar", customers: 2400 },
  { month: "Apr", customers: 2200 },
  { month: "May", customers: 2800 },
  { month: "Jun", customers: 3200 },
];

const tempCustomerData = [
  { month: "Jan", customers: 450 },
  { month: "Feb", customers: 380 },
  { month: "Mar", customers: 520 },
  { month: "Apr", customers: 480 },
  { month: "May", customers: 600 },
  { month: "Jun", customers: 580 },
];

const salesData = [
  { week: "Week 1", amount: 45000 },
  { week: "Week 2", amount: 52000 },
  { week: "Week 3", amount: 48000 },
  { week: "Week 4", amount: 58000 },
];

const deleteRequestData = [
  { name: "Approved", value: 12, color: "#10b981" },
  { name: "Pending", value: 8, color: "#f59e0b" },
  { name: "Rejected", value: 5, color: "#ef4444" },
];

const Dashboard = () => {
  const { LogoutAdmin } = useContext(MyContext);
  const navigate = useNavigate();

  const permissions = JSON.parse(localStorage.getItem("admin_permissions") || "{}");

  // ✅ If admin does NOT have 'dashboard' page permission, show only welcome hero — no cards, no stats
  const hasDashboardAccess = permissions["dashboard"] === true;

  // Card-level permissions (only relevant if dashboard access is granted)
  const canViewOrders = permissions["card_dashboard_orders"] === true;
  const canViewQR     = permissions["card_dashboard_qr"]     === true;
  const canViewQueries= permissions["card_dashboard_queries"] === true;
  const canViewTips   = permissions["card_dashboard_tips"]   === true;
  const canViewStats  = permissions["card_dashboard_stats"]  === true;

  const handleLogout = async () => {
    const result = await LogoutAdmin();

    if (result) {
      navigate("/login-page", { replace: true });
    }
  };

  return (
    <main className="w-full h-screen md:p-5 p-2 overflow-y-auto">
      {/* Header — show full only if dashboard access, else minimal */}
      {hasDashboardAccess ? (
        <header className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-1/2 relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-yellow-600 transition"
            >
              Logout
            </button>
            <button className="relative text-xl">🔔</button>
            <span className="text-gray-700">👤 Admin User</span>
          </div>
        </header>
      ) : (
        /* Minimal header when no dashboard access */
        <header className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-yellow-600 transition"
          >
            Logout
          </button>
        </header>
      )}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.35); }
          70%  { box-shadow: 0 0 0 14px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        .welcome-fade-down  { animation: fadeInDown 0.7s ease both; }
        .welcome-fade-up    { animation: fadeInUp  0.8s ease both; }
        .welcome-fade       { animation: fadeIn    1s   ease both; }
        .welcome-scale      { animation: scaleIn   0.6s ease both; }
        .card-delay-1 { animation-delay: 0.15s; }
        .card-delay-2 { animation-delay: 0.28s; }
        .card-delay-3 { animation-delay: 0.41s; }
        .card-delay-4 { animation-delay: 0.54s; }
        .pulse-btn { animation: pulse-ring 2s ease-out infinite; }
        .welcome-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.10);
        }
        .welcome-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
      `}</style>

      {/* ── Welcome Hero ── */}
      <div className="flex flex-col items-center justify-center text-center py-12 px-4">

        {/* Badge */}
        <span className="welcome-fade-down inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block"></span>
          Digvahan Control Centre — Active
        </span>

        {/* Heading */}
        <h1 className="welcome-fade-down text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" style={{ animationDelay: '0.1s' }}>
          Welcome to the <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
            Admin Panel 👋
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`welcome-fade-up text-gray-500 text-base md:text-lg max-w-xl leading-relaxed ${hasDashboardAccess ? "mb-10" : "mb-2"}`}
          style={{ animationDelay: '0.25s' }}
        >
          Your central command hub for managing orders, QR codes, customer
          queries, and everything that keeps Digvahan running smoothly — all in
          one place.
        </p>

        {/* CTA — only show if admin has dashboard access */}
        {hasDashboardAccess && (
          <a
            href="/orders-panel"
            className="welcome-scale pulse-btn bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
            style={{ animationDelay: '0.35s' }}
          >
            Get Started →
          </a>
        )}
      </div>

      {/* ── Feature Cards + Stats — only when dashboard access is granted ── */}
      {hasDashboardAccess && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-2 pb-10">

            {/* Orders */}
            {canViewOrders && (
              <div className="welcome-card welcome-scale card-delay-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">📦</div>
                <h3 className="text-base font-bold text-gray-800">Order Management</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Track, assign, and fulfil all pending and active orders from a
                  single streamlined dashboard.
                </p>
                <a href="/orders-panel" className="text-blue-600 text-sm font-medium mt-auto hover:underline">
                  Open Orders →
                </a>
              </div>
            )}

            {/* QR */}
            {canViewQR && (
              <div className="welcome-card welcome-scale card-delay-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 text-2xl">📲</div>
                <h3 className="text-base font-bold text-gray-800">QR Management</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Generate, assign and monitor Smart QR codes linked to every vehicle
                  on the platform.
                </p>
                <a href="/qr-panel" className="text-yellow-600 text-sm font-medium mt-auto hover:underline">
                  Open QR Panel →
                </a>
              </div>
            )}

            {/* Customer Queries */}
            {canViewQueries && (
              <div className="welcome-card welcome-scale card-delay-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-2xl">💬</div>
                <h3 className="text-base font-bold text-gray-800">Customer Queries</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Review, respond to, and resolve customer support queries and
                  frequently asked questions.
                </p>
                <a href="/customer-queries" className="text-green-600 text-sm font-medium mt-auto hover:underline">
                  View Queries →
                </a>
              </div>
            )}

            {/* Quick Tips */}
            {canViewTips && (
              <div className="welcome-card welcome-scale card-delay-4 bg-linear-to-br from-indigo-600 to-blue-500 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white text-2xl">✨</div>
                <h3 className="text-base font-bold text-white">Quick Tips</h3>
                <ul className="text-sm text-white/85 leading-relaxed space-y-1 list-disc list-inside">
                  <li>Use the sidebar to navigate sections</li>
                  <li>Check orders daily for timely dispatch</li>
                  <li>Respond to queries within 24 hours</li>
                </ul>
              </div>
            )}

          </div>

          {/* Stats Summary Bar */}
          {canViewStats && (
            <div className="welcome-fade mx-2 mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100" style={{ animationDelay: '0.6s' }}>
              {[
                { label: "Active Sections",  value: "4",   color: "text-blue-600" },
                { label: "Orders Pending",   value: "24",  color: "text-orange-500" },
                { label: "Unassigned QRs",   value: "18",  color: "text-yellow-500" },
                { label: "Open Queries",     value: "32",  color: "text-green-600" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center justify-center py-5 px-4 gap-1">
                  <span className={`text-3xl font-extrabold ${s.color}`}>{s.value}</span>
                  <span className="text-xs text-gray-500 font-medium text-center">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── ORIGINAL DASHBOARD OVERVIEW (commented out) ──
      <h2 className="text-2xl md:text-3xl font-bold mb-1">Dashboard Overview</h2>
      <p className="text-gray-500 mb-4">Welcome back! Here's what's happening today.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard icon={Clock}         title="Total Order Pending"  value="24" change="↓5%"  subtitle="Orders awaiting action" bgColor="bg-blue-100"   iconColor="text-blue-600" />
        <StatCard icon={QrCode}        title="Total Unassigned QR"  value="18" change="↑12%" subtitle="QR codes pending"       bgColor="bg-yellow-100" iconColor="text-yellow-600" />
        <StatCard icon={AlertCircle}   title="Unresolved Query"     value="32" change="↑8%"  subtitle="Customer queries"       bgColor="bg-orange-100" iconColor="text-orange-600" />
        <StatCard icon={ThumbsDown}    title="Negative Review"      value="7"  change="↓3%"  subtitle="Requires attention"     bgColor="bg-red-100"    iconColor="text-red-600" />
        <StatCard icon={AlertTriangle} title="Priority Issue"       value="5"  change="↑2%"  subtitle="Critical alerts"        bgColor="bg-orange-100" iconColor="text-orange-600" />
      </div>
      Charts Row 1 ... Charts Row 2 ... (all original chart JSX preserved below in comments)
      ── */}
    </main>
  );
};

export default Dashboard;
