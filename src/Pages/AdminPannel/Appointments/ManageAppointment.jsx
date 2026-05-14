import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Eye,
  Filter,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  getAppointments,
  updateAppointment,
  deleteAppointments
} from "../../../features/support/services/appointmentApi";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const STATUS_UI_TO_API = {
  Pending: "pending",
  Accept: "approved",
  Reject: "rejected",
  Visited: "visited",
};

const STATUS_API_TO_UI = {
  pending: "Pending",
  approved: "Accept",
  rejected: "Reject",
  visited: "Visited",
  accept: "Accept",
  reject: "Reject",
};

const normalizeStatus = (status = "") => {
  const normalized = String(status).trim().toLowerCase();
  if (STATUS_API_TO_UI[normalized]) {
    return STATUS_API_TO_UI[normalized];
  }
  if (!status) {
    return "Pending";
  }
  return `${status}`;
};

const MOBILE_NUMBER_REGEX = /^\d{10}$/;

const toDateOnly = (value) => {
  if (!value) {
    return "-";
  }
  const strValue = String(value);
  return strValue.includes("T") ? strValue.split("T")[0] : strValue;
};

const normalizeAppointment = (appointment, index) => ({
  id: appointment?.ticketId || appointment?._id || appointment?.id || appointment?.appointmentId || `APT-${index + 1}`,
  backendId: appointment?._id || appointment?.id || appointment?.appointmentId || "",
  name: appointment?.name || "-",
  companyName: appointment?.companyName || "-",
  phoneNumber: appointment?.phoneNumber || "-",
  businessEmail: appointment?.businessEmail || "-",
  whomToMeet: appointment?.whomToMeet || "-",
  role: appointment?.role || "-",
  status: normalizeStatus(appointment?.status),
  reason: appointment?.reason || "-",
  proposalDescription: appointment?.proposalDescription || "-",
  requestedDate: toDateOnly(appointment?.requestedDate || appointment?.createdAt),
  appointmentDate: toDateOnly(appointment?.appointmentDate),
});

const toAppointmentDateTime = (dateValue) => {
  if (!dateValue || dateValue === "-") {
    return undefined;
  }
  return String(dateValue).includes("T") ? String(dateValue) : `${dateValue}T11:00:00`;
};

const getDefaultAgentMeta = () => {
  return {
    agentName: "",
    agentPhone: "",
  };
};

const roleOptions = [
  "All",
  "Authorized Vehicle Dealers",
  "Logistics & Courier Partners",
  "Technology & API Integration Partners",
  "Fleet Operators",
  "Investors & Business Associates",
];

const statusOptions = ["All", "Pending", "Accept", "Reject", "Visited"];
const meetOptions = ["All", "Business Development Team", "Technical Integration Team", "Operations Team"];

const statusPill = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Accept: "bg-green-100 text-green-700 border-green-200",
  Reject: "bg-red-100 text-red-700 border-red-200",
  Visited: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

const ManageAppointment = () => {
  const todayDate = new Date().toISOString().split("T")[0];
  const [activeTab, setActiveTab] = useState("manage");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [filters, setFilters] = useState({ role: "All", status: "Pending", whomToMeet: "All" });
  const [deleteFilters, setDeleteFilters] = useState({ role: "All", status: "All", whomToMeet: "All" });

  const [expandedAppointmentId, setExpandedAppointmentId] = useState("");
  const [actionOpenId, setActionOpenId] = useState("");
  const [actionStatus, setActionStatus] = useState({});
  const [actionDate, setActionDate] = useState({});
  const [actionAgentName, setActionAgentName] = useState({});
  const [actionAgentPhone, setActionAgentPhone] = useState({});
  const [updatingActionId, setUpdatingActionId] = useState("");
  const [actionError, setActionError] = useState({});
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState({ type: "", text: "" });

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchRole = filters.role === "All" || appointment.role === filters.role;
      const matchStatus = filters.status === "All" || appointment.status === filters.status;
      const matchWhom = filters.whomToMeet === "All" || appointment.whomToMeet === filters.whomToMeet;
      return matchRole && matchStatus && matchWhom;
    });
  }, [appointments, filters]);

  const deletePageAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchRole = deleteFilters.role === "All" || appointment.role === deleteFilters.role;
      const matchStatus = deleteFilters.status === "All" || appointment.status === deleteFilters.status;
      const matchWhom = deleteFilters.whomToMeet === "All" || appointment.whomToMeet === deleteFilters.whomToMeet;
      return matchRole && matchStatus && matchWhom;
    });
  }, [appointments, deleteFilters]);

  const selectedActionAppointment = useMemo(
    () => appointments.find((appointment) => appointment.id === actionOpenId),
    [appointments, actionOpenId]
  );

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteFilterChange = (event) => {
    const { name, value } = event.target;
    setDeleteFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ role: "All", status: "Pending", whomToMeet: "All" });
  };

  const resetDeleteFilters = () => {
    setDeleteFilters({ role: "All", status: "All", whomToMeet: "All" });
  };

  const toggleAppointmentDetails = (appointmentId) => {
    setExpandedAppointmentId((prev) => (prev === appointmentId ? "" : appointmentId));
    setActionOpenId("");
  };

  const openActionDialog = (appointment) => {
    const defaultAgentMeta = getDefaultAgentMeta();
    setActionOpenId(appointment.id);
    setActionStatus((prev) => ({ ...prev, [appointment.id]: prev[appointment.id] || "" }));
    setActionDate((prev) => ({ ...prev, [appointment.id]: prev[appointment.id] || "" }));
    setActionAgentName((prev) => ({
      ...prev,
      [appointment.id]: prev[appointment.id] || defaultAgentMeta.agentName,
    }));
    setActionAgentPhone((prev) => ({
      ...prev,
      [appointment.id]: prev[appointment.id] || defaultAgentMeta.agentPhone,
    }));
    setActionError((prev) => ({ ...prev, [appointment.id]: "" }));
  };

  const closeActionDialog = () => {
    setActionOpenId("");
  };

  const handleStatusUpdate = async (appointmentId) => {
    const nextStatus = actionStatus[appointmentId];
    if (!nextStatus) {
      setActionError((prev) => ({ ...prev, [appointmentId]: "Please select a status first." }));
      return;
    }

    const targetAppointment = appointments.find((appointment) => appointment.id === appointmentId);
    if (!targetAppointment) {
      setActionError((prev) => ({ ...prev, [appointmentId]: "Appointment not found." }));
      return;
    }

    if (!targetAppointment.backendId) {
      setActionError((prev) => ({ ...prev, [appointmentId]: "Invalid appointment id for update." }));
      return;
    }

    const selectedTeamDate = actionDate[appointmentId];
    const finalDate = selectedTeamDate || targetAppointment.requestedDate;
    const agentName = (actionAgentName[appointmentId] || "").trim();
    const agentPhone = (actionAgentPhone[appointmentId] || "").trim();

    if (!agentName || !agentPhone) {
      setActionError((prev) => ({
        ...prev,
        [appointmentId]: "Agent Name and Agent Mobile Number are required.",
      }));
      return;
    }

    if (!MOBILE_NUMBER_REGEX.test(agentPhone)) {
      setActionError((prev) => ({
        ...prev,
        [appointmentId]: "Agent Mobile Number must be exactly 10 digits.",
      }));
      return;
    }

    const payload = {
      status: STATUS_UI_TO_API[nextStatus] || String(nextStatus).toLowerCase(),
      agentName,
      agentPhone,
    };

    const formattedDate = toAppointmentDateTime(finalDate);
    if (formattedDate) {
      payload.appointmentDate = formattedDate;
    }

    try {
      setUpdatingActionId(appointmentId);
      setActionError((prev) => ({ ...prev, [appointmentId]: "" }));

      const response = await updateAppointment(targetAppointment.backendId, payload);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to update appointment status.");
      }

      setAppointments((prev) =>
        prev.map((appointment) => {
          if (appointment.id !== appointmentId) {
            return appointment;
          }
          if (appointment.status === "Visited") {
            return appointment;
          }
          return {
            ...appointment,
            status: nextStatus,
            appointmentDate: finalDate,
          };
        })
      );

      setActionOpenId("");
    } catch (error) {
      setActionError((prev) => ({
        ...prev,
        [appointmentId]:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to update appointment status.",
      }));
    } finally {
      setUpdatingActionId("");
    }
  };

  const toggleSelectForDelete = (appointmentId) => {
    setSelectedForDelete((prev) =>
      prev.includes(appointmentId)
        ? prev.filter((id) => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const deleteSelectedAppointments = async () => {
    if (selectedForDelete.length === 0) {
      return;
    }

    const shouldDelete = window.confirm("Delete selected appointments?");
    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteMessage({ type: "", text: "" });

      const response = await deleteAppointments(selectedForDelete);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to delete selected appointments.");
      }

      setAppointments((prev) => prev.filter((appointment) => !selectedForDelete.includes(appointment.id)));
      setSelectedForDelete([]);
      setExpandedAppointmentId("");
      setActionOpenId("");
      setDeleteMessage({ type: "success", text: "Selected appointments deleted successfully." });
    } catch (error) {
      setDeleteMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to delete selected appointments.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteAllByType = async () => {
    const idsToDelete = deletePageAppointments.map((appointment) => appointment.backendId).filter(Boolean);
    if (idsToDelete.length === 0) {
      return;
    }

    const shouldDelete = window.confirm(`Delete ${idsToDelete.length} appointment(s) from current filtered results?`);
    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteMessage({ type: "", text: "" });

      const response = await deleteAppointments(idsToDelete);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to delete filtered appointments.");
      }

      setAppointments((prev) => prev.filter((appointment) => !idsToDelete.includes(appointment.id)));
      setSelectedForDelete((prev) => prev.filter((id) => !idsToDelete.includes(id)));
      setExpandedAppointmentId("");
      setActionOpenId("");
      setDeleteMessage({ type: "success", text: "Filtered appointments deleted successfully." });
    } catch (error) {
      setDeleteMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to delete filtered appointments.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const currentFilters = activeTab === "manage" ? filters : deleteFilters;

    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setFetchError("");

        const params = {};
        if (currentFilters.whomToMeet !== "All") {
          params.whomToMeet = currentFilters.whomToMeet;
        }
        if (currentFilters.role !== "All") {
          params.role = currentFilters.role;
        }
        if (currentFilters.status !== "All") {
          params.status = STATUS_UI_TO_API[currentFilters.status] || String(currentFilters.status).toLowerCase();
        }

        const response = await getAppointments(params);

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Failed to fetch appointments.");
        }

        const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
        setAppointments(rows.map((item, index) => normalizeAppointment(item, index)));
      } catch (error) {
        setAppointments([]);
        setFetchError(error?.response?.data?.message || error?.message || "Unable to fetch appointments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [activeTab, filters, deleteFilters]);

  return (
    <section className="min-h-full p-4 md:p-6 lg:p-8 bg-linear-to-br from-slate-50 via-blue-50/40 to-indigo-100/50">
      <style>{`
        @keyframes apFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes apSoftPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.16); }
          60% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
        }
        @keyframes apFloat {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .ap-fade-up { animation: apFadeUp .55s ease-out both; }
        .ap-float { animation: apFloat 4s ease-in-out infinite; }
        .ap-lift {
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }
        .ap-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 38px rgba(30,64,175,0.12);
          border-color: #bfdbfe;
        }
        .ap-soft-pulse {
          animation: apSoftPulse 2.6s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        <div
          className="ap-fade-up ap-lift bg-white/90 backdrop-blur border border-blue-100 rounded-2xl p-5 md:p-6"
          style={{ boxShadow: "0 16px 35px rgba(30,64,175,0.08)" }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 ap-float">
                <CalendarDays className="w-4 h-4" /> Appointment Management
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-3">Manage Appointment</h1>
              <p className="text-sm text-slate-500 mt-2">
                View appointment details, take action, and manage delete operations.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Showing</p>
              <p className="text-2xl font-extrabold text-blue-700">
                {activeTab === "manage" ? filteredAppointments.length : deletePageAppointments.length}
              </p>
              <p className="text-xs text-slate-500">appointments</p>
            </div>
          </div>

          <div className="mt-5 inline-flex bg-linear-to-r from-slate-100 to-blue-50 rounded-xl p-1 gap-1 border border-blue-100">
            <button
              type="button"
              onClick={() => setActiveTab("manage")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === "manage"
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md ap-soft-pulse"
                  : "text-slate-600 hover:bg-white/80"
              }`}
            >
              Appointment List
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("delete")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === "delete"
                  ? "bg-linear-to-r from-red-500 to-rose-500 text-white shadow-md"
                  : "text-slate-600 hover:bg-white/80"
              }`}
            >
              Delete Appointments
            </button>
          </div>
        </div>

        {activeTab === "manage" ? (
          <>
            <div className="ap-fade-up ap-lift bg-white border border-slate-200 rounded-2xl p-5 shadow-sm" style={{ animationDelay: "120ms" }}>
              <div className="flex items-center gap-2 mb-4 text-slate-700">
                <Filter className="w-4 h-4" />
                <h2 className="text-sm font-bold">Filter Appointments</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="role" className="text-xs font-semibold text-slate-600">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="text-xs font-semibold text-slate-600">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="whomToMeet" className="text-xs font-semibold text-slate-600">Whom to Meet</label>
                  <select
                    id="whomToMeet"
                    name="whomToMeet"
                    value={filters.whomToMeet}
                    onChange={handleFilterChange}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {meetOptions.map((team) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="ap-fade-up bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                  Loading appointments...
                </div>
              ) : fetchError ? (
                <div className="ap-fade-up bg-white border border-red-200 rounded-2xl p-10 text-center text-red-600">
                  {fetchError}
                </div>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => {
                  const isExpanded = expandedAppointmentId === appointment.id;
                  const isVisited = appointment.status === "Visited";

                  return (
                    <article
                      key={appointment.id}
                      className="ap-fade-up ap-lift bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm cursor-pointer"
                      style={{ animationDelay: `${index * 90}ms` }}
                      onClick={() => toggleAppointmentDetails(appointment.id)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-800">{appointment.name}</h3>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusPill[appointment.status]}`}>
                              {appointment.status}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
                            <p className="flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500" /> {appointment.companyName}</p>
                            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-500" /> {appointment.phoneNumber}</p>
                            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" /> {appointment.businessEmail}</p>
                            <p className="flex items-center gap-2"><UserRound className="w-4 h-4 text-blue-500" /> {appointment.whomToMeet}</p>
                            <p className="flex items-center gap-2 md:col-span-2"><BriefcaseBusiness className="w-4 h-4 text-blue-500" /> {appointment.role}</p>
                          </div>
                        </div>

                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-4 py-3 min-w-55">
                          <p className="text-xs text-blue-600 font-semibold">Appointment Date</p>
                          <p className="text-sm font-bold text-slate-800 mt-1">{appointment.appointmentDate || appointment.requestedDate}</p>
                          <p className="text-[11px] text-slate-500 mt-1">Requested: {appointment.requestedDate}</p>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleAppointmentDetails(appointment.id);
                            }}
                            className="mt-3 inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                          >
                            <Eye className="w-4 h-4" /> {isExpanded ? "Hide Details" : "View Details"}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div
                          className="mt-5 border-t border-slate-200 pt-5 space-y-4"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 ap-lift">
                              <p className="text-xs font-semibold text-slate-500">Name</p>
                              <p className="mt-2 leading-6">{appointment.name}</p>
                            </div>
                            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 ap-lift">
                              <p className="text-xs font-semibold text-slate-500">Company Name</p>
                              <p className="mt-2 leading-6">{appointment.companyName}</p>
                            </div>
                            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 ap-lift">
                              <p className="text-xs font-semibold text-slate-500">Phone Number</p>
                              <p className="mt-2 leading-6">{appointment.phoneNumber}</p>
                            </div>
                            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 ap-lift">
                              <p className="text-xs font-semibold text-slate-500">Business Email</p>
                              <p className="mt-2 leading-6">{appointment.businessEmail}</p>
                            </div>
                            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 ap-lift">
                              <p className="text-xs font-semibold text-slate-500">Whom to Meet</p>
                              <p className="mt-2 leading-6">{appointment.whomToMeet}</p>
                            </div>
                            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 ap-lift">
                              <p className="text-xs font-semibold text-slate-500">Role</p>
                              <p className="mt-2 leading-6">{appointment.role}</p>
                            </div>
                            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 ap-lift">
                              <p className="text-xs font-semibold text-slate-500">Reason</p>
                              <p className="mt-2 leading-6">{appointment.reason}</p>
                            </div>
                            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 ap-lift">
                              <p className="text-xs font-semibold text-slate-500">Proposal Description</p>
                              <p className="mt-2 leading-6">{appointment.proposalDescription}</p>
                            </div>
                          </div>

                          <div className="bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 ap-lift">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <h4 className="text-sm font-bold text-indigo-800">Take Action</h4>
                              {isVisited ? (
                                <p className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                                  <ShieldCheck className="w-4 h-4" /> Status fixed as Visited
                                </p>
                              ) : null}
                            </div>

                            <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openActionDialog(appointment);
                                }}
                                disabled={isVisited || updatingActionId === appointment.id}
                                className="px-4 py-2 text-sm font-semibold rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                Take Action
                              </button>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">
                              Team date is optional. If not selected, appointment date will be set to requested date ({appointment.requestedDate}).
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="ap-fade-up bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                  No appointments found for selected filters.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="ap-fade-up ap-lift bg-white border border-slate-200 rounded-2xl p-5 shadow-sm" style={{ animationDelay: "120ms" }}>
              <div className="flex items-center gap-2 mb-4 text-slate-700">
                <Trash2 className="w-4 h-4" />
                <h2 className="text-sm font-bold">Delete Appointment Filters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="delete-role" className="text-xs font-semibold text-slate-600">Type (Role)</label>
                  <select
                    id="delete-role"
                    name="role"
                    value={deleteFilters.role}
                    onChange={handleDeleteFilterChange}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="delete-status" className="text-xs font-semibold text-slate-600">Status</label>
                  <select
                    id="delete-status"
                    name="status"
                    value={deleteFilters.status}
                    onChange={handleDeleteFilterChange}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="delete-whomToMeet" className="text-xs font-semibold text-slate-600">Whom to Meet</label>
                  <select
                    id="delete-whomToMeet"
                    name="whomToMeet"
                    value={deleteFilters.whomToMeet}
                    onChange={handleDeleteFilterChange}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    {meetOptions.map((team) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={resetDeleteFilters}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                >
                  Reset Filters
                </button>

                <button
                  type="button"
                  onClick={deleteSelectedAppointments}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-linear-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={selectedForDelete.length === 0 || isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Selected"}
                </button>

                <button
                  type="button"
                  onClick={deleteAllByType}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={deletePageAppointments.length === 0 || isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Filtered"}
                </button>
              </div>

              {deleteMessage.text ? (
                <p className={`mt-3 text-sm font-medium ${deleteMessage.type === "error" ? "text-red-600" : "text-green-600"}`}>
                  {deleteMessage.text}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="ap-fade-up bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                  Loading appointments...
                </div>
              ) : fetchError ? (
                <div className="ap-fade-up bg-white border border-red-200 rounded-2xl p-10 text-center text-red-600">
                  {fetchError}
                </div>
              ) : deletePageAppointments.length > 0 ? (
                deletePageAppointments.map((appointment, index) => (
                  <article
                    key={appointment.id}
                    className="ap-fade-up ap-lift bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedForDelete.includes(appointment.backendId)}
                          onChange={() => toggleSelectForDelete(appointment.backendId)}
                          disabled={!appointment.backendId}
                          className="mt-1 h-4 w-4 rounded border-slate-300"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {appointment.name}
                          </p>
                          <p className="text-sm text-slate-600">{appointment.role}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {appointment.whomToMeet} • {appointment.status}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {appointment.requestedDate}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="ap-fade-up bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                  No appointments available for selected delete filters.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {actionOpenId && selectedActionAppointment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeActionDialog}
          />
          <div
            className="relative z-10 w-full max-w-2xl rounded-2xl border border-indigo-100 bg-white p-5 md:p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Take Action</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedActionAppointment.name} • {selectedActionAppointment.role}
                </p>
              </div>
              <button
                type="button"
                onClick={closeActionDialog}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 bg-white hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Status</label>
                <select
                  value={actionStatus[selectedActionAppointment.id] || ""}
                  onChange={(event) => {
                    setActionStatus((prev) => ({ ...prev, [selectedActionAppointment.id]: event.target.value }));
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="">Select status</option>
                  <option value="Accept">Accept</option>
                  <option value="Reject">Reject</option>
                  <option value="Visited">Visited</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Appointment Date (Optional)</label>
                <input
                  type="date"
                  min={todayDate}
                  value={actionDate[selectedActionAppointment.id] || ""}
                  onChange={(event) => {
                    setActionDate((prev) => ({ ...prev, [selectedActionAppointment.id]: event.target.value }));
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Agent Name</label>
                <input
                  type="text"
                  value={actionAgentName[selectedActionAppointment.id] || ""}
                  onChange={(event) => {
                    setActionAgentName((prev) => ({ ...prev, [selectedActionAppointment.id]: event.target.value }));
                  }}
                  placeholder="Enter agent name"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Agent Mobile Number</label>
                <input
                  type="text"
                  value={actionAgentPhone[selectedActionAppointment.id] || ""}
                  onChange={(event) => {
                    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 10);
                    setActionAgentPhone((prev) => ({ ...prev, [selectedActionAppointment.id]: digitsOnly }));
                  }}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter agent mobile number"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              If Appointment Date is not selected, requested date ({selectedActionAppointment.requestedDate}) will be used.
            </p>

            {actionError[selectedActionAppointment.id] ? (
              <p className="mt-2 text-xs text-red-600">{actionError[selectedActionAppointment.id]}</p>
            ) : null}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeActionDialog}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusUpdate(selectedActionAppointment.id)}
                disabled={updatingActionId === selectedActionAppointment.id}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-indigo-300 text-indigo-700 bg-white hover:bg-indigo-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updatingActionId === selectedActionAppointment.id ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ManageAppointment;
