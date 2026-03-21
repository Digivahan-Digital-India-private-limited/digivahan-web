import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertTriangle, CalendarClock, Mail, Phone, RefreshCcw, Search, ShieldAlert, Tag, Ticket, Trash2, UserCheck, X } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digicapital.co.in";

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "Escalated", value: "escalated" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_BADGES = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  escalated: "bg-violet-100 text-violet-700 border-violet-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

const PRIORITY_BADGES = {
  high: "bg-rose-100 text-rose-700 border-rose-200",
  average: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const LIST_ENDPOINTS = [
  "/api/report/list",
  "/api/reports/list",
  "/api/reports-issue/list",
  "/api/report-issue/list",
];

const DELETE_ENDPOINTS = [
  "/api/report-issue/delete",
  "/api/report/delete",
  "/api/reports/delete",
  "/api/reports-issue/delete",
];

const UPDATE_ENDPOINTS = [
  "/api/report-issue/update",
  "/api/reports-issue/update",
  "/api/report/update",
  "/api/reports/update",
];

const toTitleCase = (value) => {
  const text = String(value || "").trim();
  if (!text) return "Unknown";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const normalizePriority = (value) => {
  const key = String(value || "").trim().toLowerCase();
  if (["high", "critical"].includes(key)) return "high";
  if (["average", "medium", "normal"].includes(key)) return "average";
  return "low";
};

const extractLinksFromText = (text) =>
  String(text || "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => /^https?:\/\//i.test(value));

const normalizeAttachments = (attachments) => {
  if (!Array.isArray(attachments)) return { text: "", links: [] };

  const values = attachments
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        return item.url || item.public_id || item.name || "";
      }
      return "";
    })
    .filter(Boolean);

  const links = values.filter((value) => /^https?:\/\//i.test(String(value).trim()));

  return {
    text: values.join(", "),
    links,
  };
};

const getLatestHistory = (history) => {
  if (!Array.isArray(history) || history.length === 0) return null;
  return [...history]
    .sort(
      (a, b) =>
        new Date(b?.updatedAt || b?.createdAt || 0).getTime() -
        new Date(a?.updatedAt || a?.createdAt || 0).getTime(),
    )[0];
};

const mapIssue = (item) => {
  const status = String(item?.status || "pending").toLowerCase();
  const latestHistory = getLatestHistory(item?.history);
  const attachmentMeta = normalizeAttachments(item?.attachments);
  const supportingProof =
    item?.supportingProof ||
    item?.proof ||
    item?.attachment ||
    attachmentMeta.text;

  const attachmentLinks = attachmentMeta.links.length > 0
    ? attachmentMeta.links
    : extractLinksFromText(supportingProof);

  return {
    id: item?._id || item?.id || "",
    ticketId: item?.ticketId || item?.ticket_id || item?.issueId || item?._id || "-",
    issueType: item?.issueType || item?.type || "-",
    priority: normalizePriority(item?.priority || item?.issuePriority || item?.severity),
    reportTitle: item?.reportTitle || item?.title || "Untitled Issue",
    reportDetails: item?.reportDetails || item?.details || item?.description || "-",
    supportingProof,
    attachmentLinks,
    status,
    name: item?.user_id?.name || item?.name || item?.userName || "Unknown User",
    email: item?.user_id?.email || item?.email || "-",
    phone: item?.user_id?.phoneNumber || item?.phone || item?.phoneNumber || "-",
    updatedByName:
      item?.updatedByName || item?.updated_by_name || latestHistory?.updatedByName || "",
    updatedByPhone:
      item?.updatedByPhone || item?.updated_by_phone || latestHistory?.updatedByPhone || "",
    agentName: item?.agentName || item?.agent_name || item?.assignedTo?.name || "",
    agentPhone: item?.agentPhone || item?.agent_phone || item?.assignedTo?.phone || "",
    note: item?.note || latestHistory?.note || "",
    history: Array.isArray(item?.history) ? item.history : [],
    createdAt: item?.createdAt || item?.created_at || "",
    updatedAt: item?.updatedAt || item?.updated_at || "",
  };
};

const ReportIssueList = () => {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [activeIssueId, setActiveIssueId] = useState("");
  const [isSavingAction, setIsSavingAction] = useState(false);
  const [selectedIssueIds, setSelectedIssueIds] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionForm, setActionForm] = useState({
    status: "pending",
    note: "",
    updatedByName: "",
    updatedByPhone: "",
    agentName: "",
    agentPhone: "",
  });

  const fetchIssues = useCallback(async () => {
    setIsLoading(true);

    const params = {};
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    try {
      let response = null;
      let lastError = null;

      for (const endpoint of LIST_ENDPOINTS) {
        try {
          response = await axios.get(`${BASE_URL}${endpoint}`, { params });
          if (response?.data?.success) {
            break;
          }
        } catch (error) {
          lastError = error;
        }
      }

      if (!response || !response?.data?.success) {
        throw lastError || new Error("Failed to fetch report issues.");
      }

      const mapped = (response?.data?.data || []).map(mapIssue);
      setIssues(mapped);
    } catch (error) {
      setIssues([]);
      toast.error(error.response?.data?.message || error.message || "Unable to load report issues.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    document.body.style.overflow = isActionDialogOpen || isDeleteConfirmOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isActionDialogOpen, isDeleteConfirmOpen]);

  const openTakeActionDialog = (issue) => {
    setActiveIssueId(issue.id);
    setActionForm({
      status: String(issue.status || "pending").toLowerCase(),
      note: issue.note || "",
      updatedByName: issue.updatedByName || issue.name || "",
      updatedByPhone: issue.updatedByPhone || issue.phone || "",
      agentName: issue.agentName || "",
      agentPhone: issue.agentPhone || "",
    });
    setIsActionDialogOpen(true);
  };

  const closeTakeActionDialog = () => {
    if (isSavingAction) return;
    setIsActionDialogOpen(false);
    setActiveIssueId("");
  };

  const handleActionInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "agentPhone" || name === "updatedByPhone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
      setActionForm((prev) => ({ ...prev, [name]: onlyDigits }));
      return;
    }

    setActionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAction = async () => {
        if (!actionForm.note.trim()) {
          toast.error("Please add a note.");
          return;
        }

    if (!activeIssueId) return;

    if (!actionForm.agentName.trim()) {
      toast.error("Please enter agent name.");
      return;
    }

    if (!/^\d{10}$/.test(actionForm.agentPhone)) {
      toast.error("Please enter a valid 10-digit agent phone number.");
      return;
    }

    if (!actionForm.updatedByName.trim()) {
      toast.error("Updated by name is required.");
      return;
    }

    if (!/^\d{10}$/.test(actionForm.updatedByPhone)) {
      toast.error("Please enter a valid 10-digit updated by phone number.");
      return;
    }

    try {
      setIsSavingAction(true);

      const payload = {
        status: actionForm.status,
        note: actionForm.note.trim(),
        updatedByName: actionForm.updatedByName.trim(),
        updatedByPhone: actionForm.updatedByPhone,
        agentName: actionForm.agentName.trim(),
        agentPhone: actionForm.agentPhone,
      };

      let response = null;
      let lastError = null;

      for (const endpoint of UPDATE_ENDPOINTS) {
        try {
          response = await axios.put(`${BASE_URL}${endpoint}/${activeIssueId}`, payload);
          if (response?.data?.success) break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!response || !response?.data?.success) {
        throw lastError || new Error("Failed to update issue.");
      }

      const updatedItem = response?.data?.data ? mapIssue(response.data.data) : null;

      setIssues((prev) =>
        prev.map((item) =>
          item.id === activeIssueId
            ? updatedItem || {
                ...item,
                status: actionForm.status,
                note: actionForm.note.trim(),
                updatedByName: actionForm.updatedByName.trim(),
                updatedByPhone: actionForm.updatedByPhone,
                agentName: actionForm.agentName.trim(),
                agentPhone: actionForm.agentPhone,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      toast.success(response?.data?.message || "Issue status updated successfully.");
      closeTakeActionDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to update issue.");
    } finally {
      setIsSavingAction(false);
    }
  };

  const toggleIssueSelection = (issueId) => {
    setSelectedIssueIds((prev) =>
      prev.includes(issueId) ? prev.filter((id) => id !== issueId) : [...prev, issueId],
    );
  };

  const toggleSelectAllFiltered = (checked, ids) => {
    if (!checked) {
      setSelectedIssueIds([]);
      return;
    }
    setSelectedIssueIds(ids);
  };

  const openDeleteConfirm = (mode) => {
    if (mode === "selected" && selectedIssueIds.length === 0) {
      toast.error("Please select at least one issue.");
      return;
    }

    if (mode === "status" && statusFilter === "all") {
      toast.error("Please select a status tab before deleting by status.");
      return;
    }

    setDeleteMode(mode);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    if (isDeleting) return;
    setDeleteMode("");
    setIsDeleteConfirmOpen(false);
  };

  const handleBulkDelete = async () => {
    if (!deleteMode) return;

    const idsToDelete =
      deleteMode === "selected"
        ? selectedIssueIds.filter(Boolean)
        : issues
            .filter((item) => item.status === statusFilter)
            .map((item) => item.id)
            .filter(Boolean);

    if (idsToDelete.length === 0) {
      toast.error(
        deleteMode === "selected"
          ? "No valid report IDs selected for deletion."
          : `No ${toTitleCase(statusFilter)} report IDs found to delete.`,
      );
      return;
    }

    const payload = { ids: idsToDelete };

    try {
      setIsDeleting(true);

      let response = null;
      let lastError = null;

      for (const endpoint of DELETE_ENDPOINTS) {
        try {
          response = await axios.delete(`${BASE_URL}${endpoint}`, {
            data: payload,
          });

          if (response?.data?.success) {
            break;
          }
        } catch (error) {
          lastError = error;
        }
      }

      if (!response || !response?.data?.success) {
        throw lastError || new Error("Failed to delete issues.");
      }

      setIssues((prev) =>
        prev.filter((item) => !idsToDelete.includes(item.id)),
      );

      setSelectedIssueIds([]);
      closeDeleteConfirm();
      toast.success(response?.data?.message || "Issues deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete issues.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredIssues = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return issues;

    return issues.filter((item) =>
      [
        item.ticketId,
        item.issueType,
        item.reportTitle,
        item.reportDetails,
        item.name,
        item.email,
        item.phone,
        item.note,
        item.priority,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [issues, search]);

  const filteredIssueIds = useMemo(
    () => filteredIssues.map((item) => item.id).filter(Boolean),
    [filteredIssues],
  );

  const allFilteredSelected =
    filteredIssueIds.length > 0 && filteredIssueIds.every((id) => selectedIssueIds.includes(id));

  const deletePreviewCount =
    deleteMode === "selected"
      ? selectedIssueIds.filter(Boolean).length
      : issues.filter((item) => item.status === statusFilter && item.id).length;

  return (
    <section className="min-h-screen bg-linear-to-br from-slate-100 via-white to-indigo-50 p-5 md:p-8">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes modalPop { from { opacity: 0; transform: scale(.92) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes confirmPop { from { opacity: 0; transform: scale(.88) translateY(16px);} to { opacity: 1; transform: scale(1) translateY(0);} }
        .fade-in-up { animation: fadeInUp .45s ease-out forwards; }
        .pop-in { animation: popIn .35s ease-out forwards; }
        .modal-pop { animation: modalPop .22s ease-out forwards; }
        .confirm-pop { animation: confirmPop .22s ease-out forwards; }
      `}</style>

      <div className="max-w-350 mx-auto fade-in-up">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-indigo-600" /> Report Issues
          </h1>

          <button
            type="button"
            onClick={fetchIssues}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-4 mb-5 pop-in">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket, title, user, email, phone or status"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 ${
                  statusFilter === tab.value
                    ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white border-blue-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={(e) => toggleSelectAllFiltered(e.target.checked, filteredIssueIds)}
                className="w-4 h-4 rounded border-slate-300"
              />
              Select all filtered issues
            </label>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => openDeleteConfirm("selected")}
                disabled={selectedIssueIds.length === 0}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIssueIds.length})
              </button>

              <button
                type="button"
                onClick={() => openDeleteConfirm("status")}
                disabled={statusFilter === "all"}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-rose-200 text-rose-700 bg-rose-50 text-sm font-semibold hover:bg-rose-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" /> Delete by Status ({toTitleCase(statusFilter)})
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="xl:col-span-2 bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              Loading reported issues...
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="xl:col-span-2 bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              No issues found for current filters.
            </div>
          ) : (
            filteredIssues.map((item, index) => (
              <article
                key={item.id || `${item.ticketId}-${index}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 fade-in-up"
                style={{ animationDelay: `${index * 65}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIssueIds.includes(item.id)}
                      onChange={() => toggleIssueSelection(item.id)}
                      className="mt-1 w-4 h-4 rounded border-slate-300"
                    />
                    <div>
                      <h2 className="font-semibold text-slate-800 text-lg">{item.reportTitle}</h2>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 break-all">
                        <Ticket className="w-3.5 h-3.5" /> Ticket: {item.ticketId}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${STATUS_BADGES[item.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                    {toTitleCase(item.status)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  <p className="flex items-center gap-2"><Tag className="w-4 h-4 text-slate-500" /> {item.issueType}</p>
                  <p className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-slate-500" />
                    Priority:
                    <span
                      className={`px-2 py-0.5 rounded-full border text-xs font-semibold capitalize ${PRIORITY_BADGES[item.priority] || "bg-slate-100 text-slate-700 border-slate-200"}`}
                    >
                      {toTitleCase(item.priority)}
                    </span>
                  </p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> {item.phone}</p>
                  <p className="sm:col-span-2 flex items-center gap-2 break-all"><Mail className="w-4 h-4 text-slate-500" /> {item.email}</p>
                </div>

                <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-xs text-slate-500 mb-1">Reported By</p>
                  <p className="text-sm text-slate-800 font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-2 mb-1">Issue Details</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.reportDetails}</p>
                  {Array.isArray(item.attachmentLinks) && item.attachmentLinks.length > 0 ? (
                    <div className="text-xs text-indigo-700 mt-2 space-y-1">
                      <p className="font-semibold">Proof</p>
                      <div className="flex flex-col gap-1">
                        {item.attachmentLinks.map((link, index) => (
                          <a
                            key={`${item.id || item.ticketId}-proof-${index}`}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline break-all"
                          >
                            Open Proof {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : item.supportingProof ? (
                    <p className="text-xs text-indigo-600 mt-2 break-all">Proof: {item.supportingProof}</p>
                  ) : null}
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => openTakeActionDialog(item)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg"
                  >
                    <UserCheck className="w-4 h-4" /> Take Action
                  </button>
                </div>

                {(item.updatedByName || item.agentName) && (
                  <div className="mt-3 p-3 rounded-xl border border-indigo-100 bg-indigo-50/60">
                    <p className="text-xs text-indigo-700 font-semibold">Latest Action</p>
                    <p className="text-xs text-slate-700 mt-1">
                      Updated By: {item.updatedByName || "-"} ({item.updatedByPhone || "-"})
                    </p>
                    {item.agentName || item.agentPhone ? (
                      <p className="text-xs text-slate-700 mt-0.5">
                        Agent: {item.agentName || "-"} ({item.agentPhone || "-"})
                      </p>
                    ) : (
                      <p className="text-xs text-slate-700 mt-0.5">Agent: -</p>
                    )}
                    <p className="text-xs text-slate-700 mt-0.5">
                      Note: {item.note || "-"}
                    </p>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" /> Created: {formatDate(item.createdAt)}</span>
                  <span>Updated: {formatDate(item.updatedAt)}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {isActionDialogOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeTakeActionDialog}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            aria-label="Close take action dialog"
          />

          <div className="relative modal-pop w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 md:p-7">
            <button
              type="button"
              onClick={closeTakeActionDialog}
              className="absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <h3 className="text-2xl font-bold text-slate-900">Take Action</h3>
              <p className="text-sm text-slate-500 mt-1">Update issue status and action details by admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status (Admin Editable)</label>
                <select
                  name="status"
                  value={actionForm.status}
                  onChange={handleActionInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Note</label>
                <textarea
                  name="note"
                  value={actionForm.note}
                  onChange={handleActionInputChange}
                  rows={3}
                  placeholder="Add action note for user"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Updated By Name</label>
                <input
                  type="text"
                  name="updatedByName"
                  value={actionForm.updatedByName}
                  onChange={handleActionInputChange}
                  placeholder="Admin name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Updated By Phone</label>
                <input
                  type="tel"
                  name="updatedByPhone"
                  value={actionForm.updatedByPhone}
                  onChange={handleActionInputChange}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit phone"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Agent Name</label>
                <input
                  type="text"
                  name="agentName"
                  value={actionForm.agentName}
                  onChange={handleActionInputChange}
                  placeholder="Enter agent name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Agent Phone Number</label>
                <input
                  type="tel"
                  name="agentPhone"
                  value={actionForm.agentPhone}
                  onChange={handleActionInputChange}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter agent phone number"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeTakeActionDialog}
                disabled={isSavingAction}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAction}
                disabled={isSavingAction}
                className="px-5 py-2.5 rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-60"
              >
                {isSavingAction ? "Saving..." : "Update Issue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeDeleteConfirm}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            aria-label="Close delete confirmation"
          />

          <div className="relative confirm-pop w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 grid place-items-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Confirm Delete</h3>
            <p className="text-sm text-slate-600 mt-2">
              {deleteMode === "selected"
                ? `You are about to delete ${selectedIssueIds.length} selected issue(s). This action cannot be undone.`
                : `You are about to delete all ${toTitleCase(statusFilter)} issues in bulk. This action cannot be undone.`}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              Request payload will send <span className="font-semibold">{deletePreviewCount}</span> report ID(s).
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReportIssueList;
