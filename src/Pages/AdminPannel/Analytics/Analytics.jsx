import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart2,
  Search,
  X,
  Phone,
  Mail,
  Car,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  Activity,
  Calendar,
  Hash,
  User,
  ArrowUpRight,
} from "lucide-react";
import httpClient from "../../../features/shared/api/httpClient";

/* ─────────────────────── helpers ─────────────────────── */
const getDisplayName = (u) => {
  const bd = u?.basic_details || {};
  const pd = u?.public_details || {};
  const nick = pd?.nick_name?.trim();
  if (nick) return nick;
  const first = bd?.first_name || "";
  const last  = bd?.last_name  || "";
  return `${first} ${last}`.trim() || "Unknown User";
};

const getInitials = (name) => {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "??";
};

const avatarColors = [
  "from-violet-500 to-indigo-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-pink-500 to-rose-600",
  "from-purple-500 to-pink-600",
];
const getAvatarColor = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarColors[Math.abs(h) % avatarColors.length];
};

const fmtDate  = (d) => d ? new Date(d).toLocaleDateString("en-IN",  { day:"2-digit", month:"short", year:"numeric" }) : "—";
const fmtTime  = (d) => d ? new Date(d).toLocaleTimeString("en-IN",  { hour:"2-digit", minute:"2-digit", hour12:true }) : "—";
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", hour12:true }) : "—";

/* ─────────────────────── Detail Modal ─────────────────────── */
const AnalyticsDetailModal = ({ row, onClose }) => {
  const [detail, setDetail]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [expanded, setExpanded] = useState({}); // track which vehicle is expanded

  useEffect(() => {
    if (!row) return;
    setLoading(true);
    setError(null);
    httpClient
      .get(`/api/user/analytics/rto-user/${row._id}`)
      .then((res) => setDetail(res.data))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load details"))
      .finally(() => setLoading(false));
  }, [row]);

  if (!row) return null;

  const name  = getDisplayName(row.user);
  const color = getAvatarColor(name);
  const bd    = row.user?.basic_details || {};
  const pd    = row.user?.public_details || {};
  const pic   = pd?.public_pic || bd?.profile_pic;

  // Group hits by vehicleNumber
  const groupByVehicle = (hits = []) => {
    const map = {};
    hits.forEach((h) => {
      const key = h.vehicleNumber || h.rcNumber || "Unknown";
      if (!map[key]) map[key] = [];
      map[key].push(h);
    });
    // Sort by hit count desc
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  };

  const toggleExpand = (vehicle) =>
    setExpanded((prev) => ({ ...prev, [vehicle]: !prev[vehicle] }));

  const vehicleGroups = detail ? groupByVehicle(detail.hits) : [];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative bg-gradient-to-br ${color} p-6 text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden">
              {pic ? (
                <img src={pic} alt={name} className="w-full h-full object-cover rounded-full" />
              ) : getInitials(name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{name}</h2>
              {bd.phone_number && (
                <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5" /> {bd.phone_number}
                </p>
              )}
              {bd.email && (
                <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5 truncate">
                  <Mail className="w-3 h-3" /> {bd.email}
                </p>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/15 rounded-xl p-2.5 text-center">
              <p className="text-xl font-bold">{row.hitCount}</p>
              <p className="text-xs text-white/70">Total API Hits</p>
            </div>
            <div className="bg-white/15 rounded-xl p-2.5 text-center">
              <p className="text-xl font-bold">{row.vehicleNumbers?.filter(Boolean).length || 0}</p>
              <p className="text-xs text-white/70">Vehicles Searched</p>
            </div>
            <div className="bg-white/15 rounded-xl p-2.5 text-center">
              <p className="text-sm font-bold leading-tight">{fmtDate(row.lastHitAt)}</p>
              <p className="text-xs text-white/70">Last Hit</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-gray-400">Loading hit history…</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center justify-center py-16 gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && detail && (
            <>
              {vehicleGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-300">
                  <Activity className="w-10 h-10" />
                  <p className="text-sm">No RTO API hits recorded</p>
                </div>
              ) : (
                <>
                  {/* Section heading */}
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Car className="w-3.5 h-3.5" />
                    Vehicle-wise RTO API Hits
                    <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {vehicleGroups.length} vehicle{vehicleGroups.length > 1 ? "s" : ""}
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {vehicleGroups.map(([vehicle, hits]) => {
                      const isOpen = !!expanded[vehicle];
                      const lastHit = hits[0]?.createdAt; // already sorted desc from backend

                      return (
                        <div
                          key={vehicle}
                          className="border border-gray-200 rounded-2xl overflow-hidden"
                        >
                          {/* Vehicle row — always visible */}
                          <button
                            onClick={() => toggleExpand(vehicle)}
                            className="w-full flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-indigo-50 transition-colors text-left"
                          >
                            {/* Hit count badge — PRIMARY info */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex flex-col items-center justify-center shrink-0 shadow-sm">
                              <p className="text-lg font-black text-white leading-none">{hits.length}</p>
                              <p className="text-[9px] text-white/80 font-medium leading-none mt-0.5">
                                {hits.length === 1 ? "hit" : "hits"}
                              </p>
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Vehicle number */}
                              <p className="text-base font-bold text-gray-900 font-mono tracking-wider">
                                {vehicle}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Last searched: {fmtDate(lastHit)} at {fmtTime(lastHit)}
                              </p>
                            </div>

                            {/* Expand chevron */}
                            <ChevronRight
                              className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                                isOpen ? "rotate-90" : ""
                              }`}
                            />
                          </button>

                          {/* Expandable timeline */}
                          {isOpen && (
                            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                                All {hits.length} API call{hits.length > 1 ? "s" : ""} for this vehicle
                              </p>
                              <div className="space-y-1.5">
                                {hits.map((hit, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2"
                                  >
                                    {/* Call number */}
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                      <span className="text-xs font-bold text-indigo-600">
                                        {hits.length - idx}
                                      </span>
                                    </div>

                                    {/* API Type Badge */}
                                    <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                                      {hit.apiType === "rto_premium_api" ? (
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap">
                                          Premium API
                                        </span>
                                      ) : hit.apiType === "challan_plus_api" ? (
                                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap">
                                          Challan API
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap">
                                          Normal API
                                        </span>
                                      )}
                                      
                                      {hit.trigger === "refresh" ? (
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap">
                                          Vehicle Refresh
                                        </span>
                                      ) : hit.trigger === "challan_refresh" ? (
                                        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap">
                                          Challan Refresh
                                        </span>
                                      ) : hit.trigger === "challan_search" ? (
                                        <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap">
                                          Challan Search
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap">
                                          Add Vehicle
                                        </span>
                                      )}
                                    </div>


                                    {/* Date */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                      <span className="text-xs text-gray-700 font-medium">
                                        {fmtDate(hit.createdAt)}
                                      </span>
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                      <span className="text-xs font-semibold text-indigo-600">
                                        {fmtTime(hit.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};



/* ─────────────────────── User Analytics Card ─────────────────────── */
const AnalyticsCard = ({ row, onClick }) => {
  const name   = getDisplayName(row.user);
  const color  = getAvatarColor(name);
  const bd     = row.user?.basic_details || {};
  const pd     = row.user?.public_details || {};
  const pic    = pd?.public_pic || bd?.profile_pic;
  const vCount = row.vehicleNumbers?.filter(Boolean).length || 0;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 hover:border-indigo-200 group"
    >
      {/* Top: avatar + name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold shrink-0 overflow-hidden`}
        >
          {pic ? (
            <img src={pic} alt={name} className="w-full h-full object-cover rounded-full" />
          ) : getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors text-sm">
            {name}
          </p>
          {bd.phone_number && (
            <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
              <Phone className="w-3 h-3" /> {bd.phone_number}
            </p>
          )}
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
      </div>

      {/* Email */}
      {bd.email && (
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3 truncate">
          <Mail className="w-3 h-3 shrink-0" /> {bd.email}
        </p>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-indigo-50 rounded-xl p-2 text-center">
          <p className="text-lg font-bold text-indigo-700">{row.hitCount}</p>
          <p className="text-[10px] text-indigo-500 font-medium">Total Hits</p>
        </div>
        <div className="bg-rose-50 rounded-xl p-2 text-center">
          <p className="text-lg font-bold text-rose-700">{row.challanHits || 0}</p>
          <p className="text-[10px] text-rose-500 font-medium">Challan</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-2 text-center flex flex-col justify-center">
          <p className="text-[11px] font-bold text-emerald-700 leading-tight">{fmtDate(row.lastHitAt)}</p>
          <p className="text-[10px] text-emerald-500 font-medium mt-0.5">Last Hit</p>
        </div>
      </div>



      {/* Vehicle numbers preview */}
      {vCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {row.vehicleNumbers.filter(Boolean).slice(0, 3).map((v, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono">
              {v}
            </span>
          ))}
          {vCount > 3 && (
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md">
              +{vCount - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────── Main Page ─────────────────────── */
const Analytics = () => {
  const [rows, setRows]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [debouncedSearch, setDS]  = useState("");
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setDS(search); setPage(1); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await httpClient.get(`/api/user/analytics/rto-users?${params}`);
      setRows(res.data.users || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <main className="w-full min-h-screen bg-gray-50 md:p-6 p-4">
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ana-card { animation: fadeUp 0.35s ease-out forwards; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">RTO API Analytics</h1>
          </div>
          <p className="text-sm text-gray-500">
            Users who searched vehicle challans via Kashi Digital API ·{" "}
            <span className="font-semibold text-gray-700">{pagination.total}</span> users
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, phone, vehicle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── States ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading analytics…</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-base font-semibold text-gray-700">Something went wrong</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button onClick={fetchData} className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Activity className="w-12 h-12 text-gray-300" />
          <p className="text-base font-semibold text-gray-500">No RTO API hits found</p>
          {debouncedSearch && <p className="text-sm text-gray-400">No results for "{debouncedSearch}"</p>}
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && !error && rows.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rows.map((row, i) => (
              <div
                key={row._id}
                className="ana-card"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.5)}s`, opacity: 0 }}
              >
                <AnalyticsCard row={row} onClick={() => setSelected(row)} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-gray-500">
                Page <span className="font-semibold">{pagination.page}</span> of{" "}
                <span className="font-semibold">{pagination.totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let p;
                  if (pagination.totalPages <= 5)        p = i + 1;
                  else if (page <= 3)                    p = i + 1;
                  else if (page >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                  else                                   p = page - 2 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-sm rounded-lg border transition font-medium ${
                        p === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selected && <AnalyticsDetailModal row={selected} onClose={() => setSelected(null)} />}
    </main>
  );
};

export default Analytics;
