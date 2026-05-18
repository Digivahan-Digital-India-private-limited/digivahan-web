import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { 
  Download, 
  Eye, 
  FileText, 
  Upload, 
  Trash2, 
  Car, 
  FileCheck, 
  Calendar, 
  Hash, 
  Loader2,
  X,
  Plus,
  AlertCircle
} from "lucide-react";
import { listVehicles } from "../../vehicles/services/vehiclesApi";
import { uploadDocument, deleteDocument } from "../services/vaultApi";

// Predefined slots for documents as per the backend User Schema enum
const DOCUMENT_TYPES = [
  { value: "rc", label: "Registration Certificate (RC)", iconColor: "text-blue-600 bg-blue-50 border-blue-100" },
  { value: "insurance", label: "Insurance Policy", iconColor: "text-purple-600 bg-purple-50 border-purple-100" },
  { value: "pollution", label: "Pollution (PUC) Certificate", iconColor: "text-amber-600 bg-amber-50 border-amber-100" },
  { value: "aadhar", label: "Aadhar Card", iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { value: "driving licence", label: "Driving Licence", iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  { value: "pancard", label: "PAN Card", iconColor: "text-rose-600 bg-rose-50 border-rose-100" },
  { value: "other", label: "Other Documents", iconColor: "text-slate-600 bg-slate-50 border-slate-100" }
];

const DocumentVaultPage = () => {
  const queryClient = useQueryClient();
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    docType: "rc",
    docName: "",
    docNumber: "",
    file: null
  });

  // Decode user_id from Cookies
  const token = Cookies.get("user_token");
  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.user_id;
    } catch (e) {
      console.error("Token decode error", e);
    }
  }

  // 1. Fetch vehicles (using react-query listVehicles)
  const { data: vehicles = [], isLoading: isVehiclesLoading } = useQuery({
    queryKey: ["user-vehicles"],
    queryFn: listVehicles,
    onSuccess: (data) => {
      if (data.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(data[0].id);
      }
    }
  });

  // Auto-set the first vehicle if selectedVehicleId is empty
  React.useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const activeDocuments = activeVehicle?.vehicle_doc?.documents || [];

  // 2. Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      toast.success(data?.message || "Document uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
      setIsUploadModalOpen(false);
      setUploadForm({
        docType: "rc",
        docName: "",
        docNumber: "",
        file: null
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Document upload failed");
    }
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: (data) => {
      toast.success(data?.message || "Document deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Document deletion failed");
    }
  });

  const handleUploadClick = (docType) => {
    setUploadForm((prev) => ({ ...prev, docType }));
    setIsUploadModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User session expired. Please log in again.");
      return;
    }
    if (!selectedVehicleId) {
      toast.error("Please select a vehicle first.");
      return;
    }
    if (!uploadForm.file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const fd = new FormData();
    fd.append("user_id", userId);
    fd.append("vehicle_id", selectedVehicleId);
    fd.append("doc_name", uploadForm.docName || uploadForm.docType.toUpperCase());
    fd.append("doc_type", uploadForm.docType);
    fd.append("doc_number", uploadForm.docNumber || "N/A");
    fd.append("doc_file", uploadForm.file);

    uploadMutation.mutate(fd);
  };

  const handleDelete = (docType) => {
    if (!userId || !selectedVehicleId) return;
    const confirmed = window.confirm(`Are you sure you want to delete the ${docType.toUpperCase()} document?`);
    if (!confirmed) return;

    deleteMutation.mutate({
      user_id: userId,
      vehicle_id: selectedVehicleId,
      doc_type: docType
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Document Vault</h2>
            <p className="text-sm text-slate-500">Store and securely access important vehicle, identity, and compliance documents.</p>
          </div>
          {vehicles.length > 0 && (
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              <Plus size={16} />
              Upload Document
            </button>
          )}
        </div>
      </section>

      {/* Main vault flow */}
      {isVehiclesLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm flex flex-col items-center justify-center gap-2">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
          Loading your vault...
        </div>
      ) : vehicles.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm max-w-lg mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-4">
            <Car size={24} />
          </div>
          <h3 className="text-md font-semibold text-slate-900 mb-1">No Vehicles Found</h3>
          <p className="text-sm text-slate-500 mb-4">
            You must add a vehicle to your garage before storing and managing documents in the vault.
          </p>
        </section>
      ) : (
        <div className="space-y-6">
          {/* Vehicle selector */}
          <section className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Vehicle</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
              {vehicles.map((vehicle) => {
                const isSelected = vehicle.id === selectedVehicleId;
                return (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition shrink-0 shadow-sm ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`p-2 rounded-xl border ${isSelected ? "bg-emerald-600 text-white border-emerald-700" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                      <Car size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{vehicle.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{vehicle.plate}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Document list cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCUMENT_TYPES.map((type) => {
              const uploadedDoc = activeDocuments.find((d) => d.doc_type === type.value);

              return (
                <article
                  key={type.value}
                  className={`rounded-2xl border bg-white p-5 shadow-sm flex flex-col justify-between gap-4 transition-all duration-200 hover:shadow-md ${
                    uploadedDoc ? "border-slate-200" : "border-dashed border-slate-300 bg-slate-50/30"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Badge + type details */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${type.iconColor}`}>
                        <FileText size={20} />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{type.label}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          uploadedDoc 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                            : "bg-slate-100 border-slate-200 text-slate-500"
                        }`}>
                          {uploadedDoc ? "Uploaded" : "Pending"}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    {uploadedDoc ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Hash size={13} className="text-slate-400" />
                          <span className="font-mono bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">
                            {uploadedDoc.doc_number || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar size={13} className="text-slate-400" />
                          <span>
                            Uploaded on: {uploadedDoc.uploaded_at ? new Date(uploadedDoc.uploaded_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            }) : "N/A"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No document uploaded yet for this slot.</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {uploadedDoc ? (
                      <>
                        <a
                          href={uploadedDoc.doc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Eye size={13} />
                          View
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(type.value)}
                          disabled={deleteMutation.isPending}
                          className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition p-2"
                        >
                          {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUploadClick(type.value)}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 px-3 py-2 text-xs font-semibold transition"
                      >
                        <Upload size={13} />
                        Upload Now
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      )}

      {/* Gorgeous Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-scaleUp">
            
            {/* Modal header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Vehicle Document</h3>
                <p className="text-xs text-slate-500">Add secure PDFs or images to your vault slot.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Document Type</label>
                <select
                  name="docType"
                  value={uploadForm.docType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 bg-white"
                  required
                >
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Document Name (Optional)</label>
                <input
                  name="docName"
                  value={uploadForm.docName}
                  onChange={handleInputChange}
                  placeholder="e.g. My RC Card, Policy 2026"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Document Number</label>
                <input
                  name="docNumber"
                  value={uploadForm.docNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. UP16-AB-1234, DL-998877"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">File Upload (PDF, JPG, PNG)</label>
                <div className="mt-1 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-6 hover:border-emerald-500 transition cursor-pointer relative bg-slate-50/50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="flex text-xs text-slate-600">
                      <span className="relative rounded-md font-semibold text-emerald-600 focus-within:outline-none hover:text-emerald-700">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-[10px] text-slate-400">PDF, PNG, JPG, or JPEG up to 10MB</p>
                    
                    {uploadForm.file && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs text-emerald-800">
                        <FileCheck size={12} />
                        <span className="font-semibold max-w-[200px] truncate">{uploadForm.file.name}</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={uploadMutation.isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-600/70 disabled:cursor-not-allowed transition mt-2"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading to Cloudinary...
                  </>
                ) : (
                  "Submit Document"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVaultPage;
