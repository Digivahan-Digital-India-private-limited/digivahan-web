import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import {
  ArrowLeft, Search, Car, FileDown, CheckCircle2,
  ChevronLeft, ChevronRight, Loader2, X, RefreshCw, Trash2, Calendar,
  AlertTriangle, CheckCircle, CalendarRange, User, Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const getAuthHeaders = () => {
  const token = Cookies.get("admin_token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};

// ── Donut Chart Component ─────────────────────────────────────────────────────
function DonutChart({ failCount, successCount, label }) {
  const total = failCount + successCount;
  const failPct = total > 0 ? Math.round((failCount / total) * 100) : 0;
  const successPct = total > 0 ? 100 - failPct : 0;

  const size = 140;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const failDash = (failPct / 100) * circumference;
  const successDash = (successPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          {/* background ring */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth="18" />

          {/* success arc (teal) */}
          {successPct > 0 && (
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="18"
              strokeDasharray={`${successDash} ${circumference - successDash}`}
              strokeDashoffset={-failDash}
              strokeLinecap="round"
            />
          )}

          {/* fail arc (red-orange) */}
          {failPct > 0 && (
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke="#f97316"
              strokeWidth="18"
              strokeDasharray={`${failDash} ${circumference - failDash}`}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
          )}
        </svg>
        {/* center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800">{total > 0 ? `${failPct}%` : "—"}</span>
          <span className="text-[10px] text-slate-400 font-medium">Fail Rate</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-400 flex-shrink-0" />
            <span className="text-xs text-slate-600 font-medium">Fail</span>
          </div>
          <span className="text-xs font-bold text-slate-800">{failCount.toLocaleString()} ({failPct}%)</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-400 flex-shrink-0" />
            <span className="text-xs text-slate-600 font-medium">Success</span>
          </div>
          <span className="text-xs font-bold text-slate-800">{successCount.toLocaleString()} ({successPct}%)</span>
        </div>
        {label && <p className="text-[10px] text-slate-400 text-center mt-1">{label}</p>}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function VehicleForAdd() {
  const navigate = useNavigate();

  // Top-level tab: fail | success
  const [mainTab, setMainTab] = useState("fail");

  // Second-level tab: VEHICLE | CHALLAN
  const [apiType, setApiType] = useState("VEHICLE");

  // Filter tab (only for fail): pending | downloaded | all
  const [filter, setFilter] = useState("pending");

  // Date range filter
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0, totalPages: 1, allCount: 0,
    pendingCount: 0, downloadedCount: 0,
    vehicleCount: 0, challanCount: 0,
  });

  // Stats for pie chart
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDetailsForModal, setSelectedDetailsForModal] = useState(null);
  const [rtoErrorModal, setRtoErrorModal] = useState(false);

  const limit = 50;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch Stats ─────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      let url = `${BASE_URL}/api/v1/vehicle-for-add/admin/stats`;
      const params = new URLSearchParams();
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.status) setStats(data.data);
    } catch {
      // ignore stats fetch error silently
    } finally {
      setStatsLoading(false);
    }
  }, [fromDate, toDate]);

  // ── Fetch Vehicles ──────────────────────────────────────────────────────────
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      let url;
      let params;

      if (mainTab === "fail") {
        params = new URLSearchParams({ page, limit, filter, apiType });
        if (search.trim()) params.append("search", search.trim());
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate)   params.append("toDate",   toDate);
        url = `${BASE_URL}/api/v1/vehicle-for-add/admin/list?${params}`;
      } else {
        params = new URLSearchParams({ page, limit, apiType });
        if (search.trim()) params.append("search", search.trim());
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate)   params.append("toDate",   toDate);
        url = `${BASE_URL}/api/v1/vehicle-for-add/admin/success-list?${params}`;
      }

      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.status) {
        setVehicles(data.data || []);
        setPagination(data.pagination || {
          total: 0, totalPages: 1, allCount: 0,
          pendingCount: 0, downloadedCount: 0,
          vehicleCount: 0, challanCount: 0,
        });
        setSelectedIds([]);
      } else {
        showToast(data.message || "Failed to fetch vehicles", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, filter, apiType, mainTab, fromDate, toDate]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVehicles();
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const changeMainTab = (tab) => {
    setMainTab(tab);
    setApiType("VEHICLE");
    setFilter("pending");
    setPage(1);
    setSearch("");
    setFromDate("");
    setToDate("");
    setSelectedIds([]);
  };

  const clearDateRange = () => {
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const changeApiType = (type) => {
    setApiType(type);
    setPage(1);
    setSelectedIds([]);
  };

  const changeFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  // ── Selection ──────────────────────────────────────────────────────────────
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(vehicles.map((v) => v.vehicleNumber));
    else setSelectedIds([]);
  };

  const handleSelectOne = (e, vNum) => {
    if (e.target.checked) setSelectedIds((prev) => [...prev, vNum]);
    else setSelectedIds((prev) => prev.filter((id) => id !== vNum));
  };

  const isAllSelected = vehicles.length > 0 && selectedIds.length === vehicles.length;

  // ── Download PDF ────────────────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    if (selectedIds.length === 0) return;
    const selectedVehicles = vehicles.filter(v => selectedIds.includes(v.vehicleNumber));
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Vehicles To Add to RTO API", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Vehicles: ${selectedVehicles.length}`, 14, 36);

    const tableColumn = ["S.No", "Vehicle Number", "Failed APIs", "Fail Count", "Last Searched"];
    const tableRows = selectedVehicles.map((v, i) => [
      i + 1,
      v.vehicleNumber,
      (v.failedApis || []).join(", "),
      v.failCount,
      new Date(v.lastFailedAt).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    });

    doc.save(`Vehicles_To_Add_${new Date().getTime()}.pdf`);

    if (filter === "pending" || filter === "all") {
      await markAsDownloaded(selectedIds);
    } else {
      showToast("PDF downloaded successfully.");
    }
  };

  const markAsDownloaded = async (vehicleNumbers) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/vehicle-for-add/admin/mark-downloaded`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ vehicleNumbers }),
      });
      const data = await res.json();
      if (data.status) {
        showToast(`✅ ${data.data.modifiedCount} vehicles marked as downloaded`);
        fetchVehicles();
        fetchStats();
      } else {
        showToast(data.message || "Failed to update status", "error");
      }
    } catch {
      showToast("Network error while updating status.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/vehicle-for-add/admin/delete`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ vehicleNumbers: selectedIds }),
      });
      const data = await res.json();
      if (data.status) {
        showToast(`✅ ${data.data.deletedCount} vehicles removed`);
        fetchVehicles();
        fetchStats();
        setDeleteModalOpen(false);
      } else {
        showToast(data.message || "Failed to delete", "error");
      }
    } catch {
      showToast("Network error while deleting.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddToGarage = async (vehicleNumber, userId) => {
    if (!userId) {
      showToast("User not found for this vehicle", "error");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/vehicle-for-add/admin/add-to-user-garage`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ vehicleNumber, userId }),
      });
      const data = await res.json();
      if (data.status) {
        showToast(`✅ ${vehicleNumber} added to user's garage successfully`);
        fetchVehicles();
        fetchStats();
      } else {
        if (data.error_type === "RTO_DOWN") {
          setRtoErrorModal(data.message);
        } else {
          showToast(data.message || "Failed to add vehicle to garage", "error");
        }
      }
    } catch {
      showToast("Network error while adding to garage.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Derived data ─────────────────────────────────────────────────────────
  const isFail = mainTab === "fail";
  const showAction = isFail && apiType !== "CHALLAN";

  const apiSubTabs = [
    {
      key: "VEHICLE",
      label: isFail ? "Vehicle Details Failed" : "Vehicle Details Success",
      count: pagination.vehicleCount || 0,
    },
    {
      key: "CHALLAN",
      label: isFail ? "Challan Failed" : "Challan Success",
      count: pagination.challanCount || 0,
    },
  ];

  const filterTabs = [
    { key: "pending",    label: "Pending to Add",  count: pagination.pendingCount },
    { key: "downloaded", label: "Downloaded",      count: pagination.downloadedCount },
    { key: "all",        label: "All Vehicles",    count: pagination.allCount },
  ];

  // chart data per current apiType context
  const chartData = stats
    ? apiType === "VEHICLE"
      ? stats.vehicle
      : apiType === "CHALLAN"
      ? stats.challan
      : stats.overall
    : null;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)" }}>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-xl shadow-xl text-sm font-medium text-white transition-all duration-300 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition">
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vehicles to Add</h1>
                <p className="text-xs text-gray-500">Failed 3rd-party API lookups (Need Manual Entry)</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => { fetchVehicles(); fetchStats(); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ── TOP TABS: Fail / Success ─────────────────────────────────────── */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => changeMainTab("fail")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-sm ${
              mainTab === "fail"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-200 shadow-lg"
                : "bg-white text-slate-600 border border-slate-200 hover:border-orange-200 hover:text-orange-600"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Fail
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${mainTab === "fail" ? "bg-white/25 text-white" : "bg-orange-100 text-orange-700"}`}>
              {(apiType === "VEHICLE" ? stats?.vehicle?.fail : apiType === "CHALLAN" ? stats?.challan?.fail : stats?.overall?.fail) ?? "—"}
            </span>
          </button>
          <button
            onClick={() => changeMainTab("success")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-sm ${
              mainTab === "success"
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-200 shadow-lg"
                : "bg-white text-slate-600 border border-slate-200 hover:border-teal-200 hover:text-teal-600"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Success
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${mainTab === "success" ? "bg-white/25 text-white" : "bg-teal-100 text-teal-700"}`}>
              {(apiType === "VEHICLE" ? stats?.vehicle?.success : apiType === "CHALLAN" ? stats?.challan?.success : stats?.overall?.success) ?? "—"}
            </span>
          </button>
        </div>

        {/* ── CHART + SECOND-LEVEL TABS LAYOUT ─────────────────────────────── */}
        <div className="flex gap-5 mb-6 flex-col lg:flex-row">

          {/* Donut Chart Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col items-center justify-center min-w-[200px]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              {apiType === "VEHICLE" ? "Vehicle API" : apiType === "CHALLAN" ? "Challan API" : "All APIs"} Stats
            </p>
            {statsLoading ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                <p className="text-xs text-slate-400">Loading stats...</p>
              </div>
            ) : chartData ? (
              <DonutChart
                failCount={chartData.fail}
                successCount={chartData.success}
                label={`of ${chartData.total.toLocaleString()} total requests`}
              />
            ) : (
              <p className="text-xs text-slate-400">No data</p>
            )}
          </div>

          {/* Right column: secondary tabs + filter tabs */}
          <div className="flex-1 flex flex-col gap-4">

            {/* ── API TYPE TABS: Vehicle Details / Challan ─────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex">
                {apiSubTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => changeApiType(tab.key)}
                    className={`flex-1 flex flex-col items-center justify-center py-4 px-4 transition-all duration-200 border-b-2 ${
                      apiType === tab.key
                        ? isFail
                          ? "border-orange-500 bg-orange-50"
                          : "border-teal-500 bg-teal-50"
                        : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <span className={`text-sm font-bold ${apiType === tab.key ? (isFail ? "text-orange-700" : "text-teal-700") : "text-slate-600"}`}>
                      {tab.label}
                    </span>
                    <span className={`mt-1.5 text-xl font-black ${apiType === tab.key ? (isFail ? "text-orange-600" : "text-teal-600") : "text-slate-400"}`}>
                      {tab.count.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── FILTER TABS (only for fail tab) ─────────────────────── */}
            {isFail && (
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                {filterTabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => changeFilter(t.key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      filter === t.key
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filter === t.key ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SEARCH + DATE RANGE BAR ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vehicle number..."
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white font-mono shadow-sm"
            />
            {search && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-200 transition">
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}
          </form>

          {/* Date Range */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <CalendarRange className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
              className="text-sm text-slate-700 border-none outline-none bg-transparent cursor-pointer"
              title="From date"
            />
            <span className="text-slate-300 font-semibold">→</span>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => { setToDate(e.target.value); setPage(1); }}
              className="text-sm text-slate-700 border-none outline-none bg-transparent cursor-pointer"
              title="To date"
            />
            {(fromDate || toDate) && (
              <button
                onClick={clearDateRange}
                className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-500 transition flex-shrink-0"
                title="Clear date filter"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Active date badge */}
          {(fromDate || toDate) && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700">
              <Calendar className="w-3.5 h-3.5" />
              {fromDate && toDate ? `${fromDate} to ${toDate}` : fromDate ? `From ${fromDate}` : `Until ${toDate}`}
            </div>
          )}
        </div>

        {/* ── BULK ACTIONS (fail tab only) ─────────────────────────────────── */}
        {isFail && selectedIds.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm">
            <p className="text-sm font-semibold text-orange-800">
              {selectedIds.length} vehicle(s) selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeleteModalOpen(true)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                Download PDF
              </button>
            </div>
          </div>
        )}

        {/* ── TABLE ───────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid items-center px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide grid-cols-12 gap-3">
            {isFail && (
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                  disabled={vehicles.length === 0}
                />
              </div>
            )}
            <div className={isFail ? (showAction ? "col-span-3" : "col-span-5") : "col-span-6"}>Vehicle Number</div>
            {isFail && <div className="col-span-2">User Details</div>}
            <div className={isFail ? "col-span-2" : "col-span-3"}>Status</div>
            <div className={isFail ? "col-span-2" : "col-span-3"}>{isFail ? "Last Failed" : "Last Success"}</div>
            {showAction && <div className="col-span-2 text-right">Action</div>}
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500">Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                {isFail ? <AlertTriangle className="w-8 h-8 text-slate-300" /> : <CheckCircle2 className="w-8 h-8 text-slate-300" />}
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-700">No Vehicles Found</p>
                <p className="text-sm text-slate-500 mt-1">{search ? `No results for "${search}"` : "Nothing here yet."}</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {vehicles.map((v) => {
                const isSelected = selectedIds.includes(v.vehicleNumber);
                const dateStr = isFail
                  ? (v.lastFailedAt ? new Date(v.lastFailedAt).toLocaleString() : "—")
                  : (v.lastSuccessAt ? new Date(v.lastSuccessAt).toLocaleString() : "—");

                return (
                  <div
                    key={v.vehicleNumber}
                    className={`grid items-center px-5 py-3.5 transition-colors ${isFail ? "grid-cols-12 gap-3" : "grid-cols-10 gap-3"} ${isSelected ? "bg-orange-50/60" : "hover:bg-slate-50/70"}`}
                  >
                    {isFail && (
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(e, v.vehicleNumber)}
                          className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Vehicle Number */}
                    <div className={`${isFail ? (showAction ? "col-span-3" : "col-span-5") : "col-span-6"} flex flex-col gap-1`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isFail ? "bg-orange-50" : "bg-teal-50"}`}>
                          <Car className={`w-4 h-4 ${isFail ? "text-orange-400" : "text-teal-400"}`} />
                        </div>
                        <span className="text-sm font-bold text-gray-900 font-mono tracking-wider">{v.vehicleNumber}</span>
                      </div>
                      {/* API type badges */}
                      {isFail && v.failedApis && v.failedApis.length > 0 && (
                        <div className="flex gap-1 pl-10">
                          {v.failedApis.includes("CHALLAN") && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold uppercase">Challan</span>
                          )}
                          {v.failedApis.includes("VEHICLE") && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-semibold uppercase">Vehicle</span>
                          )}
                        </div>
                      )}
                      {!isFail && v.apiTypes && v.apiTypes.length > 0 && (
                        <div className="flex gap-1 pl-10">
                          {v.apiTypes.map(type => (
                            <span key={type} className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 font-semibold uppercase">
                              {type === "challan_plus_api" ? "Challan" : "Vehicle"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* User Info (Fail only) */}
                    {isFail && (
                      <div className="col-span-2 flex flex-col items-start gap-1">
                        {v.userIds && v.userIds.length > 0 ? (
                          <>
                            <span className="text-xs text-slate-700 font-medium whitespace-nowrap">
                              {v.userIds[0]?.basic_details?.phone_number || "No Phone"}
                              {v.userIds.length > 1 && <span className="text-slate-400 ml-1">(+{v.userIds.length - 1})</span>}
                            </span>
                            <button
                              onClick={() => setSelectedDetailsForModal(v)}
                              className="text-[10px] text-blue-600 hover:text-blue-800 underline underline-offset-2 font-semibold"
                            >
                              View Details
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </div>
                    )}

                    {/* Status */}
                    <div className={isFail ? "col-span-2" : "col-span-3"}>
                      {isFail ? (
                        v.isDownloaded ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                            Downloaded
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                            Pending
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700 border border-teal-200">
                          ✓ Success
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    <div className={`${isFail ? "col-span-2" : "col-span-3"} flex items-center gap-1.5`}>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-600">{dateStr}</span>
                    </div>

                    {/* Action */}
                    {showAction && (
                      <div className="col-span-2 flex justify-end">
                        {v.userIds && v.userIds.length > 0 && (
                          <button
                            onClick={() => handleAddToGarage(v.vehicleNumber, v.userIds[0]?._id)}
                            disabled={actionLoading}
                            className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition flex items-center gap-1 disabled:opacity-50 whitespace-nowrap"
                          >
                            <Car className="w-3 h-3" />
                            Add to Garage
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── PAGINATION ───────────────────────────────────────────────────── */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-3">
            <p className="text-sm text-slate-600">
              Page <strong>{page}</strong> of <strong>{pagination.totalPages}</strong>
              <span className="text-slate-400 ml-2">({pagination.total} total)</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DELETE CONFIRMATION MODAL ─────────────────────────────────────── */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Vehicles?</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete {selectedIds.length} vehicle(s) from this list? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DETAILS MODAL ─────────────────────────────────────── */}
      {selectedDetailsForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-gray-900">Failure Details</h3>
              <button
                onClick={() => setSelectedDetailsForModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-6">
              {/* API Error Logs */}
              {selectedDetailsForModal.apiErrorLogs && selectedDetailsForModal.apiErrorLogs.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> API Error Logs
                  </h4>
                  <div className="bg-slate-900 rounded-xl p-3 space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                    {selectedDetailsForModal.apiErrorLogs.map((log, idx) => (
                      <div key={idx} className="border-b border-slate-700 pb-2 last:border-0 last:pb-0">
                        <pre className="text-[10px] sm:text-xs text-red-400 font-mono whitespace-pre-wrap break-all">
                          {log}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {selectedDetailsForModal.userIds && selectedDetailsForModal.userIds.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" /> Affected Users
                  </h4>
                  <div className="space-y-3">
                    {selectedDetailsForModal.userIds.map((user, idx) => {
                      const name = user?.public_details?.nick_name || `${user?.basic_details?.first_name || ""} ${user?.basic_details?.last_name || ""}`.trim() || "Unknown User";
                      const phone = user?.basic_details?.phone_number || "N/A";
                      const uid = user?._id || "N/A";

                      return (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="font-semibold text-slate-800 text-sm">{name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                              <Phone className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-600">{phone}</span>
                          </div>
                          <div className="mt-2 text-[10px] text-slate-400 font-mono bg-white px-2 py-1 rounded border border-slate-100 self-start">
                            ID: {uid}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setSelectedDetailsForModal(null)}
                className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RTO Error Modal */}
      {rtoErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">API Error</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {rtoErrorModal}
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center">
              <button
                onClick={() => setRtoErrorModal(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
