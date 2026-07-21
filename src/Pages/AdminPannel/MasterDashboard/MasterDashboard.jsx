import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Users, Phone, Mail, Loader2, X, Shield, AlertTriangle, Settings } from "lucide-react";
import MasterSidebar from "./MasterSidebar";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const MasterDashboard = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const token = Cookies.get("master_admin_token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/auth/admin/master/admins`, authHeaders);
      setAdmins(res.data.admins || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error("Name, phone, and email are required");
      return;
    }
    if (form.phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    try {
      setSubmitting(true);
      await axios.post(`${BASE_URL}/api/auth/admin/master/admins`, form, authHeaders);
      toast.success("✅ Admin added! No pages are visible to them yet — go to Manage Permissions to grant access.", { autoClose: 6000 });
      setForm({ first_name: "", last_name: "", phone: "", email: "" });
      setShowModal(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add admin");
    } finally {
      setSubmitting(false);
    }
  };

  // Opens the custom confirm modal instead of window.confirm
  const handleDelete = (id, name) => {
    setDeleteTarget({ id, name });
  };

  // Called when user confirms inside the modal
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(deleteTarget.id);
      await axios.delete(`${BASE_URL}/api/auth/admin/master/admins/${deleteTarget.id}`, authHeaders);
      toast.success("Admin deleted successfully");
      setAdmins((prev) => prev.filter((a) => a._id !== deleteTarget.id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete admin");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setForm({ first_name: "", last_name: "", phone: "", email: "" });
  };

  return (
    <main className="w-full h-screen flex lg:flex-row flex-col overflow-hidden bg-gray-50">
      <MasterSidebar />

      <section className="flex-1 w-full overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
                <Shield className="w-7 h-7 text-blue-600" />
                Admin Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">View, add, and remove admin accounts</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md shadow-blue-100 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add New Admin
            </button>
          </div>

          {/* Admin List */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Users className="w-14 h-14 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium text-gray-500">No admins found</p>
              <p className="text-sm mt-1">Click "Add New Admin" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                    {admin.first_name?.charAt(0)?.toUpperCase() || "A"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-base">
                      {admin.first_name} {admin.last_name}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> {admin.phone}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{admin.email}</span>
                      </span>
                    </div>
                  </div>

                  {/* Role badge + Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      admin.role === "super_admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {admin.role?.replace("_", " ") || "admin"}
                    </span>
                    {/* ✅ Set Permissions shortcut button */}
                    <button
                      onClick={() => navigate("/page/admin/master/permissions")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                      title="Manage permissions for this admin"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Permissions
                    </button>
                    <button
                      onClick={() => handleDelete(admin._id, `${admin.first_name} ${admin.last_name}`)}
                      disabled={deleting === admin._id}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-40"
                      title="Delete admin"
                    >
                      {deleting === admin._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            style={{ animation: "scaleUp 0.2s ease both" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">Add New Admin</h2>
              <button
                onClick={resetModal}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">First Name *</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Phone Number *</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition">
                  <span className="px-3 py-2.5 bg-gray-50 text-gray-600 font-semibold text-sm border-r border-gray-200 select-none">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    required
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                  />
                  {form.phone.length === 10 && (
                    <span className="pr-3 text-green-500 text-base">✓</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            style={{ animation: "scaleUp 0.2s ease both" }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
              Delete Admin?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">"{deleteTarget.name}"</span>?
              <br />This action <span className="text-red-500 font-medium">cannot be undone</span>.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting === deleteTarget.id}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting === deleteTarget.id}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting === deleteTarget.id
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                  : <><Trash2 className="w-4 h-4" /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MasterDashboard;
