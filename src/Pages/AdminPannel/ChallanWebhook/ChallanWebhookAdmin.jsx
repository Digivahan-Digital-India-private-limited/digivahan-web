import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAllWebhooks, deleteSingleWebhook, bulkDeleteWebhooks } from "../../../utils/challanWebhookService";
import {
  Webhook,
  RefreshCcw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  IndianRupee,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertTriangle,
  ExternalLink,
  Phone,
} from "lucide-react";
import { toast } from "react-toastify";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) => {
  if (!v) return "—";
  return new Date(v).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// Invincible payment receipt base URL — receiptFile stores only the filename
const INVINCIBLE_RECEIPT_BASE_URL = "https://invoices.invinciblepay.in/";
const getReceiptFileUrl = (receiptFile) => {
  if (!receiptFile) return "#";
  // Already a full URL — use as-is
  if (receiptFile.startsWith("http://") || receiptFile.startsWith("https://")) {
    return receiptFile;
  }
  // Just a filename — prefix with Invincible's receipt base URL
  return `${INVINCIBLE_RECEIPT_BASE_URL}${receiptFile}`;
};


const getStatusMeta = (tx, isSettled, ioStatus) => {
  const s = (tx || "").toLowerCase();
  const io = (ioStatus || "").toLowerCase();
  
  if ((s === "captured" && isSettled) || s === "success" || s === "paid")
    return { label: "Paid",         cls: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  if (s === "captured" && io === "refund")
    return { label: "Failed (Refund)", cls: "bg-red-100 text-red-700 border-red-200" };
  if (s === "captured")
    return { label: "Under Process",cls: "bg-blue-100 text-blue-700 border-blue-200" };
  if (s === "initiated")
    return { label: "Initiated",    cls: "bg-amber-100 text-amber-700 border-amber-200" };
  if (s === "failed")
    return { label: "Failed",       cls: "bg-red-100 text-red-700 border-red-200" };
  if (s === "searched")
    return { label: "Searched",     cls: "bg-slate-100 text-slate-600 border-slate-200" };
  return { label: tx || "—",       cls: "bg-slate-100 text-slate-600 border-slate-200" };
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const ChallanWebhookAdmin = () => {
  const [records,      setRecords]      = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds,  setSelectedIds]  = useState([]);
  const [expandedId,   setExpandedId]   = useState(null);
  const [confirmDel,   setConfirmDel]   = useState(null); // id | "bulk" | null
  const [deleting,     setDeleting]     = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllWebhooks();
      const allData = Array.isArray(res?.data) ? res.data : [];
      // ✅ Filter out 'SEARCHED' records as requested
      const filteredData = allData.filter(
        (r) => r.transactionStatus?.toLowerCase() !== "searched"
      );
      setRecords(filteredData);
    } catch {
      toast.error("Failed to fetch records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Delete single ─────────────────────────────────────────────────────────
  const doDeleteSingle = async (id) => {
    try {
      setDeleting(true);
      await deleteSingleWebhook(id);
      toast.success("Record deleted.");
      setRecords((prev) => prev.filter((r) => r._id !== id));
      setSelectedIds((prev) => prev.filter((s) => s !== id));
      if (expandedId === id) setExpandedId(null);
    } catch {
      toast.error("Delete failed.");
    } finally {
      setDeleting(false);
      setConfirmDel(null);
    }
  };

  // ── Bulk delete ───────────────────────────────────────────────────────────
  const doDeleteBulk = async () => {
    if (!selectedIds.length) return;
    try {
      setDeleting(true);
      await bulkDeleteWebhooks(selectedIds);
      toast.success(`${selectedIds.length} record(s) deleted.`);
      setRecords((prev) => prev.filter((r) => !selectedIds.includes(r._id)));
      setSelectedIds([]);
    } catch {
      toast.error("Bulk delete failed.");
    } finally {
      setDeleting(false);
      setConfirmDel(null);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const paid = records.filter((r) => {
      const s = r.transactionStatus?.toLowerCase();
      return (s === "captured" && r.isSettled) || s === "success" || s === "paid";
    }).length;
    const underProcess = records.filter(
      (r) => r.transactionStatus?.toLowerCase() === "captured" && !r.isSettled && r.ioStatus?.toLowerCase() !== "refund"
    ).length;
    const failed = records.filter(
      (r) => {
        const s = r.transactionStatus?.toLowerCase();
        const io = r.ioStatus?.toLowerCase();
        return s === "failed" || (s === "captured" && io === "refund");
      }
    ).length;
    return { total: records.length, paid, underProcess, failed };
  }, [records]);

  // ── Status tabs ───────────────────────────────────────────────────────────
  const STATUS_TABS = [
    { key: "all",          label: "All",           count: records.length },
    { key: "paid",         label: "Paid",          count: stats.paid },
    { key: "under_process",label: "Under Process", count: stats.underProcess },
    { key: "failed",       label: "Failed",        count: stats.failed },
  ];

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = records;
    if (statusFilter !== "all") {
      list = list.filter((r) => {
        const s = r.transactionStatus?.toLowerCase();
        const io = r.ioStatus?.toLowerCase();
        if (statusFilter === "paid")          return (s === "captured" && r.isSettled) || s === "success" || s === "paid";
        if (statusFilter === "under_process") return s === "captured" && !r.isSettled && io !== "refund";
        if (statusFilter === "failed")        return s === "failed" || (s === "captured" && io === "refund");
        return true;
      });
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        [r.rcNumber, r.challanNumber, r.transactionStatus, r.requestId, r.ioStatus, r._id, r.userPhone]
          .join(" ").toLowerCase().includes(q)
      );
    }
    return list;
  }, [records, search, statusFilter]);

  // ── Select helpers ────────────────────────────────────────────────────────
  const allSelected = filtered.length > 0 && filtered.every((r) => selectedIds.includes(r._id));
  const toggleAll   = () => setSelectedIds(allSelected ? [] : filtered.map((r) => r._id));
  const toggleOne   = (id) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-5 md:p-8">
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade-up  { animation: fadeUp .38s ease-out both; }
        .fade-in  { animation: fadeIn .2s ease-out both; }
        .slide-up { animation: slideUp .3s cubic-bezier(.22,1,.36,1) both; }
        .skeleton { background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);background-size:200% 100%;animation:shimmer 1.4s linear infinite;border-radius:1rem; }
        .card-hover { transition:box-shadow .2s,transform .2s; }
        .card-hover:hover { box-shadow:0 10px 28px rgba(99,102,241,.12);transform:translateY(-2px); }
      `}</style>

      <div className="max-w-7xl mx-auto fade-up">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200">
              <Webhook className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Challan Webhook Records</h1>
              <p className="text-sm text-slate-500 mt-0.5">View and manage payment webhook events</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedIds.length > 0 && (
              <button
                onClick={() => setConfirmDel("bulk")}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition shadow-sm disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
            <button
              onClick={fetchAll}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 font-semibold text-sm transition shadow-sm disabled:opacity-60"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total",         value: stats.total,        Icon: FileText,     color: "indigo",  bg: "bg-indigo-50"  },
            { label: "Paid",          value: stats.paid,         Icon: CheckCircle2, color: "emerald", bg: "bg-emerald-50" },
            { label: "Under Process", value: stats.underProcess, Icon: Clock,        color: "blue",    bg: "bg-blue-50"    },
            { label: "Failed",        value: stats.failed,       Icon: XCircle,      color: "red",     bg: "bg-red-50"     },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${bg}`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{label}</p>
                <p className="text-2xl font-black text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab + Search + Select bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 space-y-4">
          {/* Status tabs */}
          <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${
                  statusFilter === tab.key
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  statusFilter === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search + select all */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-52">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by RC, Challan No., Mobile No., Request ID, Status…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              Select all ({filtered.length})
            </label>
            <span className="text-sm text-slate-400 font-medium">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Records grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-44" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-24 text-center">
            <Webhook className="w-14 h-14 mx-auto mb-4 text-slate-200" />
            <p className="text-lg font-bold text-slate-400">No records found</p>
            <p className="text-sm text-slate-400 mt-1">Try refreshing or change your search/filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((rec, idx) => {
              const { label, cls } = getStatusMeta(rec.transactionStatus, rec.isSettled, rec.ioStatus);
              const isExpanded     = expandedId === rec._id;
              const isSelected     = selectedIds.includes(rec._id);

              return (
                <article
                  key={rec._id}
                  className={`fade-up card-hover bg-white rounded-2xl border shadow-sm overflow-hidden ${
                    isSelected ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 p-4 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(rec._id)}
                        className="mt-1 w-4 h-4 rounded accent-indigo-600 cursor-pointer flex-shrink-0"
                      />
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Challan No.</p>
                        <p className="text-slate-800 font-extrabold text-base">{rec.challanNumber || "—"}</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">RC: {rec.rcNumber || "—"}</p>
                        {rec.userPhone && (
                          <p className="text-xs text-indigo-600 mt-1 font-semibold flex items-center gap-1">
                            <Phone className="w-3 h-3" />{rec.userPhone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${cls}`}>
                        {label}
                      </span>
                      {rec.isSettled && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Settled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body — key fields */}
                  <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3">
                    <InfoRow label="Amount"    value={rec.amountSettledAt != null ? `₹${rec.amountSettledAt}` : "—"} />
                    <InfoRow label="Conv. Fee" value={rec.convenienceFee ? `₹${rec.convenienceFee}` : "—"} />
                    <InfoRow label="IO Status" value={rec.ioStatus || "—"} />
                    <InfoRow label="Date"      value={fmt(rec.createdAt)} />

                    {/* Expanded fields */}
                    {isExpanded && (
                      <div className="col-span-2 border-t border-slate-100 pt-3 mt-1 grid grid-cols-2 gap-x-4 gap-y-3">
                        <InfoRow label="Request ID"    value={rec.requestId || "—"} wide />
                        {rec.userPhone && (
                          <div className="col-span-2 flex items-center gap-2 py-2 px-3 rounded-xl bg-indigo-50 border border-indigo-100">
                            <Phone className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">User Mobile</p>
                              <p className="text-sm font-bold text-indigo-700">{rec.userPhone}</p>
                            </div>
                          </div>
                        )}
                        <InfoRow label="PG Fee"        value={rec.paymentGatewayFee ? `₹${rec.paymentGatewayFee}` : "—"} />
                        <InfoRow label="Refund"        value={rec.refundAmount && rec.refundAmount !== "0" ? `₹${rec.refundAmount}` : "—"} />
                        <InfoRow label="Receipt No."  value={rec.receiptNumber || "—"} />
                        {rec.receiptFile && (
                          <div className="col-span-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Receipt File</p>
                            <a
                              href={getReceiptFileUrl(rec.receiptFile)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 font-semibold text-xs hover:underline flex items-center gap-1"
                            >
                              {rec.receiptFile} <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        {rec.receiptLink && (
                          <div className="col-span-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Receipt Link</p>
                            <a
                              href={rec.receiptLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 font-semibold text-xs hover:underline flex items-center gap-1"
                            >
                              View Receipt <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        {rec.comment && rec.comment !== "n" && (
                          <div className="col-span-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Comment</p>
                            <p className="text-sm text-slate-700">{rec.comment}</p>
                          </div>
                        )}
                        <InfoRow label="Updated At" value={fmt(rec.updatedAt)} wide />
                        <div className="col-span-2">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Record ID</p>
                          <p className="text-xs text-slate-500 break-all">{rec._id}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 border-t border-slate-100">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : rec._id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                    <button
                      onClick={() => setConfirmDel(rec._id)}
                      disabled={deleting}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDel && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in"
          onClick={() => !deleting && setConfirmDel(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Confirm Delete</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {confirmDel === "bulk"
                    ? `Permanently delete ${selectedIds.length} selected record(s)?`
                    : "Permanently delete this record?"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDel(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDel === "bulk" ? doDeleteBulk() : doDeleteSingle(confirmDel)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting
                  ? <><RefreshCcw className="w-4 h-4 animate-spin" /> Deleting…</>
                  : <><Trash2 className="w-4 h-4" /> Yes, Delete</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// ─── Helper component ─────────────────────────────────────────────────────────
const InfoRow = ({ label, value, wide = false }) => (
  <div className={wide ? "col-span-2" : ""}>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-slate-700 break-all">{value || "—"}</p>
  </div>
);

export default ChallanWebhookAdmin;
