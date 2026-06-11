import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  Shield,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Car,
  AlertCircle,
  Loader2,
  QrCode,
  ShoppingBag,
  HeartPulse,
} from "lucide-react";
import httpClient from "../../../features/shared/api/httpClient";

/* ─────────────────────── helpers ─────────────────────── */
const getDisplayName = (u) => {
  const nick = u.public_details?.nick_name?.trim();
  if (nick) return nick;
  const first = u.basic_details?.first_name || "";
  const last = u.basic_details?.last_name || "";
  return `${first} ${last}`.trim() || "Unknown User";
};

const getInitials = (name) => {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "??";
};

const statusColors = {
  ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  SUSPENDED: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  PENDING_DELETION: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  DELETED: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

const avatarColors = [
  "from-violet-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-purple-500 to-pink-500",
];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

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
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Block User</h3>
            <p className="text-sm text-gray-500">This action is serious and immediate</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
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
              <Shield className="w-4 h-4" />
            )}
            {blocking ? "Blocking..." : "Block User"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── Delete Confirm Modal ─────────────────────── */
const DeleteConfirmModal = ({ user, onConfirm, onCancel, deleting }) => {
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
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
            <p className="text-sm text-gray-500">This action will soft-delete the user</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              <span className="font-semibold">{name}</span> will be{" "}
              <span className="font-bold">deleted</span> — an email notification will be sent to them.
            </p>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Reason for deletion{" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Account closed per user request..."
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
            disabled={deleting || !reason.trim()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {deleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── User Detail Modal ─────────────────────── */
const UserDetailModal = ({ user, onClose, onRefresh }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) return null;

  const name = getDisplayName(user);
  const color = getAvatarColor(name);
  const bd = user.basic_details || {};
  const pd = user.public_details || {};
  const status = user.account_status || "ACTIVE";
  const sc = statusColors[status] || statusColors.ACTIVE;
  const vehicleCount = user.garage?.vehicles?.length || 0;
  const activeQrCount = user.active_qr_count ?? user.qr_list?.length ?? 0;
  const qrCount = user.qr_list?.length || 0;
  const orderCount = user.my_orders?.length || 0;
  const emergencyCount = user.emergency_contacts?.length || 0;

  const InfoRow = ({ icon: Icon, label, value, verified }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 font-medium mt-0.5 break-all">{value || "—"}</p>
      </div>
      {verified !== undefined && (
        <div className="shrink-0">
          {verified ? (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              <XCircle className="w-3.5 h-3.5" /> Unverified
            </span>
          )}
        </div>
      )}
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color: c }) => (
    <div className={`rounded-xl p-3 ${c}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );

  const handleUnblock = async () => {
    setActionLoading(true);
    try {
      await httpClient.post("/api/user/admin/unblock-user", { userId: user._id });
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlock = async (reason) => {
    setActionLoading(true);
    try {
      await httpClient.post("/api/user/admin/block-user", { userId: user._id, reason });
      if (onRefresh) onRefresh();
      setShowBlockConfirm(false);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (reason) => {
    setActionLoading(true);
    try {
      await httpClient.delete(`/api/user/admin/delete-user/${user._id}`, { data: { reason } });
      if (onRefresh) onRefresh();
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
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
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold ring-2 ring-white/40">
              {bd.profile_pic || pd.public_pic ? (
                <img
                  src={pd.public_pic || bd.profile_pic}
                  alt={name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{name}</h2>
              <p className="text-white/75 text-sm mb-1">{bd.occupation || "No occupation"}</p>
              <p className="text-white/60 text-xs font-mono">ID: {user._id}</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20`}>
                  <span className={`w-1.5 h-1.5 rounded-full bg-white`} />
                  {status}
                </span>
                {pd.gender && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 capitalize">
                    {pd.gender}
                  </span>
                )}
                {pd.age && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20">
                    Age: {pd.age}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="bg-white/15 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{vehicleCount}</p>
              <p className="text-xs text-white/70">Vehicles</p>
            </div>
            <div className="bg-white/15 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{user.garage?.vehicles?.filter(v => v.qr_list?.length > 0).length || 0}</p>
              <p className="text-xs text-white/70">QR Vehicles</p>
            </div>
            <div className="bg-white/15 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{orderCount}</p>
              <p className="text-xs text-white/70">Orders</p>
            </div>
            <div className="bg-white/15 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{emergencyCount}</p>
              <p className="text-xs text-white/70">Contacts</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          {status === "BLOCKED" && user.blocked_reason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800">Blocked Reason</h4>
                  <p className="text-sm text-red-700 mt-0.5">{user.blocked_reason}</p>
                </div>
              </div>
            </div>
          )}

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Contact Information</h3>
          <div className="bg-gray-50 rounded-xl px-4">
            <InfoRow icon={Phone} label="Phone Number" value={bd.phone_number} verified={bd.phone_number_verified} />
            <InfoRow icon={Mail} label="Email Address" value={bd.email} verified={bd.is_email_verified} />
            {pd.address && <InfoRow icon={MapPin} label="Public Address" value={pd.address} />}
          </div>

          {user.address_book?.length > 0 && (
            <>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-5 mb-3">
                Address Book ({user.address_book.length})
              </h3>
              <div className="space-y-2">
                {user.address_book.map((addr, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800">{addr.name || `Address ${i + 1}`}</p>
                      {addr.default_status && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {[addr.house_no_building, addr.street_name, addr.road_or_area, addr.city, addr.state, addr.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {addr.contact_no && <p className="text-xs text-gray-400 mt-1">{addr.contact_no}</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          {user.garage?.vehicles?.length > 0 && (() => {
            const vehicles = user.garage.vehicles;
            const vehiclesWithQR = vehicles.filter(v => v.qr_list?.length > 0).length;
            return (
              <>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-5 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <Car className="w-3 h-3 text-blue-600" />
                  </span>
                  Garage
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {vehicles.length} Vehicles
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {vehiclesWithQR} QR Created
                    </span>
                  </span>
                </h3>
                <div className="space-y-2">
                  {vehicles.map((v, i) => {
                    const hasQR = v.qr_list?.length > 0;
                    return (
                      <div key={i} className={`rounded-xl p-3 flex items-center gap-3 border ${hasQR ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${hasQR ? "bg-emerald-100" : "bg-gray-200"}`}>
                          <Car className={`w-4 h-4 ${hasQR ? "text-emerald-600" : "text-gray-500"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{v.vehicle_id}</p>
                          <p className={`text-xs mt-0.5 ${hasQR ? "text-emerald-600 font-medium" : "text-gray-400"}`}>
                            {hasQR
                              ? `${v.qr_list.length} QR Code${v.qr_list.length > 1 ? "s" : ""} Created`
                              : "No QR Created"}
                          </p>
                        </div>
                        {hasQR ? (
                          <span className="shrink-0 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <QrCode className="w-3 h-3" /> {v.qr_list.length}
                          </span>
                        ) : (
                          <span className="shrink-0 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium">
                            No QR
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}


          {/* ── QR Codes ── */}
          {qrCount > 0 && (
            <>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-5 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center">
                  <QrCode className="w-3 h-3 text-violet-600" />
                </span>
                QR Codes
                <span className="ml-auto bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {qrCount}
                </span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {user.qr_list.map((qr, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                      <QrCode className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{qr}</p>
                      <p className="text-xs text-gray-400">QR Code {i + 1}</p>
                    </div>
                    <span className="shrink-0 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Orders ── */}
          {orderCount > 0 && (
            <>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-5 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                  <ShoppingBag className="w-3 h-3 text-amber-600" />
                </span>
                Orders
                <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {orderCount}
                </span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {user.my_orders.map((orderId, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                      <p className="text-sm font-semibold text-gray-800 truncate font-mono">
                        {typeof orderId === "object" ? (orderId?._id || orderId?.toString() || "—") : orderId}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Emergency Contacts ── */}
          {emergencyCount > 0 && (
            <>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-5 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center">
                  <HeartPulse className="w-3 h-3 text-rose-600" />
                </span>
                Emergency Contacts
                <span className="ml-auto bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {emergencyCount}
                </span>
              </h3>
              <div className="space-y-2">
                {user.emergency_contacts.map((contact, i) => {
                  const contactName =
                    `${contact.first_name || ""} ${contact.last_name || ""}`.trim() || "Unknown";
                  const initials = getInitials(contactName);
                  const cColor = avatarColors[i % avatarColors.length];
                  return (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-xl p-3 flex items-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${cColor} flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden`}
                      >
                        {contact.profile_pic ? (
                          <img
                            src={contact.profile_pic}
                            alt={contactName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{contactName}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {contact.relation && (
                            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium capitalize">
                              {contact.relation}
                            </span>
                          )}
                          {contact.phone_number && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {contact.phone_number}
                            </span>
                          )}
                          {contact.email && (
                            <span className="text-xs text-gray-400 truncate max-w-[140px]">{contact.email}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-5 mb-3">Account Details</h3>
          <div className="bg-gray-50 rounded-xl px-4">
            <InfoRow icon={Calendar} label="Joined On" value={formatDate(user.createdAt)} />
            <InfoRow icon={Shield} label="Account Status" value={status} />
            {user.suspension_reason && (
              <InfoRow icon={AlertCircle} label="Suspension Reason" value={user.suspension_reason} />
            )}
            {user.suspended_until && (
              <InfoRow icon={Calendar} label="Suspended Until" value={formatDate(user.suspended_until)} />
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                if (status === "BLOCKED") {
                  handleUnblock();
                } else {
                  setShowBlockConfirm(true);
                }
              }}
              disabled={actionLoading}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition flex justify-center items-center gap-2 ${status === "BLOCKED"
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                } disabled:opacity-50`}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {status === "BLOCKED" ? "Unblock User" : "Block User"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={actionLoading}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-red-100 text-red-700 hover:bg-red-200 transition flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Delete User
            </button>
          </div>
        </div>
      </div>

      {showBlockConfirm && (
        <BlockConfirmModal
          user={user}
          onConfirm={handleBlock}
          onCancel={() => setShowBlockConfirm(false)}
          blocking={actionLoading}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          user={user}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          deleting={actionLoading}
        />
      )}
    </div>
  );
};


/* ─────────────────────── User Card ─────────────────────── */
const UserCard = ({ user, onClick }) => {
  const name = getDisplayName(user);
  const color = getAvatarColor(name);
  const bd = user.basic_details || {};
  const status = user.account_status || "ACTIVE";
  const sc = statusColors[status] || statusColors.ACTIVE;
  const profilePic = user.public_details?.public_pic || bd.profile_pic;

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group ${status === "BLOCKED" ? "border-red-200 hover:border-red-400 opacity-80" :
        status === "DELETED" ? "border-gray-300 hover:border-gray-400 opacity-60 grayscale" :
          "border-gray-200 hover:border-blue-200"
        }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-base shrink-0 overflow-hidden`}
        >
          {profilePic ? (
            <img src={profilePic} alt={name} className="w-full h-full object-cover rounded-full" />
          ) : (
            getInitials(name)
          )}
          {status === "BLOCKED" && (
            <div className="absolute inset-0 bg-red-800/70 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          {status === "DELETED" && (
            <div className="absolute inset-0 bg-gray-800/70 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">{name}</p>
            {status === "BLOCKED" && (
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full shrink-0">
                BLOCKED
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate mt-0.5">{bd.occupation || "—"}</p>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        {bd.phone_number && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{bd.phone_number}</span>
            {bd.phone_number_verified && <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />}
          </div>
        )}
        {bd.email && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{bd.email}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
          {status.replace("_", " ")}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Car className="w-3.5 h-3.5" />
            {user.garage?.vehicles?.length || 0}
          </span>
          <span>·</span>
          <span>{formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── Main Component ─────────────────────── */
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("ACTIVE");

  // Debounce search input (500ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 20, status: activeTab });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await httpClient.get(`/api/user/all-users?${params}`);
      setUsers(res.data.users || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, activeTab]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <main className="w-full min-h-screen bg-gray-50 md:p-6 p-4">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate { animation: fadeSlideUp 0.35s ease-out forwards; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-sm text-gray-500">
            View and manage all registered users · Total:{" "}
            <span className="font-semibold text-gray-700">{pagination.total}</span>
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, phone, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
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

      {/* ── Tabs ── */}
      <div className="flex border-b border-gray-200 mb-6">
        {["ACTIVE", "BLOCKED", "DELETED"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()} Users
          </button>
        ))}
      </div>

      {/* ── States ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading users…</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-base font-semibold text-gray-700">Something went wrong</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Users className="w-12 h-12 text-gray-300" />
          <p className="text-base font-semibold text-gray-500">No users found</p>
          {debouncedSearch && (
            <p className="text-sm text-gray-400">No results for "{debouncedSearch}"</p>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && !error && users.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((user, i) => (
              <div
                key={user._id}
                className="card-animate"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.5)}s`, opacity: 0 }}
              >
                <UserCard user={user} onClick={() => setSelectedUser(user)} />
              </div>
            ))}
          </div>

          {/* ── Pagination ── */}
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
                  if (pagination.totalPages <= 5) {
                    p = i + 1;
                  } else if (page <= 3) {
                    p = i + 1;
                  } else if (page >= pagination.totalPages - 2) {
                    p = pagination.totalPages - 4 + i;
                  } else {
                    p = page - 2 + i;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-sm rounded-lg border transition font-medium ${p === page
                        ? "bg-blue-600 text-white border-blue-600"
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

      {/* ── Detail Modal ── */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} onRefresh={fetchUsers} />
      )}
    </main>
  );
};

export default UserManagement;
