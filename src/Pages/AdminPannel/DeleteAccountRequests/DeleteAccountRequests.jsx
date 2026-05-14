import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { httpClient } from "../../../features/shared/api/httpClient";
import { ArrowRight, CheckCircle2, Mail, Phone, RefreshCcw, Search, User2, UserX, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Checked", value: "checked" },
  { label: "Closed", value: "closed" },
];

const STATUS_CLASSES = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  checked: "bg-amber-100 text-amber-700 border-amber-200",
  closed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const mapApiRequest = (item) => ({
  id: item?._id || item?.id || "",
  userId: item?.user_id || "",
  name: item?.name || "Unknown",
  phoneNumber: item?.phoneNumber || "-",
  email: item?.email || "-",
  reason: item?.reason || "-",
  otherReason: item?.otherReason || "",
  status: String(item?.status || "new").toLowerCase(),
  createdAt: item?.createdAt || "",
  updatedAt: item?.updatedAt || "",
});

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const ALLOWED_STATUS_TRANSITIONS = {
  new: ["checked", "closed"],
  checked: ["closed"],
  closed: [],
};

const getAllowedNextStatuses = (status) => ALLOWED_STATUS_TRANSITIONS[status] || [];

const isValidTransition = (currentStatus, nextStatus) =>
  getAllowedNextStatuses(currentStatus).includes(nextStatus);

const toStatusLabel = (status) => {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getActionButtonClass = (nextStatus) => {
  if (nextStatus === "closed") {
    return "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700";
  }
  return "from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700";
};

const DeleteAccountRequests = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatingRequestId, setUpdatingRequestId] = useState("");
  const [actionOpenRequestId, setActionOpenRequestId] = useState("");
  const [deletionDays, setDeletionDays] = useState(30);

  const fetchDeleteRequests = useCallback(async () => {
    try {
      setIsLoading(true);

      const params = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await httpClient.get("/api/delete-account/list", { params });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to fetch delete account requests.");
      }

      const mapped = (response?.data?.data || []).map(mapApiRequest);
      setRequests(mapped);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to load delete account requests.");
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchDeleteRequests();
  }, [fetchDeleteRequests]);

  const handleTakeAction = async (request, nextStatus) => {
    if (!request?.id || !nextStatus || updatingRequestId === request.id) return;

    if (!isValidTransition(request.status, nextStatus)) {
      toast.error("Invalid status transition requested.");
      return;
    }

    try {
      setUpdatingRequestId(request.id);

      const response = await httpClient.put(`/api/delete-account/status/${request.id}`, {
        status: nextStatus,
        deletion_days: deletionDays
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to update delete request status.");
      }

      const updatedFromApi = response?.data?.data ? mapApiRequest(response.data.data) : null;

      setRequests((prev) =>
        prev.map((item) =>
          item.id !== request.id
            ? item
            : updatedFromApi || {
                ...item,
                status: nextStatus,
                updatedAt: new Date().toISOString(),
              },
        ),
      );

      fetchDeleteRequests();
      setActionOpenRequestId("");

      toast.success(`Request moved to ${toStatusLabel(nextStatus)} successfully.`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to update request status.");
    } finally {
      setUpdatingRequestId("");
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to reject and delete this request? The user will be able to submit a new one.")) {
      return;
    }
    try {
      setUpdatingRequestId(requestId);
      const response = await httpClient.delete(`/api/delete-account/request/${requestId}`);
      
      if (response?.data?.success) {
        toast.success("Request rejected and deleted successfully.");
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
      } else {
        throw new Error(response?.data?.message || "Failed to delete request.");
      }
    } catch (error) {
      console.error("Delete Action Error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setUpdatingRequestId("");
    }
  };

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return requests;

    return requests.filter((item) =>
      [item.name, item.phoneNumber, item.email, item.reason, item.otherReason, item.id]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [requests, search]);

  return (
    <section className="min-h-screen bg-linear-to-br from-slate-100 via-white to-red-50 p-5 md:p-8">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulseRing { 0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,.18); } 50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .animate-fade-in { animation: fadeIn .45s ease-out forwards; }
        .animate-slide-in { animation: slideIn .4s ease-out forwards; }
        .tab-btn { transition: all .25s ease; }
        .tab-btn:hover { transform: translateY(-1px); }
        .tab-btn-active { animation: pulseRing 1.8s ease-in-out infinite; }
        .action-btn {
          background-size: 200% 100%;
          transition: transform .2s ease, box-shadow .25s ease;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(37,99,235,0.22);
          animation: shimmer 1.4s linear infinite;
        }
      `}</style>

      <div className="max-w-350 mx-auto animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <UserX className="w-7 h-7 text-red-600" /> Delete Account Requests
          </h1>
          <button
            type="button"
            onClick={fetchDeleteRequests}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 mb-5 animate-slide-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            <div className="lg:col-span-9 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone, reason or request ID"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="lg:col-span-3 text-right text-sm text-slate-500 font-medium">
              Showing: <span className="text-slate-700">{toStatusLabel(statusFilter === "all" ? "all" : statusFilter)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((option) => {
              const isActive = statusFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={`tab-btn px-4 py-2 rounded-full border text-sm font-semibold ${
                    isActive
                      ? "tab-btn-active border-blue-200 bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
            </div>
        

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="xl:col-span-2 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 bg-white">
              Loading delete account requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="xl:col-span-2 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 bg-white">
              No delete account requests found.
            </div>
          ) : (
            filteredRequests.map((item, index) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                      <User2 className="w-4 h-4 text-slate-500" /> {item.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 break-all">Request ID: {item.id}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${STATUS_CLASSES[item.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                    {toStatusLabel(item.status)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> {item.phoneNumber}</p>
                  <p className="flex items-center gap-2 break-all"><Mail className="w-4 h-4 text-slate-500" /> {item.email}</p>
                </div>

                <div className="mt-4 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-xs text-slate-500 mb-1">Reason</p>
                  <p className="text-sm text-slate-800">{item.reason}</p>
                  {item.otherReason ? (
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.otherReason}</p>
                  ) : null}
                </div>

                <div className="mt-4">
                  {item.status === "closed" ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Request Closed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRequest(item.id)}
                        disabled={updatingRequestId === item.id}
                        className="px-4 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setActionOpenRequestId((prev) => (prev === item.id ? "" : item.id))
                          }
                          disabled={updatingRequestId === item.id}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-linear-to-r from-violet-600 to-blue-600 text-white font-semibold transition-all duration-300 hover:from-violet-700 hover:to-blue-700 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <ArrowRight className={`w-4 h-4 transition-transform ${actionOpenRequestId === item.id ? "rotate-90" : ""}`} />
                          {actionOpenRequestId === item.id ? "Hide Actions" : "Take Action"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRequest(item.id)}
                          disabled={updatingRequestId === item.id}
                          className="px-4 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {actionOpenRequestId === item.id && (
                        <div className="mt-2.5 p-3 rounded-xl border border-slate-200 bg-white shadow-sm animate-fade-in mb-2">
                          <div className="mb-3">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
                              Schedule Deletion (Days)
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min="0"
                                max="30"
                                value={deletionDays}
                                onChange={(e) => setDeletionDays(e.target.value)}
                                className="w-full sm:w-32 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                placeholder="30"
                              />
                              <span className="text-xs text-slate-500 font-medium">
                                {deletionDays == 0 ? "(Immediate Deletion)" : `(Account deletes in ${deletionDays} days)`}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {getAllowedNextStatuses(item.status).map((nextStatus) => (
                            <button
                              key={`${item.id}-${nextStatus}`}
                              type="button"
                              onClick={() => handleTakeAction(item, nextStatus)}
                              disabled={updatingRequestId === item.id}
                              className={`action-btn w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-linear-to-r text-white font-semibold transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed ${getActionButtonClass(nextStatus)}`}
                            >
                              {updatingRequestId !== item.id && <ArrowRight className="w-4 h-4" />}
                              {updatingRequestId === item.id
                                ? "Updating..."
                                : `Mark as ${toStatusLabel(nextStatus)}`}
                            </button>
                          ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>Created: {formatDate(item.createdAt)}</span>
                  <span>Updated: {formatDate(item.updatedAt)}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DeleteAccountRequests;
