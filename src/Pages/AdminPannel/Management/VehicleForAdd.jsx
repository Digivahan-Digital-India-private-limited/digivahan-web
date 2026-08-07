import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import {
  ArrowLeft, Search, Car, FileDown, CheckCircle2,
  ChevronLeft, ChevronRight, Loader2, X, RefreshCw, Trash2, Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const getAuthHeaders = () => {
  const token = Cookies.get("admin_token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};

export default function VehicleForAdd() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("pending"); // pending | downloaded | all
  const [apiType, setApiType] = useState("VEHICLE"); // VEHICLE | CHALLAN
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, pendingCount: 0, downloadedCount: 0, vehicleCount: 0, challanCount: 0 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const limit = 50; // Larger limit for easier bulk downloading

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit, filter, apiType });
      if (search.trim()) params.append("search", search.trim());
      const res = await fetch(`${BASE_URL}/api/v1/vehicle-for-add/admin/list?${params}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.status) {
        setVehicles(data.data || []);
        setPagination(data.pagination || { total: 0, totalPages: 1, pendingCount: 0, downloadedCount: 0, vehicleCount: 0, challanCount: 0 });
        // Clear selection on page change or filter change
        setSelectedIds([]);
      } else {
        showToast(data.message || "Failed to fetch vehicles", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, filter, apiType]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVehicles();
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
    setTimeout(fetchVehicles, 0);
  };

  const changeFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  // ── Selection Logic ────────────────────────────────────────────────────────
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(vehicles.map((v) => v.vehicleNumber));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e, vNum) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, vNum]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== vNum));
    }
  };

  const isAllSelected = vehicles.length > 0 && selectedIds.length === vehicles.length;

  // ── Download PDF Logic ──────────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    if (selectedIds.length === 0) return;
    
    // Find the selected vehicles objects
    const selectedVehicles = vehicles.filter(v => selectedIds.includes(v.vehicleNumber));
    
    // Generate PDF
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Vehicles To Add to RTO API", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Vehicles: ${selectedVehicles.length}`, 14, 36);

    const tableColumn = ["S.No", "Vehicle Number", "Failed APIs", "Fail Count", "Last Searched"];
    const tableRows = [];

    selectedVehicles.forEach((v, index) => {
      const rowData = [
        index + 1,
        v.vehicleNumber,
        (v.failedApis || []).join(", "),
        v.failCount,
        new Date(v.lastFailedAt).toLocaleString()
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    });

    // Save the PDF
    doc.save(`Vehicles_To_Add_${new Date().getTime()}.pdf`);

    // Only mark as downloaded if we are currently looking at pending vehicles
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


  const tabs = [
    { key: "pending",    label: "Pending to Add",  count: pagination.pendingCount },
    { key: "downloaded", label: "Downloaded",      count: pagination.downloadedCount },
    { key: "all",        label: "All Vehicles",    count: pagination.total },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
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
              <button onClick={fetchVehicles} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition" title="Refresh">
                <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Main API Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            onClick={() => { setApiType("VEHICLE"); setPage(1); }}
            className={`pb-3 px-4 text-sm font-semibold transition border-b-2 ${
              apiType === "VEHICLE"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Vehicle Details Failed <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${apiType === "VEHICLE" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{pagination.vehicleCount || 0}</span>
          </button>
          <button
            onClick={() => { setApiType("CHALLAN"); setPage(1); }}
            className={`pb-3 px-4 text-sm font-semibold transition border-b-2 ${
              apiType === "CHALLAN"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Challan Failed <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${apiType === "CHALLAN" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{pagination.challanCount || 0}</span>
          </button>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => changeFilter(t.key)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  filter === t.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === t.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
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
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-semibold text-blue-800">
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                Download PDF
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 items-center">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                disabled={vehicles.length === 0}
              />
            </div>
            <div className="col-span-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle Number</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fail Count</div>
            <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Checked</div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500">Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-slate-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-700">No Vehicles Found</p>
                <p className="text-sm text-slate-500 mt-1">{search ? `No results for "${search}"` : "All caught up! No vehicles pending."}</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <div
                  key={v.vehicleNumber}
                  className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center transition ${selectedIds.includes(v.vehicleNumber) ? "bg-blue-50/50" : "hover:bg-slate-50/70"}`}
                >
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(v.vehicleNumber)}
                      onChange={(e) => handleSelectOne(e, v.vehicleNumber)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="col-span-4 flex flex-col justify-center gap-1 py-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 font-mono tracking-wider">{v.vehicleNumber}</span>
                    </div>
                    {v.failedApis && v.failedApis.length > 0 && (
                      <div className="flex gap-1 pl-11">
                        {v.failedApis.includes("CHALLAN") && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold uppercase">Challan Failed</span>}
                        {v.failedApis.includes("VEHICLE") && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold uppercase">Vehicle Details Failed</span>}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    {v.isDownloaded ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        Downloaded
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md bg-slate-100 text-xs font-bold text-slate-600">
                      {v.failCount}x
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600">{new Date(v.lastFailedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
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
    </div>
  );
}
