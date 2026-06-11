import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart2,
  Search,
  X,
  Phone,
  Mail,
  Car,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  Activity,
  Calendar,
  ArrowUpRight,
  ShieldOff,
  ShieldCheck,
  AlertTriangle,
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

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";

/* ─────────────────────── Block Confirm Modal ─────────────────────── */
const BlockConfirmModal = ({ user, onConfirm, onCancel, blocking }) => {
  const [reason, setReason] = useState("");
  const name = getDisplayName(user);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <ShieldOff className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Block User</h3>
            <p className="text-sm text-gray-500">This action is serious and immediate</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              <span className="font-semibold">{name}</span> will be{" "}
              <span className="font-bold">permanently blocked</span> — they cannot login via OTP or
              password using their phone number or email. All API access will be denied.
            </p>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Reason for blocking{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Suspicious activity, API abuse..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={blocking}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {blocking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldOff className="w-4 h-4" />
            )}
            {blocking ? "Blocking..." : "Block User"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── Detail Modal ─────────────────────── */
const AnalyticsDetailModal = ({ row, startDate, endDate, onClose, onBlockChange }) => {
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState(null);

  const fetchDetail = () => {
    if (!row) return;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    
    httpClient
      .get(`/api/user/analytics/rto-user/${row._id}?${params}`)
      .then((res) => setDetail(res.data))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load details"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDetail(); }, [row, startDate, endDate]);

  if (!row) return null;

  const name    = getDisplayName(row.user);
  const color   = getAvatarColor(name);
  const bd      = row.user?.basic_details || {};
  const pd      = row.user?.public_details || {};
  const pic     = pd?.public_pic || bd?.profile_pic;
  const isBlocked = detail?.user?.account_status === "BLOCKED";

  const handleBlock = async (reason) => {
    setBlockLoading(true);
    setBlockError(null);
    try {
      await httpClient.post("/api/user/admin/block-user", {
        userId: row.user?._id || row._id,
        reason,
      });
      setShowBlockConfirm(false);
      await fetchDetail();
      onBlockChange && onBlockChange(row._id, "BLOCKED");
    } catch (e) {
      setBlockError(e?.response?.data?.message || "Block failed");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblock = async () => {
    setBlockLoading(true);
    setBlockError(null);
    try {
      await httpClient.post("/api/user/admin/unblock-user", {
        userId: row.user?._id || row._id,
      });
      await fetchDetail();
      onBlockChange && onBlockChange(row._id, "ACTIVE");
    } catch (e) {
      setBlockError(e?.response?.data?.message || "Unblock failed");
    } finally {
      setBlockLoading(false);
    }
  };

  const groupByVehicle = (hits = []) => {
    const map = {};
    hits.forEach((h) => {
      const key = h.vehicleNumber || h.rcNumber || "Unknown";
      if (!map[key]) map[key] = [];
      map[key].push(h);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  };

  const toggleExpand = (vehicle) =>
    setExpanded((prev) => ({ ...prev, [vehicle]: !prev[vehicle] }));

  const vehicleGroups = detail ? groupByVehicle(detail.hits) : [];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Gradient Header ── */}
          <div
            className={`relative bg-gradient-to-br ${
              isBlocked ? "from-red-500 to-rose-700" : color
            } p-6 text-white`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden">
                {pic ? (
                  <img src={pic} alt={name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  getInitials(name)
                )}
                {isBlocked && (
                  <div className="absolute inset-0 bg-red-900/60 rounded-full flex items-center justify-center">
                    <ShieldOff className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold truncate">{name}</h2>
                  {isBlocked && (
                    <span className="text-xs font-bold bg-red-900/60 text-white px-2 py-0.5 rounded-full border border-white/30">
                      BLOCKED
                    </span>
                  )}
                </div>
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
                <p className="text-xl font-bold">
                  {row.vehicleNumbers?.filter(Boolean).length || 0}
                </p>
                <p className="text-xs text-white/70">Vehicles Searched</p>
              </div>
              <div className="bg-white/15 rounded-xl p-2.5 text-center">
                <p className="text-sm font-bold leading-tight">{fmtDate(row.lastHitAt)}</p>
                <p className="text-xs text-white/70">Last Hit</p>
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="overflow-y-auto flex-1 p-5">
            {/* Block/Unblock Action Bar */}
            {!loading && (
              <div
                className={`mb-4 rounded-xl border p-3 flex items-center gap-3 ${
                  isBlocked ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex-1 min-w-0">
                  {isBlocked ? (
                    <>
                      <p className="text-sm font-semibold text-red-700 flex items-center gap-1.5">
                        <ShieldOff className="w-4 h-4" /> User is Blocked
                      </p>
                      {detail?.user?.blocked_reason && (
                        <p className="text-xs text-red-500 mt-0.5">
                          Reason: {detail.user.blocked_reason}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-green-700">Account Active</span>
                      <span className="text-gray-400">— Block to restrict all access</span>
                    </p>
                  )}
                  {blockError && (
                    <p className="text-xs text-red-500 mt-1">{blockError}</p>
                  )}
                </div>

                {isBlocked ? (
                  <button
                    onClick={handleUnblock}
                    disabled={blockLoading}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition disabled:opacity-60"
                  >
                    {blockLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => setShowBlockConfirm(true)}
                    disabled={blockLoading}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition disabled:opacity-60"
                  >
                    <ShieldOff className="w-3.5 h-3.5" />
                    Block User
                  </button>
                )}
              </div>
            )}

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
                        const lastHit = hits[0]?.createdAt;
                        return (
                          <div key={vehicle} className="border border-gray-200 rounded-2xl overflow-hidden">
                            <button
                              onClick={() => toggleExpand(vehicle)}
                              className="w-full flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-indigo-50 transition-colors text-left"
                            >
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex flex-col items-center justify-center shrink-0 shadow-sm">
                                <p className="text-lg font-black text-white leading-none">{hits.length}</p>
                                <p className="text-[9px] text-white/80 font-medium leading-none mt-0.5">
                                  {hits.length === 1 ? "hit" : "hits"}
                                </p>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-base font-bold text-gray-900 font-mono tracking-wider">
                                  {vehicle}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Last searched: {fmtDate(lastHit)} at {fmtTime(lastHit)}
                                </p>
                              </div>
                              <ChevronRight
                                className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                                  isOpen ? "rotate-90" : ""
                                }`}
                              />
                            </button>

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
                                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-indigo-600">
                                          {hits.length - idx}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
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
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-xs text-gray-700 font-medium">
                                          {fmtDate(hit.createdAt)}
                                        </span>
                                      </div>
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

      {/* Block confirmation dialog — rendered above modal */}
      {showBlockConfirm && (
        <BlockConfirmModal
          user={row.user}
          onConfirm={handleBlock}
          onCancel={() => setShowBlockConfirm(false)}
          blocking={blockLoading}
        />
      )}
    </>
  );
};

/* ─────────────────────── User Analytics Card ─────────────────────── */
const AnalyticsCard = ({ row, onClick }) => {
  const name    = getDisplayName(row.user);
  const color   = getAvatarColor(name);
  const bd      = row.user?.basic_details || {};
  const pd      = row.user?.public_details || {};
  const pic     = pd?.public_pic || bd?.profile_pic;
  const vCount  = row.vehicleNumbers?.filter(Boolean).length || 0;
  const isBlocked = row.user?.account_status === "BLOCKED";

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group ${
        isBlocked ? "border-red-200 hover:border-red-400" : "border-gray-200 hover:border-indigo-200"
      }`}
    >
      {/* Top: avatar + name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold shrink-0 overflow-hidden`}
        >
          {pic ? (
            <img src={pic} alt={name} className="w-full h-full object-cover rounded-full" />
          ) : (
            getInitials(name)
          )}
          {isBlocked && (
            <div className="absolute inset-0 bg-red-800/70 rounded-full flex items-center justify-center">
              <ShieldOff className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p
              className={`font-semibold truncate group-hover:text-indigo-700 transition-colors text-sm ${
                isBlocked ? "text-red-700" : "text-gray-900"
              }`}
            >
              {name}
            </p>
            {isBlocked && (
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                BLOCKED
              </span>
            )}
          </div>
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
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-indigo-50 rounded-xl p-2 text-center">
          <p className="text-lg font-bold text-indigo-700">{row.hitCount}</p>
          <p className="text-[10px] text-indigo-500 font-medium">Total Hits</p>
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
  const [rows, setRows]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDS]    = useState("");
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selected, setSelected]     = useState(null);

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
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      const res = await httpClient.get(`/api/user/analytics/rto-users?${params}`);
      setRows(res.data.users || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, startDate, endDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Optimistic update — card badge changes instantly after block/unblock
  const handleBlockChange = (rowId, newStatus) => {
    setRows((prev) =>
      prev.map((r) =>
        r._id === rowId ? { ...r, user: { ...r.user, account_status: newStatus } } : r
      )
    );
    setSelected((prev) =>
      prev && prev._id === rowId
        ? { ...prev, user: { ...prev.user, account_status: newStatus } }
        : prev
    );
  };

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

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm w-full sm:w-auto overflow-x-auto">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => { 
                setStartDate(e.target.value); 
                if (!endDate && e.target.value) {
                  setEndDate(new Date().toISOString().split("T")[0]);
                }
                setPage(1); 
              }}
              className="bg-transparent text-sm text-gray-600 focus:outline-none min-w-[110px]"
            />
            <span className="text-gray-300">-</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-gray-600 focus:outline-none min-w-[110px]"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(""); setEndDate(""); setPage(1); }}
                className="ml-1 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                title="Clear dates"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

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
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading analytics…</p>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-base font-semibold text-gray-700">Something went wrong</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Activity className="w-12 h-12 text-gray-300" />
          <p className="text-base font-semibold text-gray-500">No RTO API hits found</p>
          {debouncedSearch && (
            <p className="text-sm text-gray-400">No results for "{debouncedSearch}"</p>
          )}
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
                Page <span className="font-semibold">{page}</span> of{" "}
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
                  if (pagination.totalPages <= 5)             p = i + 1;
                  else if (page <= 3)                         p = i + 1;
                  else if (page >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                  else                                        p = page - 2 + i;
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
      {selected && (
        <AnalyticsDetailModal
          row={selected}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setSelected(null)}
          onBlockChange={handleBlockChange}
        />
      )}
    </main>
  );
};

export default Analytics;
