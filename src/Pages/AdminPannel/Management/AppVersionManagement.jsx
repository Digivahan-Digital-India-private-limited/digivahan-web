import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Smartphone, ArrowLeft, Loader2, Save, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// API Helpers
const getAppInfo = async (platform) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.get(`${BASE_URL}/api/v1/app-info/${platform}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const updateAppInfo = async (platform, data) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.post(`${BASE_URL}/api/v1/app-info/${platform}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const AppVersionManagement = () => {
  const navigate = useNavigate();
  
  // State for Android
  const [androidData, setAndroidData] = useState({ version: "", notes: "" });
  const [androidLoading, setAndroidLoading] = useState(false);
  const [androidSubmitting, setAndroidSubmitting] = useState(false);
  const [androidMessage, setAndroidMessage] = useState(null);

  // State for iOS
  const [iosData, setIosData] = useState({ version: "", notes: "" });
  const [iosLoading, setIosLoading] = useState(false);
  const [iosSubmitting, setIosSubmitting] = useState(false);
  const [iosMessage, setIosMessage] = useState(null);

  const fetchAndroidInfo = useCallback(async () => {
    setAndroidLoading(true);
    try {
      const res = await getAppInfo("android");
      if (res.success && res.data) {
        setAndroidData({ version: res.data.version || "", notes: res.data.notes || "" });
      }
    } catch (err) {
      console.error("Failed to load Android info:", err);
    } finally {
      setAndroidLoading(false);
    }
  }, []);

  const fetchIosInfo = useCallback(async () => {
    setIosLoading(true);
    try {
      const res = await getAppInfo("ios");
      if (res.success && res.data) {
        setIosData({ version: res.data.version || "", notes: res.data.notes || "" });
      }
    } catch (err) {
      console.error("Failed to load iOS info:", err);
    } finally {
      setIosLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndroidInfo();
    fetchIosInfo();
  }, [fetchAndroidInfo, fetchIosInfo]);

  const handleUpdateAndroid = async (e) => {
    e.preventDefault();
    setAndroidSubmitting(true);
    setAndroidMessage(null);
    try {
      const res = await updateAppInfo("android", androidData);
      if (res.success) {
        setAndroidMessage({ type: "success", text: "Android version updated successfully!" });
        fetchAndroidInfo();
      } else {
        setAndroidMessage({ type: "error", text: res.message || "Failed to update." });
      }
    } catch (err) {
      setAndroidMessage({ type: "error", text: err.response?.data?.message || "Error updating Android version." });
    } finally {
      setAndroidSubmitting(false);
    }
  };

  const handleUpdateIos = async (e) => {
    e.preventDefault();
    setIosSubmitting(true);
    setIosMessage(null);
    try {
      const res = await updateAppInfo("ios", iosData);
      if (res.success) {
        setIosMessage({ type: "success", text: "iOS version updated successfully!" });
        fetchIosInfo();
      } else {
        setIosMessage({ type: "error", text: res.message || "Failed to update." });
      }
    } catch (err) {
      setIosMessage({ type: "error", text: err.response?.data?.message || "Error updating iOS version." });
    } finally {
      setIosSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/management")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">App Version Management</h1>
          <p className="text-sm text-slate-500">Update Android and iOS app versions and release notes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Android Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-emerald-50/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 shadow-sm">
                <Smartphone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Android App</h2>
                <p className="text-xs text-slate-500">Manage Play Store release details</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchAndroidInfo}
              disabled={androidLoading}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw className={`h-5 w-5 ${androidLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <form onSubmit={handleUpdateAndroid} className="p-6">
            {androidMessage && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-semibold border ${androidMessage.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                {androidMessage.text}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Version Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1.1.9"
                  value={androidData.version}
                  onChange={(e) => setAndroidData({ ...androidData, version: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Release Notes</label>
                <textarea
                  required
                  rows="4"
                  placeholder="e.g. Bug fix & performance update"
                  value={androidData.notes}
                  onChange={(e) => setAndroidData({ ...androidData, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition resize-none"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={androidSubmitting || androidLoading}
                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition shadow-sm"
              >
                {androidSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Update Android Version
              </button>
            </div>
          </form>
        </div>

        {/* iOS Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shadow-sm">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">iOS App</h2>
                <p className="text-xs text-slate-500">Manage App Store release details</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchIosInfo}
              disabled={iosLoading}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw className={`h-5 w-5 ${iosLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <form onSubmit={handleUpdateIos} className="p-6">
            {iosMessage && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-semibold border ${iosMessage.type === "success" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                {iosMessage.text}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Version Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1.0.4"
                  value={iosData.version}
                  onChange={(e) => setIosData({ ...iosData, version: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Release Notes</label>
                <textarea
                  required
                  rows="4"
                  placeholder="e.g. UI improved, crash fix"
                  value={iosData.notes}
                  onChange={(e) => setIosData({ ...iosData, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={iosSubmitting || iosLoading}
                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition shadow-sm"
              >
                {iosSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Update iOS Version
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AppVersionManagement;
