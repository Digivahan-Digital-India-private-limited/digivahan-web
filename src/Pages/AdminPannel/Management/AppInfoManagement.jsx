import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Loader2,
  Save,
  RefreshCw,
  Smartphone,
  Shield,
  FileText,
  Info,
  CreditCard,
  Zap,
  Bell,
  Receipt,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── API helpers ───────────────────────────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || "";
  return { Authorization: `Bearer ${token}` };
};

const fetchAppInfo = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/app-info`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

const postAPI = async (endpoint, body) => {
  const res = await axios.post(`${BASE_URL}${endpoint}`, body, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ─── Reusable Field Components ─────────────────────────────────────────────
const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white"
    />
  </div>
);

// ─── Section Card ──────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, subtitle, accentColor, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <div className={`flex items-center gap-3 px-5 py-4 border-b border-slate-100 ${accentColor.bg}`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentColor.icon}`}>
        <Icon className={`h-5 w-5 ${accentColor.text}`} />
      </div>
      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── Save Button ───────────────────────────────────────────────────────────
const COLOR_MAP = {
  emerald: "bg-emerald-600 hover:bg-emerald-700",
  blue:    "bg-blue-600 hover:bg-blue-700",
  violet:  "bg-violet-600 hover:bg-violet-700",
  amber:   "bg-amber-500 hover:bg-amber-600",
  cyan:    "bg-cyan-600 hover:bg-cyan-700",
  rose:    "bg-rose-600 hover:bg-rose-700",
  pink:    "bg-pink-600 hover:bg-pink-700",
  orange:  "bg-orange-600 hover:bg-orange-700",
  teal:    "bg-teal-600 hover:bg-teal-700",
  indigo:  "bg-indigo-600 hover:bg-indigo-700",
};

const SaveButton = ({ onClick, loading, color = "indigo" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`mt-4 w-full inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition shadow-sm ${COLOR_MAP[color] || COLOR_MAP.indigo}`}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
    Save Changes
  </button>
);

// ─── Toast notification ─────────────────────────────────────────────────────
const Toast = ({ msg, onClose }) => {
  if (!msg) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-2xl text-sm font-semibold border transition-all ${
        msg.type === "success"
          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
          : "bg-rose-50 text-rose-800 border-rose-200"
      }`}
    >
      {msg.type === "success" ? (
        <CheckCircle className="h-5 w-5 text-emerald-600" />
      ) : (
        <XCircle className="h-5 w-5 text-rose-600" />
      )}
      {msg.text}
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600">✕</button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
//  Main Page
// ═══════════════════════════════════════════════════════════════════════════
const AppInfoManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Individual section saving states
  const [saving, setSaving] = useState({});

  // State for each section (prefilled from GET /api/v1/app-info)
  const [android, setAndroid] = useState({ version: "", notes: "" });
  const [ios, setIos] = useState({ version: "", notes: "" });
  const [privacyPolicy, setPrivacyPolicy] = useState({ policy_page_url: "" });
  const [termsCondition, setTermsCondition] = useState({ terms_condition_page_url: "" });
  const [aboutPage, setAboutPage] = useState({ about_page_url: "" });
  const [razorpayKey, setRazorpayKey] = useState({ razorpay_key_id: "" });
  const [razorpayLive, setRazorpayLive] = useState({ razorpay_live_key_id: "" });
  const [zigoApp, setZigoApp] = useState({ zigoApp_id: "", zigoAppSign_Key: "" });
  const [challanPay, setChallanPay] = useState({ challanPay: "" });
  const [oneSignal, setOneSignal] = useState({ oneSignalID: "" });

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // ─── Load all app info ──────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAppInfo();
      if (res.success && res.data) {
        const d = res.data;
        setAndroid({
          version: d.app_version?.android?.version || "",
          notes: d.app_version?.android?.notes || "",
        });
        setIos({
          version: d.app_version?.ios?.version || "",
          notes: d.app_version?.ios?.notes || "",
        });
        setPrivacyPolicy({
          policy_page_url: d.policy?.privacy_policy?.policy_page_url || "",
        });
        setTermsCondition({
          terms_condition_page_url: d.policy?.terms_condition?.terms_condition_page_url || "",
        });
        setAboutPage({
          about_page_url: d.policy?.About_page?.about_page_url || "",
        });
        setRazorpayKey({ razorpay_key_id: d.api_key?.razorpay_key_id || "" });
        setRazorpayLive({ razorpay_live_key_id: d.api_key?.razorpay_live_key_id || "" });
        setZigoApp({
          zigoApp_id: d.zigoApp_data?.zigoAppID || "",
          zigoAppSign_Key: d.zigoApp_data?.zigoAppSignKey || "",
        });
        setChallanPay({ challanPay: d.challanPay || "" });
        setOneSignal({ oneSignalID: d.oneSignalID || "" });
      }
    } catch (err) {
      showToast("error", "Failed to load App Info data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Generic save handler ──────────────────────────────────────────────
  const handleSave = async (key, endpoint, body) => {
    setSaving((s) => ({ ...s, [key]: true }));
    try {
      const res = await postAPI(endpoint, body);
      if (res.success) {
        showToast("success", `${key} updated successfully!`);
      } else {
        showToast("error", res.message || `Failed to update ${key}`);
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || `Error updating ${key}`);
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
          <p className="text-slate-500 text-sm">Loading App Info...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/management")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">App Info Management</h1>
            <p className="text-sm text-slate-500">Manage all app configuration — versions, policies, keys & more</p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* ── Android Version ─────────────────────────────────────────── */}
        <SectionCard
          icon={Smartphone}
          title="Android Version"
          subtitle="Play Store release info"
          accentColor={{ bg: "bg-emerald-50/60", icon: "bg-emerald-100", text: "text-emerald-600" }}
        >
          <div className="space-y-3">
            <InputField label="Version" value={android.version} onChange={(e) => setAndroid((p) => ({ ...p, version: e.target.value }))} placeholder="e.g. 1.1.9" />
            <InputField label="Release Notes" value={android.notes} onChange={(e) => setAndroid((p) => ({ ...p, notes: e.target.value }))} placeholder="e.g. Bug fix & performance update" />
          </div>
          <SaveButton
            onClick={() => handleSave("Android Version", "/api/v1/app-info/android", android)}
            loading={saving["Android Version"]}
            color="emerald"
          />
        </SectionCard>

        {/* ── iOS Version ──────────────────────────────────────────────── */}
        <SectionCard
          icon={Smartphone}
          title="iOS Version"
          subtitle="App Store release info"
          accentColor={{ bg: "bg-blue-50/60", icon: "bg-blue-100", text: "text-blue-600" }}
        >
          <div className="space-y-3">
            <InputField label="Version" value={ios.version} onChange={(e) => setIos((p) => ({ ...p, version: e.target.value }))} placeholder="e.g. 1.0.4" />
            <InputField label="Release Notes" value={ios.notes} onChange={(e) => setIos((p) => ({ ...p, notes: e.target.value }))} placeholder="e.g. Initial version" />
          </div>
          <SaveButton
            onClick={() => handleSave("iOS Version", "/api/v1/app-info/ios", ios)}
            loading={saving["iOS Version"]}
            color="blue"
          />
        </SectionCard>

        {/* ── Privacy Policy ───────────────────────────────────────────── */}
        <SectionCard
          icon={Shield}
          title="Privacy Policy"
          subtitle="Policy page URL"
          accentColor={{ bg: "bg-violet-50/60", icon: "bg-violet-100", text: "text-violet-600" }}
        >
          <InputField
            label="Policy Page URL"
            value={privacyPolicy.policy_page_url}
            onChange={(e) => setPrivacyPolicy({ policy_page_url: e.target.value })}
            placeholder="https://..."
            type="url"
          />
          <SaveButton
            onClick={() => handleSave("Privacy Policy", "/api/v1/app-info/privacy-policy", privacyPolicy)}
            loading={saving["Privacy Policy"]}
            color="violet"
          />
        </SectionCard>

        {/* ── Terms & Conditions ───────────────────────────────────────── */}
        <SectionCard
          icon={FileText}
          title="Terms & Conditions"
          subtitle="T&C page URL"
          accentColor={{ bg: "bg-amber-50/60", icon: "bg-amber-100", text: "text-amber-600" }}
        >
          <InputField
            label="Terms Page URL"
            value={termsCondition.terms_condition_page_url}
            onChange={(e) => setTermsCondition({ terms_condition_page_url: e.target.value })}
            placeholder="https://..."
            type="url"
          />
          <SaveButton
            onClick={() => handleSave("Terms & Conditions", "/api/v1/app-info/terms-condition", termsCondition)}
            loading={saving["Terms & Conditions"]}
            color="amber"
          />
        </SectionCard>

        {/* ── About Page ───────────────────────────────────────────────── */}
        <SectionCard
          icon={Info}
          title="About Page"
          subtitle="About us page URL"
          accentColor={{ bg: "bg-cyan-50/60", icon: "bg-cyan-100", text: "text-cyan-600" }}
        >
          <InputField
            label="About Page URL"
            value={aboutPage.about_page_url}
            onChange={(e) => setAboutPage({ about_page_url: e.target.value })}
            placeholder="https://..."
            type="url"
          />
          <SaveButton
            onClick={() => handleSave("About Page", "/api/v1/app-info/about-page", aboutPage)}
            loading={saving["About Page"]}
            color="cyan"
          />
        </SectionCard>

        {/* ── Razorpay Test Key ────────────────────────────────────────── */}
        <SectionCard
          icon={CreditCard}
          title="Razorpay Key"
          subtitle="Payment gateway key (key_id)"
          accentColor={{ bg: "bg-rose-50/60", icon: "bg-rose-100", text: "text-rose-600" }}
        >
          <InputField
            label="Razorpay Key ID"
            value={razorpayKey.razorpay_key_id}
            onChange={(e) => setRazorpayKey({ razorpay_key_id: e.target.value })}
            placeholder="rzp_test_..."
          />
          <SaveButton
            onClick={() => handleSave("Razorpay Key", "/api/v1/app-info/razorpay-key", razorpayKey)}
            loading={saving["Razorpay Key"]}
            color="rose"
          />
        </SectionCard>

        {/* ── Razorpay Live Key ────────────────────────────────────────── */}
        <SectionCard
          icon={CreditCard}
          title="Razorpay Live Key"
          subtitle="Live payment gateway key"
          accentColor={{ bg: "bg-pink-50/60", icon: "bg-pink-100", text: "text-pink-600" }}
        >
          <InputField
            label="Razorpay Live Key ID"
            value={razorpayLive.razorpay_live_key_id}
            onChange={(e) => setRazorpayLive({ razorpay_live_key_id: e.target.value })}
            placeholder="rzp_live_..."
          />
          <SaveButton
            onClick={() => handleSave("Razorpay Live Key", "/api/v1/app-info/razorpay-live-key", razorpayLive)}
            loading={saving["Razorpay Live Key"]}
            color="pink"
          />
        </SectionCard>

        {/* ── Zigo App Data ─────────────────────────────────────────────── */}
        <SectionCard
          icon={Zap}
          title="Zigo App Data"
          subtitle="Zigo App ID & Sign Key"
          accentColor={{ bg: "bg-orange-50/60", icon: "bg-orange-100", text: "text-orange-600" }}
        >
          <div className="space-y-3">
            <InputField
              label="Zigo App ID"
              value={zigoApp.zigoApp_id}
              onChange={(e) => setZigoApp((p) => ({ ...p, zigoApp_id: e.target.value }))}
              placeholder="Zigo App ID"
            />
            <InputField
              label="Zigo App Sign Key"
              value={zigoApp.zigoAppSign_Key}
              onChange={(e) => setZigoApp((p) => ({ ...p, zigoAppSign_Key: e.target.value }))}
              placeholder="Zigo App Sign Key"
            />
          </div>
          <SaveButton
            onClick={() => handleSave("Zigo App", "/api/v1/app-info/zigo-app", zigoApp)}
            loading={saving["Zigo App"]}
            color="orange"
          />
        </SectionCard>

        {/* ── Challan Pay ───────────────────────────────────────────────── */}
        <SectionCard
          icon={Receipt}
          title="Challan Pay URL"
          subtitle="Challan payment redirect URL"
          accentColor={{ bg: "bg-teal-50/60", icon: "bg-teal-100", text: "text-teal-600" }}
        >
          <InputField
            label="Challan Pay URL"
            value={challanPay.challanPay}
            onChange={(e) => setChallanPay({ challanPay: e.target.value })}
            placeholder="https://..."
            type="url"
          />
          <SaveButton
            onClick={() => handleSave("Challan Pay", "/api/v1/app-info/challan", challanPay)}
            loading={saving["Challan Pay"]}
            color="teal"
          />
        </SectionCard>

        {/* ── OneSignal ID ──────────────────────────────────────────────── */}
        <SectionCard
          icon={Bell}
          title="OneSignal ID"
          subtitle="Push notification App ID"
          accentColor={{ bg: "bg-indigo-50/60", icon: "bg-indigo-100", text: "text-indigo-600" }}
        >
          <InputField
            label="OneSignal App ID"
            value={oneSignal.oneSignalID}
            onChange={(e) => setOneSignal({ oneSignalID: e.target.value })}
            placeholder="OneSignal App ID"
          />
          <SaveButton
            onClick={() => handleSave("OneSignal ID", "/api/v1/app-info/onesignal", oneSignal)}
            loading={saving["OneSignal ID"]}
            color="indigo"
          />
        </SectionCard>

      </div>

      {/* Toast */}
      <Toast msg={toast} onClose={() => setToast(null)} />
    </main>
  );
};

export default AppInfoManagement;
