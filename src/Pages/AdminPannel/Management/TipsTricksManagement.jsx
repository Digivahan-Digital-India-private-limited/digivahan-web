import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  Eye,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getTipsAPI = async () => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.get(`${BASE_URL}/api/v1/tips-tricks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getSingleTipAPI = async (id) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.get(`${BASE_URL}/api/v1/tips-tricks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const addTipAPI = async (formData) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.post(`${BASE_URL}/api/v1/tips-tricks`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    },
  });
  return res.data;
};

const updateTipAPI = async (id, formData) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.patch(`${BASE_URL}/api/v1/tips-tricks/${id}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    },
  });
  return res.data;
};

const deleteTipAPI = async (id) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.delete(`${BASE_URL}/api/v1/tips-tricks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/* ─── Sub-Components ───────────────────────────────────────────────────────── */
const DeleteModal = ({ tip, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <h3 className="text-lg font-bold text-slate-900">Delete Tip?</h3>
      <p className="mt-2 text-sm text-slate-600">
        Are you sure you want to delete <span className="font-semibold text-slate-800">{tip.title}</span>?
      </p>
      <p className="mt-1 text-xs text-rose-500 font-medium">This action cannot be undone.</p>
      <div className="mt-5 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm(tip._id)}
          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const ViewModal = ({ tip, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm overflow-y-auto py-10">
    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden relative mt-10 mb-10">
      <div className="w-full h-48 md:h-64 relative bg-slate-200">
        <img src={tip.banner} alt={tip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 md:p-8 -mt-8 relative z-10 bg-white rounded-t-3xl shadow-t-xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{tip.title}</h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 whitespace-pre-wrap">{tip.summary}</p>
        
        {tip.points && tip.points.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Key Points</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tip.points.map((point, index) => (
                <div key={index} className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center overflow-hidden">
                    <img src={point.icon} alt="icon" className="w-6 h-6 object-contain" />
                  </div>
                  <p className="text-slate-700 text-sm self-center leading-tight">{point.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════════════════ */
const TipsTricksManagement = () => {
  const navigate = useNavigate();

  // Data state
  const [tipsData, setTipsData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingTip, setEditingTip] = useState(null); // null = Add mode, object = Edit mode
  
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [points, setPoints] = useState([{ message: "", iconFile: null }]);
  
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // View modal state
  const [viewTarget, setViewTarget] = useState(null);
  const [viewLoadingId, setViewLoadingId] = useState(null);

  const handleViewTip = async (id) => {
    setViewLoadingId(id);
    try {
      const res = await getSingleTipAPI(id);
      if (res.success) {
        setViewTarget(res.data);
      } else {
        alert(res.message || "Failed to load tip details");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load tip details");
    } finally {
      setViewLoadingId(null);
    }
  };

  /* ─── Load Data ──────────────────────────────────────────────────────────── */
  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await getTipsAPI();
      if (res.success) {
        setTipsData(res.data || []);
      }
    } catch (err) {
      console.error("Load data error:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ─── Form Handlers ──────────────────────────────────────────────────────── */
  const handleAddPoint = () => {
    setPoints([...points, { message: "", iconFile: null }]);
  };

  const handleRemovePoint = (index) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  const handlePointChange = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index][field] = value;
    setPoints(newPoints);
  };

  const openAddForm = () => {
    setEditingTip(null);
    setTitle("");
    setSummary("");
    setBannerFile(null);
    setPoints([{ message: "", iconFile: null }]);
    setFormOpen(true);
    setSubmitMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (tip) => {
    setEditingTip(tip);
    setTitle(tip.title || "");
    setSummary(tip.summary || "");
    setBannerFile(null); // File inputs must be re-selected
    
    // Map existing points to prefill text, but files must be re-selected if they want to update points
    if (tip.points && tip.points.length > 0) {
      setPoints(tip.points.map(p => ({ message: p.message, iconFile: null })));
    } else {
      setPoints([{ message: "", iconFile: null }]);
    }
    
    setFormOpen(true);
    setSubmitMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary) {
      setSubmitMsg({ type: "error", text: "Title and Summary are required." });
      return;
    }

    if (!editingTip && !bannerFile) {
      setSubmitMsg({ type: "error", text: "Banner image is required for new tips." });
      return;
    }

    // Validation for points (if adding new, or if updating AND any point has a file)
    // The backend logic says: if req.files.icons is present, its length must match messages length.
    const hasAnyIconFile = points.some(p => p.iconFile !== null);
    if (!editingTip || hasAnyIconFile) {
      const missingFiles = points.some(p => p.iconFile === null);
      if (missingFiles) {
        setSubmitMsg({ type: "error", text: "If you are updating points, you must select an icon file for EVERY point." });
        return;
      }
      const missingMessages = points.some(p => !p.message.trim());
      if (missingMessages) {
        setSubmitMsg({ type: "error", text: "All points must have a message." });
        return;
      }
    }

    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("summary", summary);
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      // Add points
      if (!editingTip || hasAnyIconFile) {
        const messagesArr = points.map(p => p.message);
        formData.append("messages", JSON.stringify(messagesArr));
        points.forEach(p => {
          if (p.iconFile) {
            formData.append("icons", p.iconFile);
          }
        });
      }

      let res;
      if (editingTip) {
        res = await updateTipAPI(editingTip._id, formData);
      } else {
        res = await addTipAPI(formData);
      }

      if (res.success) {
        setSubmitMsg({ type: "success", text: `Tip ${editingTip ? 'updated' : 'added'} successfully!` });
        setFormOpen(false);
        loadData();
      } else {
        setSubmitMsg({ type: "error", text: res.message || "Failed to save." });
      }
    } catch (err) {
      setSubmitMsg({
        type: "error",
        text: err.response?.data?.message || err.message || "Failed to save.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      const res = await deleteTipAPI(id);
      if (res.success) {
        setDeleteTarget(null);
        loadData();
      } else {
        alert(res.message || "Failed to delete");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-slate-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/management")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Tips & Tricks</h1>
            <p className="text-sm text-slate-500">Manage driving tips, tricks, and guides</p>
          </div>
        </div>
        {!formOpen && (
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition"
          >
            <Plus className="h-4 w-4" /> Add New Tip
          </button>
        )}
      </div>

      {/* Submit message */}
      {submitMsg && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            submitMsg.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {submitMsg.text}
        </div>
      )}

      {/* ── Add/Update Form Collapsible ──────────────────────────────────────── */}
      {formOpen && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-8 overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-purple-50/50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                <Lightbulb className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{editingTip ? "Update Tip & Trick" : "Add New Tip & Trick"}</p>
                <p className="text-xs text-slate-500">{editingTip ? "Update details and points" : "Fill details to create a new guide"}</p>
              </div>
            </div>
            <button onClick={() => setFormOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Basic Info */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROAD TRIP READY: PLAN SMART"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Summary</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Detailed summary..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Banner Image {editingTip && <span className="text-xs font-normal text-slate-500">(Leave empty to keep existing)</span>}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBannerFile(e.target.files[0])}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition"
                  />
                </div>
              </div>

              {/* Right Column: Points */}
              <div className="flex flex-col gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800">Points & Icons</label>
                  <button type="button" onClick={handleAddPoint} className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Point
                  </button>
                </div>
                
                {editingTip && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                    <strong>Note:</strong> If you want to update any point's icon or text, you MUST select icon files for ALL points. Otherwise, leave all file inputs empty to keep existing points unchanged.
                  </p>
                )}

                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {points.map((p, index) => (
                    <div key={index} className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative">
                      {points.length > 1 && (
                        <button type="button" onClick={() => handleRemovePoint(index)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      
                      <div className="pr-6">
                        <label className="text-xs font-semibold text-slate-600">Point {index + 1} Message</label>
                        <textarea
                          rows="2"
                          value={p.message}
                          onChange={(e) => handlePointChange(index, "message", e.target.value)}
                          placeholder="Point text..."
                          className="w-full mt-1 border border-slate-200 rounded-md px-2 py-1 text-xs outline-none focus:border-purple-400 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Point {index + 1} Icon</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePointChange(index, "iconFile", e.target.files[0])}
                          className="w-full mt-1 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60 transition inline-flex items-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingTip ? "Update Tip" : "Save Tip"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tips List ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
              <Lightbulb className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                All Tips & Tricks
                <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                  {tipsData.length}
                </span>
              </p>
              <p className="text-xs text-slate-500">Currently active driving tips on the app</p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={loadingData}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          {loadingData ? (
             <div className="flex items-center justify-center p-12">
               <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
             </div>
          ) : tipsData.length === 0 ? (
             <div className="p-12 text-center text-slate-500">
               No tips found. Add one above.
             </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {tipsData.map((tip) => (
                 <div key={tip._id} className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col hover:shadow-md transition">
                    <div className="h-32 w-full overflow-hidden bg-slate-200 relative">
                       <img src={tip.banner} alt={tip.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                       <div className="absolute bottom-2 left-3 right-3">
                         <h4 className="text-white font-bold text-sm truncate">{tip.title}</h4>
                       </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                       <p className="text-xs text-slate-600 line-clamp-3 mb-4 flex-1">{tip.summary}</p>
                       
                       <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                         <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                           {tip.points?.length || 0} Points
                         </span>
                         
                         <div className="flex gap-2">
                           <button onClick={() => handleViewTip(tip._id)} className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition relative" title="View">
                              {viewLoadingId === tip._id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                           </button>
                           <button onClick={() => openEditForm(tip)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition" title="Edit">
                              <Edit2 className="h-3.5 w-3.5" />
                           </button>
                           <button onClick={() => setDeleteTarget(tip)} className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                           </button>
                         </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          tip={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* View modal */}
      {viewTarget && (
        <ViewModal
          tip={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}
    </main>
  );
};

export default TipsTricksManagement;
