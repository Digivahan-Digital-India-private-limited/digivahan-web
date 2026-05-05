import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
	AlertTriangle,
	ArrowLeft,
	CheckCircle2,
	Clock3,
	MessageSquare,
	Search,
	Trash2,
	User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const STORAGE_KEY = "digivahanConcerns";
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const STATUS_OPTIONS = ["All", "Open", "In Progress", "Resolved", "Rejected"];

const UI_TO_API_STATUS = {
	Open: "open",
	"In Progress": "in_progress",
	Resolved: "resolved",
	Rejected: "rejected",
};

const UI_TO_API_STATUS_UPDATE = {
	Open: "pending",
	"In Progress": "in_progress",
	Resolved: "resolved",
	Rejected: "rejected",
};

const API_TO_UI_STATUS = {
	OPEN: "Open",
	INPROGRESS: "In Progress",
	IN_PROGRESS: "In Progress",
	RESOLVED: "Resolved",
	REJECTED: "Rejected",
	PENDING: "Open",
};

const CATEGORY_OPTIONS = [
	{ value: "All", label: "All" },
	{ value: "general", label: "General" },
	{ value: "technical", label: "Technical" },
	{ value: "account", label: "Account" },
	{ value: "payment", label: "Payment" },
	{ value: "order", label: "Order" },
	{ value: "cancellation", label: "Cancellation" },
	{ value: "onboarding", label: "Onboarding" },
	{ value: "service", label: "Service Issues" },
	{ value: "communication", label: "Communication" },
	{ value: "partnership", label: "Partnership Concerns" },
	{ value: "billing", label: "Billing Issues" },
	{ value: "other", label: "Other" },
];

const CATEGORY_LABELS = {
	GENERAL: "General",
	TECHNICAL: "Technical",
	ACCOUNT: "Account",
	PAYMENT: "Payment",
	ORDER: "Order",
	CANCELLATION: "Cancellation",
	ONBOARDING: "Onboarding",
	service: "Service Issues",
	technical: "Technical Problems",
	communication: "Communication",
	partnership: "Partnership Concerns",
	billing: "Billing Issues",
	other: "Other",
};

const formatCategory = (category) => {
	if (!category) return "N/A";
	const normalizedCategory = String(category || "").toLowerCase();
	return CATEGORY_LABELS[normalizedCategory] || CATEGORY_LABELS[category] || category;
};

const formatDate = (value) => {
	if (!value) return "-";
	return new Date(value).toLocaleString();
};

const getStatusClasses = (status) => {
	if (status === "Resolved") return "bg-emerald-100 text-emerald-700";
	if (status === "In Progress") return "bg-blue-100 text-blue-700";
	if (status === "Rejected") return "bg-rose-100 text-rose-700";
	return "bg-amber-100 text-amber-700";
};

const mapApiConcernToUiConcern = (item) => {
	if (!item) return null;

	const apiStatus = String(item.status || "").toUpperCase();
	const concernCategory = String(item.category || "").toLowerCase();

	return {
		id: item._id || item.id || "",
		name: item.user_id?.name || item.name || "Unknown User",
		contactInfo: item.user_id?.phoneNumber || item.phoneNumber || "",
		concernCategory,
		issueDescription: item.issueDescription || "",
		supportingDocs: Array.isArray(item.incidentProof)
			? item.incidentProof.join(", ")
			: item.supportingDocs || "",
		status: API_TO_UI_STATUS[apiStatus] || item.status || "Open",
		createdAt: item.createdAt,
		chat: item.conversation || [],
	};
};

const ManageConcerns = () => {
	const navigate = useNavigate();
	const { concernId } = useParams();
	const isDetailsView = Boolean(concernId);

	const [concerns, setConcerns] = useState(() =>
		JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
	);
	const [statusFilter, setStatusFilter] = useState("All");
	const [categoryFilter, setCategoryFilter] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [checkedConcernIds, setCheckedConcernIds] = useState([]);
	const [statusDraftByConcernId, setStatusDraftByConcernId] = useState({});
	const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
	const [deletingConcernId, setDeletingConcernId] = useState(null);

	useEffect(() => {
		let isActive = true;

		const fetchConcerns = async () => {
			try {
				if (isActive) setIsLoadingConcerns(true);

				const params = {};
				if (statusFilter !== "All") {
					params.status = UI_TO_API_STATUS[statusFilter] || statusFilter;
				}
				if (categoryFilter !== "All") {
					params.category = categoryFilter;
				}

				const token = Cookies.get("admin_token");
				const response = await axios.get(`${BASE_URL}/api/concern/list`, {
					params,
					headers: {
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				});

				if (!response?.data?.success) {
					throw new Error(response?.data?.error || "Failed to fetch concerns.");
				}

				const mappedConcerns = (response.data.data || []).map(mapApiConcernToUiConcern);

				if (!isActive) return;

				setConcerns(mappedConcerns);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedConcerns));
			} catch (error) {
				if (!isActive) return;
				toast.error(error.response?.data?.error || error.message || "Failed to fetch concerns.");
			} finally {
				if (isActive) setIsLoadingConcerns(false);
			}
		};

		fetchConcerns();

		return () => {
			isActive = false;
		};
	}, [statusFilter, categoryFilter]);

	useEffect(() => {
		const syncConcerns = () => {
			const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
			setConcerns(stored);
		};
		window.addEventListener("storage", syncConcerns);

		return () => {
			window.removeEventListener("storage", syncConcerns);
		};
	}, []);

	const persistConcerns = (updatedConcerns) => {
		setConcerns(updatedConcerns);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConcerns));
	};

	const filteredConcerns = useMemo(() => {
		if (isDetailsView) return concerns;

		return concerns.filter((item) => {
			const matchesStatus = statusFilter === "All" || item.status === statusFilter;
			const matchesCategory = categoryFilter === "All" || item.concernCategory === categoryFilter;

			const searchBase = [
				item.name,
				item.contactInfo,
				item.issueDescription,
				item.id,
				formatCategory(item.concernCategory),
			]
				.join(" ")
				.toLowerCase();

			const matchesSearch = !searchQuery.trim() || searchBase.includes(searchQuery.toLowerCase());

			return matchesStatus && matchesCategory && matchesSearch;
		});
	}, [concerns, statusFilter, categoryFilter, searchQuery, isDetailsView]);

	const activeConcern = useMemo(() => {
		if (!concernId) return null;
		return concerns.find((item) => item.id === concernId) || null;
	}, [concerns, concernId]);

	const draftStatus = activeConcern
		? statusDraftByConcernId[activeConcern.id] || activeConcern.status || "Open"
		: "Open";

	const toggleConcernCheck = (id) => {
		setCheckedConcernIds((prev) =>
			prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
		);
	};

	const handleToggleAllFiltered = (checked) => {
		if (!checked) {
			setCheckedConcernIds([]);
			return;
		}
		setCheckedConcernIds(filteredConcerns.map((item) => item.id));
	};

	const handleDeleteSingle = async (id) => {
		if (!id || deletingConcernId === id) return;

		try {
			setDeletingConcernId(id);

			const token = Cookies.get("admin_token");
			const response = await axios.delete(`${BASE_URL}/api/concern/delete`, {
				data: { ids: [id], id },
				headers: {
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
			});

			if (!response?.data?.success) {
				throw new Error(response?.data?.message || "Failed to delete concern.");
			}

			const updated = concerns.filter((item) => item.id !== id);
			persistConcerns(updated);
			setCheckedConcernIds((prev) => prev.filter((itemId) => itemId !== id));

			if (concernId === id) {
				navigate("/manage-concerns");
			}

			toast.success(response?.data?.message || "Concern deleted successfully.");
		} catch (error) {
			toast.error(error.response?.data?.message || error.message || "Failed to delete concern.");
		} finally {
			setDeletingConcernId(null);
		}
	};

	const handleDeleteMultiple = async () => {
		if (checkedConcernIds.length === 0 || isDeletingMultiple) return;

		try {
			setIsDeletingMultiple(true);

			const token = Cookies.get("admin_token");
			const response = await axios.delete(`${BASE_URL}/api/concern/delete`, {
				data: { ids: checkedConcernIds },
				headers: {
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
			});

			if (!response?.data?.success) {
				throw new Error(response?.data?.message || "Failed to delete concerns.");
			}

			const updated = concerns.filter((item) => !checkedConcernIds.includes(item.id));
			persistConcerns(updated);
			setCheckedConcernIds([]);

			if (concernId && checkedConcernIds.includes(concernId)) {
				navigate("/manage-concerns");
			}

			toast.success(response?.data?.message || "Concerns deleted successfully.");
		} catch (error) {
			toast.error(error.response?.data?.message || error.message || "Failed to delete concerns.");
		} finally {
			setIsDeletingMultiple(false);
		}
	};

	const handleStatusUpdate = async () => {
		if (!activeConcern || !draftStatus || isUpdatingStatus) return;

		try {
			setIsUpdatingStatus(true);

			const token = Cookies.get("admin_token");
			const response = await axios.put(
				`${BASE_URL}/api/concern/status/${activeConcern.id}`,
				{
					status: UI_TO_API_STATUS_UPDATE[draftStatus] || draftStatus.toLowerCase(),
				},
				{
					headers: {
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				},
			);

			if (!response?.data?.success) {
				throw new Error(response?.data?.error || "Failed to update concern status.");
			}

			const updatedConcernFromApi = mapApiConcernToUiConcern(response?.data?.data);

			const updated = updatedConcernFromApi
				? concerns.map((item) =>
						item.id === activeConcern.id ? updatedConcernFromApi : item,
				  )
				: concerns.map((item) =>
						item.id === activeConcern.id
							? {
									...item,
									status: draftStatus,
							  }
							: item,
				  );

			persistConcerns(updated);
			toast.success("Concern status updated successfully.");
		} catch (error) {
			toast.error(error.response?.data?.error || error.message || "Failed to update status.");
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	const allFilteredChecked =
		filteredConcerns.length > 0 &&
		filteredConcerns.every((item) => checkedConcernIds.includes(item.id));

	return (
		<section className="min-h-screen bg-linear-to-br from-slate-100 via-white to-indigo-50 p-5 md:p-8">
			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; transform: translateY(14px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes slideInRight {
					from { opacity: 0; transform: translateX(16px); }
					to { opacity: 1; transform: translateX(0); }
				}
				@keyframes pulseGlow {
					0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.18); }
					50% { box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.08); }
				}
				.animate-fade-in {
					animation: fadeIn 0.45s ease-out forwards;
				}
				.animate-slide-in-right {
					animation: slideInRight 0.4s ease-out forwards;
				}
				.active-concern-glow {
					animation: pulseGlow 1.8s ease-in-out infinite;
				}
			`}</style>

			<div className="max-w-350 mx-auto animate-fade-in">
				<div className="flex items-center justify-between flex-wrap gap-3 mb-5">
					<h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
						<AlertTriangle className="w-7 h-7 text-amber-500" /> Raise Concern
					</h1>
					<span className="text-sm text-slate-500">Total Concerns: {concerns.length}</span>
				</div>

				{!isDetailsView ? (
					<>
						<div className="bg-linear-to-r from-blue-50/80 via-white to-indigo-50/70 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100 p-4 mb-5">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
								<div className="relative md:col-span-2">
									<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Search by name, concern id, phone or issue"
										className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-blue-200 bg-white/95 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
									/>
								</div>

								<select
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value)}
									className="w-full px-3 py-2.5 rounded-lg border border-blue-200 bg-white/95 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
								>
									{STATUS_OPTIONS.map((status) => (
										<option key={status} value={status}>
											Status: {status}
										</option>
									))}
								</select>

								<select
									value={categoryFilter}
									onChange={(e) => setCategoryFilter(e.target.value)}
									className="w-full px-3 py-2.5 rounded-lg border border-blue-200 bg-white/95 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
								>
									{CATEGORY_OPTIONS.map((category) => (
										<option key={category.value} value={category.value}>
											Category: {category.label}
										</option>
									))}
								</select>
							</div>

							<div className="mt-4 flex items-center justify-between flex-wrap gap-3">
								<label className="inline-flex items-center gap-2 text-sm text-slate-600">
									<input
										type="checkbox"
										checked={allFilteredChecked}
										onChange={(e) => handleToggleAllFiltered(e.target.checked)}
										className="w-4 h-4 rounded border-slate-300"
									/>
									Select all filtered concerns
								</label>

								<button
									type="button"
									onClick={handleDeleteMultiple}
									disabled={checkedConcernIds.length === 0 || isDeletingMultiple}
									className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-red-700 hover:scale-[1.01] transition"
								>
									<Trash2 className="w-4 h-4" /> {isDeletingMultiple ? "Deleting..." : `Delete Multiple (${checkedConcernIds.length})`}
								</button>
							</div>
						</div>

						<div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 max-h-[74vh] overflow-y-auto">
						<h2 className="text-lg font-semibold text-blue-700 mb-3">Concern List</h2>

						{isLoadingConcerns ? (
							<div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
								Loading concerns...
							</div>
						) : filteredConcerns.length === 0 ? (
							<div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
								No concerns found for current filters.
							</div>
						) : (
							<div className="space-y-3">
								{filteredConcerns.map((item, index) => (
									<article
										key={item.id}
										onClick={() => navigate(`/manage-concerns/${item.id}`)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												navigate(`/manage-concerns/${item.id}`);
											}
										}}
										tabIndex={0}
										role="button"
										className="border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in outline-none focus:ring-2 focus:ring-blue-400 border-slate-200 bg-white hover:border-blue-300"
										style={{ animationDelay: `${index * 50}ms` }}
									>
										<div className="flex items-start justify-between gap-2 mb-2">
											<label className="inline-flex items-start gap-2">
												<input
													type="checkbox"
													className="mt-1 w-4 h-4 rounded border-slate-300"
													checked={checkedConcernIds.includes(item.id)}
													onChange={() => toggleConcernCheck(item.id)}
													onClick={(e) => e.stopPropagation()}
												/>
												<button
													type="button"
													onClick={() => navigate(`/manage-concerns/${item.id}`)}
													className="text-left"
												>
													<p className="font-semibold text-slate-800">{item.name || "Unknown User"}</p>
													<p className="text-xs text-slate-500">{item.id}</p>
												</button>
											</label>

											<span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusClasses(item.status)}`}>
												{item.status || "Open"}
											</span>
										</div>

										<div className="text-sm text-slate-600 space-y-1">
											<p>
												<span className="font-medium">Phone:</span> {item.contactInfo || "-"}
											</p>
											<p>
												<span className="font-medium">Category:</span> {formatCategory(item.concernCategory)}
											</p>
											<p className="line-clamp-2">
												<span className="font-medium">Issue:</span> {item.issueDescription || "-"}
											</p>
										</div>

										<div className="flex items-center justify-between mt-3">
											<p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteSingle(item.id);
												}}
												disabled={deletingConcernId === item.id}
												className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 disabled:text-slate-400 disabled:cursor-not-allowed"
											>
												<Trash2 className="w-3.5 h-3.5" /> {deletingConcernId === item.id ? "Deleting..." : "Delete"}
											</button>
										</div>
									</article>
								))}
							</div>
						)}
						</div>
					</>
				) : (
					<div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 max-h-[80vh] overflow-y-auto animate-slide-in-right">
						<div className="mb-4">
							<button
								type="button"
								onClick={() => navigate("/manage-concerns")}
								className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
							>
								<ArrowLeft className="w-4 h-4" /> Back to Concern List
							</button>
						</div>

						<h2 className="text-lg font-semibold text-indigo-700 mb-3">Concern Details</h2>

						{!activeConcern ? (
							<div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
								Concern not found. Please go back to the concern list.
							</div>
						) : (
							<div key={activeConcern.id} className="space-y-5 animate-fade-in">
								<div className="flex justify-end">
									<button
										type="button"
										onClick={() => navigate(`/concern-chat-admin/${activeConcern.id}`)}
										className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
									>
										<MessageSquare className="w-4 h-4" /> Open Chat Page
									</button>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
										<p className="text-xs text-slate-500">Name</p>
										<p className="font-semibold text-slate-800 flex items-center gap-2">
											<User className="w-4 h-4" /> {activeConcern.name || "Unknown"}
										</p>
									</div>
									<div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
										<p className="text-xs text-slate-500">Phone Number</p>
										<p className="font-semibold text-slate-800">{activeConcern.contactInfo || "-"}</p>
									</div>
									<div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
										<p className="text-xs text-slate-500">Category</p>
										<p className="font-semibold text-slate-800">{formatCategory(activeConcern.concernCategory)}</p>
									</div>
									<div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
										<p className="text-xs text-slate-500">Status</p>
										<p className="font-semibold text-slate-800">{activeConcern.status || "Open"}</p>
									</div>
								</div>

								<div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
									<p className="text-xs text-slate-500 mb-2 font-medium">Issue Description</p>
									<p className="text-s font-semibold text-slate-900 leading-relaxed">{activeConcern.issueDescription || "-"}</p>
									
									{activeConcern.supportingDocs && activeConcern.supportingDocs.trim() !== "N/A" && (
										<div className="mt-4">
											<p className="text-xs text-slate-500 mb-2 font-medium">Support Documents</p>
											<div className="flex flex-wrap gap-3">
												{activeConcern.supportingDocs.split(",").map((url, idx) => {
													const trimmedUrl = url.trim();
													if (!trimmedUrl || trimmedUrl === "N/A") return null;
													return (
														<a 
															key={idx} 
															href={trimmedUrl} 
															target="_blank" 
															rel="noopener noreferrer"
															title="Click to view full image"
															className="relative group block w-18 h-18 sm:w-22 sm:h-22 rounded-lg overflow-hidden border border-slate-300 bg-white hover:border-blue-500 transition shadow-sm hover:shadow-md"
														>
															<img 
																src={trimmedUrl} 
																alt={`Supporting Document ${idx + 1}`}
																className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
																onError={(e) => {
																	e.target.style.display = 'none';
																	if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
																}}
															/>
															<div className="hidden absolute inset-0 items-center justify-center bg-slate-50 text-slate-400 text-[10px] text-center p-2 leading-tight">
																File Preview Not Available
															</div>
														</a>
													);
												})}
											</div>
										</div>
									)}
								</div>

								<div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
									<h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
										{draftStatus === "Resolved" ? (
											<CheckCircle2 className="w-4 h-4 text-emerald-600" />
										) : (
											<Clock3 className="w-4 h-4 text-amber-600" />
										)}
										Update Concern Status
									</h3>

									<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
										<select
											value={draftStatus}
											onChange={(e) =>
												setStatusDraftByConcernId((prev) => ({
													...prev,
													[activeConcern.id]: e.target.value,
												}))
											}
											className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="Open">Open</option>
											<option value="In Progress">In Progress</option>
											<option value="Resolved">Resolved</option>
											<option value="Rejected">Rejected</option>
										</select>

										<button
											type="button"
											onClick={handleStatusUpdate}
											disabled={isUpdatingStatus}
											className="inline-flex justify-center items-center px-3 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
										>
											{isUpdatingStatus ? "Saving..." : "Save Status"}
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
};

export default ManageConcerns;
