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

  const handleLogout = async () => {
    const result = await LogoutAdmin();

    if (result) {
      navigate("/login-page", { replace: true });
    }
  };

  return (
    <main className="w-full h-screen md:p-5 p-2 overflow-y-auto">
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
      <h2 className="text-2xl md:text-3xl font-bold mb-1">
        Dashboard Overview
      </h2>
      <p className="text-gray-500 mb-4">
        Welcome back! Here's what's happening today.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={Clock}
          title="Total Order Pending"
          value="24"
          change="↓5%"
          subtitle="Orders awaiting action"
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={QrCode}
          title="Total Unassigned QR"
          value="18"
          change="↑12%"
          subtitle="QR codes pending"
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon={AlertCircle}
          title="Unresolved Query"
          value="32"
          change="↑8%"
          subtitle="Customer queries"
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          icon={ThumbsDown}
          title="Negative Review"
          value="7"
          change="↓3%"
          subtitle="Requires attention"
          bgColor="bg-red-100"
          iconColor="text-red-600"
        />
        <StatCard
          icon={AlertTriangle}
          title="Priority Issue"
          value="5"
          change="↑2%"
          subtitle="Critical alerts"
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-1">Happy Customers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={happyCustomersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-1">Temp Customer</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={tempCustomerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="customers"
                stroke="#f59e0b"
                fill="#fbbf24"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-1">Total Sale (Weekly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-1">Delete Request</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deleteRequestData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {deleteRequestData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
