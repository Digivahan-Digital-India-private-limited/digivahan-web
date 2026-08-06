import React, { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import {
  ArrowLeft, Trash2, Search, Car, User, Phone, AlertTriangle,
  ChevronLeft, ChevronRight, Loader2, X, Shield, RefreshCw,
  Warehouse, Activity, Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const getAuthHeaders = () => {
  const token = Cookies.get("admin_token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};

// ── Delete Confirm Modal (English) ────────────────────────────────────────────
function DeleteModal({ vehicle, onConfirm, onCancel, loading }) {
  const isChallan = vehicle?.source === "challan";
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {isChallan ? "Delete Challan Record" : "Remove Vehicle"}
            </h2>
          </div>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
          {isChallan ? (
            <p className="text-sm text-red-700 font-medium mb-3">
              Are you sure you want to delete all challan search records for{" "}
              <strong className="font-mono">{vehicle?.vehicle_id}</strong>?
            </p>
          ) : (
            <p className="text-sm text-red-700 font-medium mb-3">
              Are you sure you want to remove{" "}
              <strong className="font-mono">{vehicle?.vehicle_id}</strong> from the garage?
            </p>
          )}
          <div className="flex flex-col gap-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span><strong>Owner:</strong> {vehicle?.userName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span><strong>Phone:</strong> {vehicle?.userPhone}</span>
            </div>
          </div>
          <p className="text-xs text-red-500 mt-3 font-medium">
            {isChallan
              ? "⚠️ This will permanently delete all RTO/Challan search logs for this vehicle number. This action cannot be undone."
              : "⚠️ This action is permanent and cannot be undone. All QR codes linked to this vehicle will also be unassigned."
            }
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition text-sm flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
              : <><Trash2 className="w-4 h-4" /> {isChallan ? "Delete Record" : "Remove Vehicle"}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    ACTIVE:           "bg-emerald-100 text-emerald-700",
    BLOCKED:          "bg-red-100 text-red-700",
    SUSPENDED:        "bg-orange-100 text-orange-700",
    DELETED:          "bg-gray-100 text-gray-500",
    PENDING_DELETION: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-500"}`}>
      {status || "N/A"}
    </span>
  );
}

// ── Source Badge ──────────────────────────────────────────────────────────────
function SourceBadge({ source }) {
  if (source === "garage")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"><Warehouse className="w-3 h-3" />Garage</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700"><Activity className="w-3 h-3" />Challan Check</span>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function GarageManagement() {
  const navigate = useNavigate();
  const [vehicles, setVehicles]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]           = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestLoad, setSuggestLoad] = useState(false);
  const [tab, setTab]                 = useState("all");   // all | garage | challan
  const [page, setPage]               = useState(1);
  const [pagination, setPagination]   = useState({ total: 0, totalPages: 1, garageCount: 0, challanCount: 0, allCount: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast]             = useState(null);
  const limit = 20;
  const searchRef = useRef(null);
  const suggestTimer = useRef(null);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch vehicles ────────────────────────────────────────────────────────
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit, tab });
      if (search.trim()) params.append("search", search.trim());
      const res  = await fetch(`${BASE_URL}/api/v1/garage/admin/all-garages?${params}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.status) {
        setVehicles(data.data || []);
        setPagination(data.pagination || { total: 0, totalPages: 1, garageCount: 0, challanCount: 0 });
      } else {
        showToast(data.message || "Failed to fetch vehicles", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, tab]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  // ── Live autocomplete ─────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(suggestTimer.current);
    if (val.trim().length < 2) { setSuggestions([]); setShowSuggest(false); return; }
    suggestTimer.current = setTimeout(async () => {
      setSuggestLoad(true);
      try {
        const res  = await fetch(`${BASE_URL}/api/v1/garage/admin/autocomplete?q=${encodeURIComponent(val.trim())}`, { headers: getAuthHeaders() });
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSuggest(true);
      } catch { setSuggestions([]); }
      finally   { setSuggestLoad(false); }
    }, 280);
  };

  const applySuggestion = (s) => {
    setSearchInput(s);
    setSearch(s);
    setPage(1);
    setShowSuggest(false);
    setSuggestions([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
    setShowSuggest(false);
  };

  const clearSearch = () => {
    setSearchInput(""); setSearch(""); setPage(1);
    setSuggestions([]); setShowSuggest(false);
  };

  // ── Tab change ────────────────────────────────────────────────────────────
  const changeTab = (t) => { setTab(t); setPage(1); };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      let res;
      if (deleteTarget.source === "challan") {
        // Delete RTOApiLog records for this vehicle
        res = await fetch(`${BASE_URL}/api/v1/garage/admin/delete-challan-record`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            vehicle_number: deleteTarget.vehicle_id,
            user_id: deleteTarget.userId || undefined,
          }),
        });
      } else {
        // Delete from user's garage
        res = await fetch(`${BASE_URL}/api/v1/garage/admin/delete-vehicle`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          body: JSON.stringify({ user_id: deleteTarget.userId, vehicle_number: deleteTarget.vehicle_id }),
        });
      }
      const data = await res.json();
      if (data.status) {
        showToast(
          deleteTarget.source === "challan"
            ? `✅ Challan record for ${deleteTarget.vehicle_id} deleted`
            : `✅ ${deleteTarget.vehicle_id} removed from garage`,
          "success"
        );
        setDeleteTarget(null);
        fetchVehicles();
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Close suggestions when clicking outside ───────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggest(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const tabs = [
    { key: "all",     label: "All Vehicles",    count: pagination.allCount },
    { key: "garage",  label: "Garage",          count: pagination.garageCount },
    { key: "challan", label: "Challan Checked", count: pagination.challanCount },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-xl shadow-xl text-sm font-medium text-white transition-all duration-300 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal vehicle={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition">
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Garage Management</h1>
                <p className="text-xs text-gray-500">View & manage all user vehicles</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Admin Only</span>
              </div>
              <button onClick={fetchVehicles} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition" title="Refresh">
                <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Car className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{pagination.allCount}</p><p className="text-xs text-gray-500">Total Vehicles</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Warehouse className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{pagination.garageCount}</p><p className="text-xs text-gray-500">In Garage</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center"><Activity className="w-5 h-5 text-violet-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{pagination.challanCount}</p><p className="text-xs text-gray-500">Challan Checked</p></div>
          </div>
        </div>

        {/* Search Bar with Autocomplete */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowSuggest(true)}
                placeholder="Type vehicle number (e.g. UP54Y) to see suggestions..."
                className="w-full pl-9 pr-24 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-slate-50 font-mono"
                autoComplete="off"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {suggestLoad && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                {searchInput && (
                  <button type="button" onClick={clearSearch} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 transition">
                    <X className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                )}
                <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                  Search
                </button>
              </div>

              {/* Dropdown suggestions */}
              {showSuggest && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 border-b border-slate-100 bg-slate-50">
                    Vehicle number suggestions
                  </div>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => applySuggestion(s)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition text-left"
                    >
                      <Car className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-sm font-mono font-semibold text-gray-800">{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
          {search && (
            <p className="text-xs text-blue-600 mt-2 font-medium">
              🔍 Results for: <strong>"{search}"</strong> —{" "}
              <button onClick={clearSearch} className="underline hover:text-blue-800">Clear</button>
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => changeTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200">
            <div className="col-span-1  text-xs font-semibold text-slate-500 uppercase tracking-wide">#</div>
            <div className="col-span-3  text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle No. / RC</div>
            <div className="col-span-2  text-xs font-semibold text-slate-500 uppercase tracking-wide">Source</div>
            <div className="col-span-3  text-xs font-semibold text-slate-500 uppercase tracking-wide">Owner</div>
            <div className="col-span-2  text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</div>
            <div className="col-span-1  text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Del</div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500">Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Car className="w-8 h-8 text-slate-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-700">No Vehicles Found</p>
                <p className="text-sm text-slate-500 mt-1">{search ? `No results for "${search}"` : "No vehicles in the system yet"}</p>
              </div>
              {search && <button onClick={clearSearch} className="text-sm text-blue-600 font-medium hover:underline">Clear search</button>}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {vehicles.map((v, idx) => (
                <div
                  key={`${v.userId}-${v.vehicle_id}-${idx}`}
                  className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-slate-50/70 transition group"
                >
                  {/* Index */}
                  <div className="col-span-1">
                    <span className="text-sm text-slate-400">{(page - 1) * limit + idx + 1}</span>
                  </div>

                  {/* Vehicle Number */}
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Car className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 font-mono tracking-wider">{v.vehicle_id}</p>
                      {v.lastChecked && (
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{new Date(v.lastChecked).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Source */}
                  <div className="col-span-2">
                    <SourceBadge source={v.source} />
                  </div>

                  {/* Owner */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-800 truncate">{v.userName}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <p className="text-xs text-slate-500 font-mono">{v.userPhone}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge status={v.accountStatus} />
                  </div>

                  {/* Delete — show for ALL rows */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => setDeleteTarget(v)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition opacity-0 group-hover:opacity-100 duration-200 ${
                        v.source === "challan"
                          ? "bg-violet-50 hover:bg-violet-100 text-violet-400 hover:text-violet-700"
                          : "bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-700"
                      }`}
                      title={v.source === "challan" ? "Delete challan record" : "Remove from garage"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let p;
                if (pagination.totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${p === page ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
