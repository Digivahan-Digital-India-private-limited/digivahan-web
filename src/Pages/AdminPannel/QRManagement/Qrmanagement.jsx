import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Funnel, Loader2, Unlock, Trash2 } from "lucide-react";
import { MdBlockFlipped } from "react-icons/md";
import { MyContext } from "../../../ContextApi/DataProvider";

const Qrmanagement = () => {
  const navigate = useNavigate();
  const { getQrStats } = useContext(MyContext);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getQrStats();
        if (data) {
          setStats(data);
        } else {
          setError("Failed to load QR stats");
        }
      } catch (err) {
        setError("Failed to load QR stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const assignedPct =
    stats?.total > 0 ? Math.round((stats.assigned / stats.total) * 100) : 0;

  const blockedPct =
    stats?.total > 0 ? Math.round((stats.blocked / stats.total) * 100) : 0;

  const StatCard = ({
    bg,
    onClick,
    label,
    value,
    pct,
    pctColor,
    icon,
    subtitle,
    cursor = "cursor-pointer",
  }) => (
    <div
      onClick={onClick}
      className={`relative ${bg} flex-1 min-w-[220px] rounded-xl border border-gray-200 mt-5 p-6 ${cursor} transition-all hover:shadow-lg hover:-translate-y-1 duration-200`}
    >
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <div className="flex flex-row gap-3 mt-3 items-end">
        {loading ? (
          <Loader2 className="animate-spin text-gray-400 w-9 h-9" />
        ) : (
          <>
            <p className="text-5xl font-bold text-gray-800">{value ?? "—"}</p>
            {pct !== undefined && (
              <p className={`${pctColor} text-base mb-1 font-medium`}>~{pct}%</p>
            )}
          </>
        )}
      </div>
      {subtitle && !loading && (
        <p className="text-sm font-semibold text-green-700 mt-2">{subtitle}</p>
      )}
      <div className="absolute top-5 right-5 bg-white h-14 w-14 rounded-full flex items-center justify-center shadow-md">
        {icon}
      </div>
    </div>
  );

  return (
    <main className="w-full h-screen overflow-y-auto bg-white md:p-6 p-3">
      <style>{`
        @keyframes softLift {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .qr-card-anim { animation: softLift 0.4s ease-out forwards; }
      `}</style>

      <h1 className="text-2xl font-bold text-gray-900">QR Management</h1>
      <p className="text-sm text-gray-500 mt-0.5">Manage and monitor QR code allocation</p>

      {error && (
        <div className="mt-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          ⚠️ {error} — showing last known data
        </div>
      )}

      {/* ── Row 1: Assigned + Blocked ── */}
      <div className="flex flex-wrap gap-5">
        <StatCard
          bg="bg-blue-100"
          onClick={() => navigate("/check-assigned-qr")}
          label="Assigned QR Codes"
          value={stats?.assigned}
          pct={assignedPct}
          pctColor="text-green-500"
          icon={<QrCode className="text-gray-700 w-6 h-6" />}
        />
        <StatCard
          bg="bg-pink-100"
          onClick={() => navigate("/check-blocked-qr")}
          label="Blocked QR Codes"
          value={stats?.blocked}
          pct={blockedPct}
          pctColor="text-red-400"
          icon={<MdBlockFlipped className="text-gray-700 text-2xl" />}
        />
      </div>

      {/* ── Row 2: Unassigned + Generate + Filter ── */}
      <div className="flex flex-wrap gap-5">
        {/* Unassigned */}
        <StatCard
          bg="bg-yellow-100"
          onClick={() => navigate("/unassigned-qr")}
          label="Total Unassigned QR Codes"
          value={stats?.unassigned}
          icon={<QrCode className="text-gray-700 w-6 h-6" />}
        />

        {/* Generate QR */}
        <div
          onClick={() => navigate("/generate-qr")}
          className="qr-card-anim relative bg-green-100 flex-1 min-w-[220px] rounded-xl border border-gray-200 mt-5 p-6 cursor-pointer hover:bg-green-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <p className="text-gray-600 text-sm font-medium">Generate QR</p>
          <p className="text-2xl font-bold text-green-700 mt-3">Create New QR Codes</p>
          <div className="absolute top-5 right-5 bg-white h-14 w-14 rounded-full flex items-center justify-center shadow-md">
            <QrCode className="text-green-600 w-6 h-6" />
          </div>
        </div>

        {/* Filter QR */}
        <div
          onClick={() => navigate("/filter-qr")}
          className="qr-card-anim relative bg-gradient-to-br from-indigo-100 to-violet-100 flex-1 min-w-[220px] rounded-xl border border-indigo-200 mt-5 p-6 cursor-pointer hover:from-indigo-200 hover:to-violet-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <p className="text-gray-600 text-sm font-medium">Filter QR</p>
          <p className="text-2xl font-bold text-indigo-700 mt-3">View QR List by Status</p>
          <div className="absolute top-5 right-5 bg-white h-14 w-14 rounded-full flex items-center justify-center shadow-md">
            <Funnel className="text-indigo-600 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Row 3: Custom Actions ── */}
      <div className="flex flex-wrap gap-5">
        {/* Generate QR by ID */}
        <div
          onClick={() => navigate("/generate-qr-id")}
          className="qr-card-anim relative bg-orange-100 flex-1 min-w-[220px] rounded-xl border border-orange-200 mt-5 p-6 cursor-pointer hover:bg-orange-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <p className="text-gray-600 text-sm font-medium">Generate Custom QR</p>
          <p className="text-2xl font-bold text-orange-700 mt-3 whitespace-normal break-words">Generate QR by Custom ID</p>
          <div className="absolute top-5 right-5 bg-white h-14 w-14 rounded-full flex items-center justify-center shadow-md">
            <QrCode className="text-orange-600 w-6 h-6" />
          </div>
        </div>

        {/* Unassign QR */}
        <div
          onClick={() => navigate("/unassign-qr-admin")}
          className="qr-card-anim relative bg-red-100 flex-1 min-w-[220px] rounded-xl border border-red-200 mt-5 p-6 cursor-pointer hover:bg-red-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <p className="text-gray-600 text-sm font-medium">Unassign QR</p>
          <p className="text-2xl font-bold text-red-700 mt-3 whitespace-normal break-words">Assign QR Manage</p>
          <div className="absolute top-5 right-5 bg-white h-14 w-14 rounded-full flex items-center justify-center shadow-md">
            <Unlock className="text-red-600 w-6 h-6" />
          </div>
        </div>

        {/* Delete QR */}
        <div
          onClick={() => navigate("/delete-qr-admin")}
          className="qr-card-anim relative bg-red-100 flex-1 min-w-[220px] rounded-xl border border-red-200 mt-5 p-6 cursor-pointer hover:bg-red-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <p className="text-gray-600 text-sm font-medium">Delete QR</p>
          <p className="text-2xl font-bold text-red-700 mt-3 whitespace-normal break-words">Delete QR by ID</p>
          <div className="absolute top-5 right-5 bg-white h-14 w-14 rounded-full flex items-center justify-center shadow-md">
            <Trash2 className="text-red-600 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Total Summary */}
      {!loading && stats && (
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200 font-medium">
            Total QR Codes: <strong className="text-gray-800">{stats.total}</strong>
          </span>
        </div>
      )}

    </main>
  );
};

export default Qrmanagement;
