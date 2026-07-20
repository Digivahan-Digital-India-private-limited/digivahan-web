import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  Users, Phone, ChevronRight, ChevronDown, ArrowLeft, Loader2,
  LayoutDashboard, ShoppingCart, QrCode, MessageSquare,
  AlertTriangle, FileText, CalendarDays, UserX, Webhook,
  BriefcaseBusiness, BarChart2, Layers, Sliders, Save,
} from "lucide-react";
import MasterSidebar from "./MasterSidebar";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

// All admin panel pages with their permission keys
const ALL_PAGES = [
  {
    key: "dashboard", name: "Dashboard", icon: LayoutDashboard, link: "/admin-panel",
    cards: [
      { key: "card_dashboard_orders", name: "Order Management Card" },
      { key: "card_dashboard_qr", name: "QR Management Card" },
      { key: "card_dashboard_queries", name: "Customer Queries Card" },
      { key: "card_dashboard_tips", name: "Quick Tips Card" },
      { key: "card_dashboard_stats", name: "Stats Summary Bar" },
    ]
  },
  {
    key: "orders", name: "Orders", icon: ShoppingCart, link: "/orders-panel",
    cards: [
      { key: "card_orders_shiprocket", name: "Shiprocket Card" },
      { key: "card_orders_partners", name: "Delivery Partners Card" },
      { key: "card_orders_delhivery", name: "Delhivery Card" },
      { key: "card_orders_manifest", name: "Generate Manifest Card" },
      { key: "card_orders_manage", name: "Manage Order Card" },
      { key: "card_orders_pending", name: "Pending Order Card" },
      { key: "card_orders_confirmed", name: "Confirmed Order Card" },
      { key: "card_orders_cancelled", name: "Cancelled Order Card" },
    ]
  },
  { key: "qr_management", name: "QR Management", icon: QrCode, link: "/qr-panel" },
  { key: "user_management", name: "User Management", icon: Users, link: "/user-management" },
  { key: "analytics", name: "Analytics", icon: BarChart2, link: "/analytics" },
  { key: "customer_queries", name: "Customer Queries", icon: MessageSquare, link: "/customer-queries" },
  { key: "raise_concern", name: "Raise Concern", icon: AlertTriangle, link: "/manage-concerns" },
  { key: "delete_account_requests", name: "Delete Account Requests", icon: UserX, link: "/delete-account-requests" },
  { key: "report_issue", name: "Report Issue", icon: FileText, link: "/report-issues" },
  { key: "manage_appointment", name: "Manage Appointment", icon: CalendarDays, link: "/manage-appointment" },
  { key: "challan_webhook", name: "Challan Webhook", icon: Webhook, link: "/challan-webhook-admin" },
  {
    key: "app_management", name: "App Management", icon: Layers, link: "/management",
    cards: [
      { key: "card_management_trending", name: "Add Trending Car" },
      { key: "card_management_compare", name: "Compare Trending Car" },
      { key: "card_management_fuel", name: "Update Fuel Price" },
      { key: "card_management_tips", name: "Add Tips & Tricks" },
      { key: "card_management_version", name: "Update App Version" },
      { key: "card_management_info", name: "App Info" },
    ]
  },
  {
    key: "hr_manager", name: "HR Manager", icon: BriefcaseBusiness, link: "/hr-manager",
    cards: [
      { key: "card_hr_post", name: "Post Job Tab" },
      { key: "card_hr_manage", name: "Manage Jobs Tab" },
      { key: "card_hr_closed", name: "Closed Positions Tab" },
      { key: "card_hr_applications", name: "Applications Tab" },
    ]
  },
];

const ManageAdminPermissions = () => {
  const [admins, setAdmins]         = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [permissions, setPermissions]     = useState({});
  const [expandedPages, setExpandedPages] = useState({});
  const [loadingPerms, setLoadingPerms]   = useState(false);
  const [saving, setSaving]               = useState(false);

  const token = Cookies.get("master_admin_token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch admin list
  const fetchAdmins = useCallback(async () => {
    try {
      setLoadingAdmins(true);
      const res = await axios.get(`${BASE_URL}/api/auth/admin/master/admins`, authHeaders);
      setAdmins(res.data.admins || []);
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoadingAdmins(false);
    }
  }, [token]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  // Load permissions for selected admin
  const selectAdmin = async (admin) => {
    setSelectedAdmin(admin);
    setLoadingPerms(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/auth/admin/master/permissions/${admin._id}`,
        authHeaders
      );
      // If a key is missing from DB it means allowed (true)
      const raw = res.data.pages || {};
      const full = {};
      ALL_PAGES.forEach(p => { 
        full[p.key] = raw[p.key] !== false; 
        if (p.cards) {
          p.cards.forEach(c => {
            full[c.key] = raw[c.key] !== false;
          });
        }
      });
      setPermissions(full);
    } catch {
      toast.error("Failed to load permissions");
      // Default: all allowed
      const full = {};
      ALL_PAGES.forEach(p => { 
        full[p.key] = true; 
        if (p.cards) {
          p.cards.forEach(c => full[c.key] = true);
        }
      });
      setPermissions(full);
    } finally {
      setLoadingPerms(false);
    }
  };

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = (value) => {
    const full = {};
    ALL_PAGES.forEach(p => { 
      full[p.key] = value; 
      if (p.cards) p.cards.forEach(c => full[c.key] = value);
    });
    setPermissions(full);
  };

  const savePermissions = async () => {
    if (!selectedAdmin) return;
    try {
      setSaving(true);
      await axios.put(
        `${BASE_URL}/api/auth/admin/master/permissions/${selectedAdmin._id}`,
        { pages: permissions },
        authHeaders
      );
      toast.success(`Permissions saved for ${selectedAdmin.first_name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  const allOn  = ALL_PAGES.every(p => permissions[p.key]);
  const allOff = ALL_PAGES.every(p => !permissions[p.key]);

  return (
    <main className="w-full h-screen flex lg:flex-row flex-col overflow-hidden bg-gray-50">
      <MasterSidebar />

      <section className="flex-1 w-full overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            {selectedAdmin ? (
              <button
                onClick={() => { setSelectedAdmin(null); setPermissions({}); }}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-3 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Admin List
              </button>
            ) : null}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              <Sliders className="w-7 h-7 text-blue-600" />
              {selectedAdmin ? `Permissions — ${selectedAdmin.first_name} ${selectedAdmin.last_name}` : "Manage Admin Permissions"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {selectedAdmin
                ? "Toggle ON/OFF which pages this admin can access in the Admin Panel"
                : "Select an admin to configure their page access"}
            </p>
          </div>

          {/* ── ADMIN LIST VIEW ── */}
          {!selectedAdmin && (
            loadingAdmins ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Users className="w-14 h-14 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-gray-500">No admins found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {admins.map(admin => (
                  <button
                    key={admin._id}
                    onClick={() => selectAdmin(admin)}
                    className="w-full bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all text-left group"
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {admin.first_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">{admin.first_name} {admin.last_name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {admin.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
                        {admin.role?.replace("_", " ")}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                    </div>
                  </button>
                ))}
              </div>
            )
          )}

          {/* ── PERMISSIONS VIEW ── */}
          {selectedAdmin && (
            loadingPerms ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Bulk controls */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <button
                    onClick={() => toggleAll(true)}
                    disabled={allOn}
                    className="px-4 py-2 text-sm rounded-xl border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-40 transition font-medium"
                  >
                    ✓ Enable All
                  </button>
                  <button
                    onClick={() => toggleAll(false)}
                    disabled={allOff}
                    className="px-4 py-2 text-sm rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-40 transition font-medium"
                  >
                    ✕ Disable All
                  </button>
                  <span className="ml-auto text-sm text-gray-400">
                    {ALL_PAGES.filter(p => permissions[p.key]).length} / {ALL_PAGES.length} pages enabled
                  </span>
                </div>

                {/* Page toggles grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {ALL_PAGES.map(page => {
                    const Icon = page.icon;
                    const enabled = !!permissions[page.key];
                    return (
                      <div key={page.key} className="flex flex-col gap-2">
                        <div
                          onClick={() => togglePermission(page.key)}
                          className={`
                            flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200
                            ${enabled
                              ? "bg-white border-blue-200 shadow-sm hover:shadow-md"
                              : "bg-gray-50 border-gray-200 opacity-70 hover:opacity-90"
                            }
                          `}
                        >
                          {/* Icon */}
                          <div className={`p-2.5 rounded-xl ${enabled ? "bg-blue-100" : "bg-gray-200"} transition`}>
                            <Icon className={`w-5 h-5 ${enabled ? "text-blue-600" : "text-gray-400"}`} />
                          </div>

                          {/* Name */}
                          <span className={`flex-1 text-sm font-medium ${enabled ? "text-gray-800" : "text-gray-400"}`}>
                            {page.name}
                          </span>

                          {/* Expand/Collapse Chevron (if has cards) */}
                          {page.cards && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedPages(prev => ({ ...prev, [page.key]: !prev[page.key] }));
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer text-gray-500`}
                            >
                              <span className="text-xs font-semibold">{page.cards.length} Cards</span>
                              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedPages[page.key] ? "rotate-180" : ""}`} />
                            </div>
                          )}

                          {/* Toggle Switch */}
                          <div
                            className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${enabled ? "bg-blue-600" : "bg-gray-300"}`}
                          >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
                          </div>
                        </div>

                        {/* Nested Cards (Render only if page is enabled, has cards, and is expanded) */}
                        {enabled && page.cards && expandedPages[page.key] && (
                          <div className="pl-14 pr-2 flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                            {page.cards.map(card => {
                              const cardEnabled = !!permissions[card.key];
                              return (
                                <div
                                  key={card.key}
                                  onClick={() => togglePermission(card.key)}
                                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 cursor-pointer group"
                                >
                                  <span className={`text-xs font-medium ${cardEnabled ? "text-gray-700" : "text-gray-400 line-through"} group-hover:text-blue-600 transition-colors`}>
                                    {card.name}
                                  </span>
                                  <div
                                    className={`relative w-8 h-4 rounded-full transition-colors duration-300 flex-shrink-0 ${cardEnabled ? "bg-green-500" : "bg-gray-200"}`}
                                  >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-300 ${cardEnabled ? "translate-x-4" : "translate-x-0"}`} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                  <button
                    onClick={savePermissions}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md shadow-blue-100 disabled:opacity-50"
                  >
                    {saving
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                      : <><Save className="w-4 h-4" /> Save Permissions</>
                    }
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default ManageAdminPermissions;
