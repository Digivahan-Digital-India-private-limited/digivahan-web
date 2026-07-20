import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CircleCheck,
  CircleX,
  FileText,
  PlusCircle,
  RefreshCw,
  ExternalLink,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  fetchJobsFromAPI,
  postJobToAPI,
  toggleJobStatusAPI,
  fetchApplicationsFromAPI,
  updateApplicationStatusAPI,
  deleteJobAPI,
  deleteApplicationAPI,
} from "../../../utils/careerJobs";

const DEPARTMENTS = ["Engineering", "Business", "Operations", "Design"];
const JOB_TYPES = ["Full Time", "Part Time", "Internship", "Contract"];

const HR_TABS = [
  { id: "post", label: "Post Job", icon: PlusCircle },
  { id: "manage", label: "Manage Jobs", icon: BriefcaseBusiness },
  { id: "closed", label: "Closed Positions", icon: CircleX },
  { id: "applications", label: "Applications", icon: FileText },
];

/* ─── small reusable loading skeleton ─────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-slate-100 bg-slate-50 p-4">
    <div className="mb-2 h-4 w-2/3 rounded bg-slate-200" />
    <div className="h-3 w-1/2 rounded bg-slate-100" />
    <div className="mt-3 h-8 w-full rounded bg-slate-100" />
  </div>
);

const HRManager = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [allJobs, setAllJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [postingJob, setPostingJob] = useState(false);
  const [togglingId, setTogglingId] = useState(null); // jobId being toggled

  const [activeTab, setActiveTab] = useState("post");
  const [postSuccess, setPostSuccess] = useState("");
  const [postError, setPostError] = useState("");

  const [form, setForm] = useState({
    title: "",
    department: "Engineering",
    location: "",
    type: "Full Time",
    experience: "",
    description: "",
  });

  // Manage tab filters
  const [manageSearch, setManageSearch] = useState("");
  const [manageDepartment, setManageDepartment] = useState("All");

  // Closed tab filters
  const [closedSearch, setClosedSearch] = useState("");
  const [closedDepartment, setClosedDepartment] = useState("All");

  // Applications tab filters
  const [applicationsSearch, setApplicationsSearch] = useState("");
  const [applicationsJobFilter, setApplicationsJobFilter] = useState("All");
  const [applicationsPeriod, setApplicationsPeriod] = useState("all");
  const [applicationSubTab, setApplicationSubTab] = useState("all"); // 'all' | 'shortlisted' | 'rejected'
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: "", id: "", title: "" });

  // ── Derived ────────────────────────────────────────────────────────────────
  const openJobs = useMemo(
    () => allJobs.filter((j) => (j.status || "Open") === "Open"),
    [allJobs]
  );
  const closedJobs = useMemo(
    () => allJobs.filter((j) => (j.status || "Open") !== "Open"),
    [allJobs]
  );

  const summary = useMemo(
    () => ({
      open: openJobs.length,
      closed: closedJobs.length,
      total: allJobs.length,
    }),
    [allJobs, openJobs, closedJobs]
  );

  const filteredManageJobs = useMemo(() => {
    const q = manageSearch.trim().toLowerCase();
    return openJobs.filter((j) => {
      const titleMatch = !q || j.title.toLowerCase().includes(q);
      const deptMatch = manageDepartment === "All" || j.department === manageDepartment;
      return titleMatch && deptMatch;
    });
  }, [openJobs, manageSearch, manageDepartment]);

  const filteredClosedJobs = useMemo(() => {
    const q = closedSearch.trim().toLowerCase();
    return closedJobs.filter((j) => {
      const titleMatch = !q || j.title.toLowerCase().includes(q);
      const deptMatch = closedDepartment === "All" || j.department === closedDepartment;
      return titleMatch && deptMatch;
    });
  }, [closedJobs, closedSearch, closedDepartment]);

  const subTabCounts = useMemo(() => {
    let allCount = 0;
    let shortlistedCount = 0;
    let rejectedCount = 0;
    applications.forEach((app) => {
      const s = app.status || "Pending";
      if (s === "Shortlisted") shortlistedCount++;
      else if (s === "Rejected") rejectedCount++;
      else allCount++;
    });
    return { all: allCount, shortlisted: shortlistedCount, rejected: rejectedCount };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const q = applicationsSearch.trim().toLowerCase();
    return applications.filter((app) => {
      const nameMatch = !q || (app.candidateName || "").toLowerCase().includes(q);
      const emailMatch = !q || (app.email || "").toLowerCase().includes(q);
      const jobMatch =
        applicationsJobFilter === "All" || app.jobTitle === applicationsJobFilter;
      
      const s = app.status || "Pending";
      let subTabMatch = true;
      if (applicationSubTab === "all") {
        subTabMatch = s !== "Shortlisted" && s !== "Rejected";
      } else if (applicationSubTab === "shortlisted") {
        subTabMatch = s === "Shortlisted";
      } else if (applicationSubTab === "rejected") {
        subTabMatch = s === "Rejected";
      }

      return (nameMatch || emailMatch) && jobMatch && subTabMatch;
    });
  }, [applications, applicationsSearch, applicationsJobFilter, applicationSubTab]);

  const uniqueJobTitles = useMemo(
    () => [...new Set(applications.map((a) => a.jobTitle).filter(Boolean))],
    [applications]
  );

  // ── Loaders ────────────────────────────────────────────────────────────────
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const jobs = await fetchJobsFromAPI(); // no status filter → get all
      setAllJobs(jobs);
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  const loadApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const apps = await fetchApplicationsFromAPI({
        period: applicationsPeriod !== "all" ? applicationsPeriod : undefined,
      });
      setApplications(apps);
    } finally {
      setLoadingApps(false);
    }
  }, [applicationsPeriod]);

  // Load jobs and applications on mount
  useEffect(() => {
    loadJobs();
    loadApplications();
  }, [loadJobs, loadApplications]);

  // ── Tab switch ─────────────────────────────────────────────────────────────
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPostSuccess("");
    setPostError("");
    if (tabId === "applications") {
      loadApplications();
    }
    if (tabId === "manage" || tabId === "closed") {
      loadJobs();
    }
  };

  // ── Post Job ───────────────────────────────────────────────────────────────
  const handleCreateJob = async (event) => {
    event.preventDefault();
    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.experience.trim() ||
      !form.description.trim()
    )
      return;

    setPostingJob(true);
    setPostSuccess("");
    setPostError("");

    const result = await postJobToAPI({
      title: form.title.trim(),
      department: form.department,
      location: form.location.trim(),
      type: form.type,
      experience: form.experience.trim(),
      description: form.description.trim(),
    });

    setPostingJob(false);

    if (result.status) {
      setPostSuccess("Job posted successfully!");
      setForm({
        title: "",
        department: "Engineering",
        location: "",
        type: "Full Time",
        experience: "",
        description: "",
      });
      // Refresh jobs in background
      loadJobs();
      setTimeout(() => {
        setPostSuccess("");
        setActiveTab("manage");
      }, 1200);
    } else {
      setPostError(result.message || "Failed to post job. Please try again.");
    }
  };

  // ── Toggle job status ──────────────────────────────────────────────────────
  const handleToggleStatus = async (jobId) => {
    setTogglingId(jobId);
    const result = await toggleJobStatusAPI(jobId);
    setTogglingId(null);

    if (result.status) {
      // Optimistic update: flip status in local state
      setAllJobs((prev) =>
        prev.map((j) => {
          const thisId = j.id || j.jobId;
          if (thisId !== jobId) return j;
          return { ...j, status: j.status === "Open" ? "Closed" : "Open" };
        })
      );
    }
  };

  // ── Update application status ──────────────────────────────────────────────
  const handleUpdateAppStatus = async (appId, newStatus) => {
    const result = await updateApplicationStatusAPI(appId, newStatus);
    if (result.status) {
      setApplications((prev) =>
        prev.map((app) => {
          const id = app.id || app._id;
          if (id !== appId) return app;
          return { ...app, status: newStatus };
        })
      );
    }
  };

  // ── Delete triggers ────────────────────────────────────────────────────────
  const triggerDeleteJob = (jobId, title) => {
    setDeleteConfirm({
      isOpen: true,
      type: "job",
      id: jobId,
      title: title,
    });
  };

  const triggerDeleteApplication = (appId, name) => {
    setDeleteConfirm({
      isOpen: true,
      type: "application",
      id: appId,
      title: name,
    });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirm;
    if (type === "job") {
      const result = await deleteJobAPI(id);
      if (result.status) {
        setAllJobs((prev) => prev.filter((j) => (j.id || j.jobId) !== id));
      } else {
        alert(result.message || "Failed to delete job");
      }
    } else if (type === "application") {
      const result = await deleteApplicationAPI(id);
      if (result.status) {
        setApplications((prev) => prev.filter((app) => (app.id || app._id) !== id));
      } else {
        alert(result.message || "Failed to delete application");
      }
    }
    setDeleteConfirm({ isOpen: false, type: "", id: "", title: "" });
  };

  // ── Reload applications when period filter changes ─────────────────────────
  useEffect(() => {
    if (activeTab === "applications") {
      loadApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationsPeriod]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <style>{`
        @keyframes hrPanelIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes hrCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .hr-panel-enter {
          animation: hrPanelIn 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hr-card-enter {
          animation: hrCardIn 0.45s ease both;
        }

        .hr-tab-btn {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, color 0.22s ease;
        }

        .hr-tab-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, rgba(59, 130, 246, 0.14), rgba(20, 184, 166, 0.12), rgba(99, 102, 241, 0.14));
          opacity: 0;
          transition: opacity 0.22s ease;
        }

        .hr-tab-btn:hover {
          transform: translateY(-1px);
          border-color: #93c5fd;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.12);
        }

        .hr-tab-btn:hover::before {
          opacity: 1;
        }

        .hr-tab-btn > * {
          position: relative;
          z-index: 1;
        }

        .hr-tab-btn-active {
          border-color: transparent;
          color: #ffffff;
          background: linear-gradient(110deg, #2563eb 0%, #0ea5e9 55%, #4f46e5 100%);
          box-shadow: 0 14px 26px rgba(37, 99, 235, 0.35);
        }

        .hr-tab-btn-active::before {
          opacity: 0;
        }

        .hr-job-card,
        .hr-app-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }

        .hr-job-card:hover,
        .hr-app-card:hover {
          transform: translateY(-3px);
          border-color: #bfdbfe;
          box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
        }
      `}</style>

      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header className="rounded-2xl border border-blue-100 bg-gradient-to-r from-cyan-50 via-white to-indigo-50 p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <BriefcaseBusiness className="mt-0.5 h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">HR Manager</h1>
              <p className="mt-2 text-sm text-slate-600">
                Use tabs to switch between posting jobs, managing positions, and reviewing applications.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-3 text-sm">
              <p className="text-emerald-700">Open Positions</p>
              <p className="text-2xl font-bold text-emerald-800">
                {loadingJobs ? "–" : summary.open}
              </p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 p-3 text-sm">
              <p className="text-rose-700">Closed Positions</p>
              <p className="text-2xl font-bold text-rose-800">
                {loadingJobs ? "–" : summary.closed}
              </p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 text-sm">
              <p className="text-indigo-700">Total Jobs</p>
              <p className="text-2xl font-bold text-indigo-900">
                {loadingJobs ? "–" : summary.total}
              </p>
            </div>
          </div>
        </header>

        {/* ── Tab Bar ───────────────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {HR_TABS.filter((tab) => {
              const permissions = JSON.parse(localStorage.getItem("admin_permissions") || "{}");
              const idToKey = {
                "post": "card_hr_post",
                "manage": "card_hr_manage",
                "closed": "card_hr_closed",
                "applications": "card_hr_applications"
              };
              return permissions[idToKey[tab.id]] !== false;
            }).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const countMap = {
                post: summary.open,
                manage: summary.open,
                closed: summary.closed,
                applications: applications.length,
              };
              const count = countMap[tab.id] ?? 0;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`hr-tab-btn flex items-center justify-between px-4 py-3 text-left ${
                    isActive ? "hr-tab-btn-active" : ""
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══ TAB: POST JOB ════════════════════════════════════════════════ */}
        {activeTab === "post" && (
          <section className="hr-panel-enter rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Post New Job</h2>
            <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleCreateJob}>
              <input
                type="text"
                placeholder="Job Title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />

              <select
                value={form.department}
                onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />

              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Experience (e.g. 2-4 years)"
                value={form.experience}
                onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />

              <textarea
                placeholder="Job description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="min-h-28 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:col-span-2"
                required
              />

              {postSuccess && (
                <p className="text-sm font-medium text-emerald-600 md:col-span-2">{postSuccess}</p>
              )}
              {postError && (
                <p className="text-sm font-medium text-rose-600 md:col-span-2">{postError}</p>
              )}

              <button
                type="submit"
                disabled={postingJob}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-70 md:col-span-2"
              >
                {postingJob ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
                {postingJob ? "Posting..." : "Post Job"}
              </button>
            </form>
          </section>
        )}

        {/* ═══ TAB: MANAGE JOBS ═════════════════════════════════════════════ */}
        {activeTab === "manage" && (
          <section className="hr-panel-enter rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Manage Posted Jobs</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {filteredManageJobs.length} shown
                </span>
                <button
                  type="button"
                  onClick={loadJobs}
                  disabled={loadingJobs}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingJobs ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                value={manageSearch}
                onChange={(e) => setManageSearch(e.target.value)}
                placeholder="Search by job title"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 md:col-span-2"
              />
              <select
                value={manageDepartment}
                onChange={(e) => setManageDepartment(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {loadingJobs ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : openJobs.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No jobs posted yet. Go to Post Job tab to add a new role.
              </p>
            ) : filteredManageJobs.length === 0 ? (
              <p className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                No open positions match your title/department filter.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredManageJobs.map((job, index) => {
                  const jobId = job.id || job.jobId;
                  const isToggling = togglingId === jobId;
                  return (
                    <article
                      key={jobId}
                      className="hr-card-enter hr-job-card rounded-xl border border-slate-200 bg-slate-50 p-4"
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                          <p className="mt-1 text-xs text-slate-600">
                            {job.department} | {job.type} | {job.location} | {job.experience}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">Posted: {job.posted}</p>
                          <p className="mt-2 text-sm text-slate-700 line-clamp-2">{job.description}</p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            Open
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(jobId)}
                            disabled={isToggling}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                          >
                            {isToggling ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CircleX className="h-3.5 w-3.5" />
                            )}
                            Close Position
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDeleteJob(jobId, job.title)}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 text-xs font-semibold hover:bg-rose-100 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ═══ TAB: CLOSED POSITIONS ════════════════════════════════════════ */}
        {activeTab === "closed" && (
          <section className="hr-panel-enter rounded-2xl border border-rose-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Closed Positions</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  {filteredClosedJobs.length} shown
                </span>
                <button
                  type="button"
                  onClick={loadJobs}
                  disabled={loadingJobs}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingJobs ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                value={closedSearch}
                onChange={(e) => setClosedSearch(e.target.value)}
                placeholder="Search closed roles by title"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100 md:col-span-2"
              />
              <select
                value={closedDepartment}
                onChange={(e) => setClosedDepartment(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {loadingJobs ? (
              <div className="space-y-3">
                {[1, 2].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : closedJobs.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No closed positions right now.
              </p>
            ) : filteredClosedJobs.length === 0 ? (
              <p className="rounded-xl border border-dashed border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                No closed positions match your filter.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredClosedJobs.map((job, index) => {
                  const jobId = job.id || job.jobId;
                  const isToggling = togglingId === jobId;
                  return (
                    <article
                      key={jobId}
                      className="hr-card-enter hr-job-card rounded-xl border border-slate-200 bg-slate-50 p-4"
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                          <p className="mt-1 text-xs text-slate-600">
                            {job.department} | {job.type} | {job.location} | {job.experience}
                          </p>
                          <p className="mt-2 text-sm text-slate-700 line-clamp-2">{job.description}</p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                            Closed
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(jobId)}
                            disabled={isToggling}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {isToggling ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CircleCheck className="h-3.5 w-3.5" />
                            )}
                            Reopen Position
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDeleteJob(jobId, job.title)}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 text-xs font-semibold hover:bg-rose-100 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ═══ TAB: APPLICATIONS ════════════════════════════════════════════ */}
        {activeTab === "applications" && (
          <section className="hr-panel-enter rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Job Applications</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  {filteredApplications.length} shown
                </span>
                <button
                  type="button"
                  onClick={loadApplications}
                  disabled={loadingApps}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 inline-flex items-center gap-1"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingApps ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                value={applicationsSearch}
                onChange={(e) => setApplicationsSearch(e.target.value)}
                placeholder="Search by name or email"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 md:col-span-2"
              />
              <select
                value={applicationsJobFilter}
                onChange={(e) => setApplicationsJobFilter(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              >
                <option value="All">All Positions</option>
                {uniqueJobTitles.map((title) => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
              <select
                value={applicationsPeriod}
                onChange={(e) => setApplicationsPeriod(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 md:col-span-3"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>

            {/* Sub-tabs for Applications: All, Shortlisted, Rejected */}
            <div className="flex gap-2 mb-6 border-b pb-2 flex-wrap">
              <button
                type="button"
                onClick={() => setApplicationSubTab("all")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                  applicationSubTab === "all"
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-600 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                All / Active ({subTabCounts.all})
              </button>
              <button
                type="button"
                onClick={() => setApplicationSubTab("shortlisted")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                  applicationSubTab === "shortlisted"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-600 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                Shortlisted ({subTabCounts.shortlisted})
              </button>
              <button
                type="button"
                onClick={() => setApplicationSubTab("rejected")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                  applicationSubTab === "rejected"
                    ? "bg-rose-600 text-white shadow-md"
                    : "text-slate-600 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                Rejected ({subTabCounts.rejected})
              </button>
            </div>

            {loadingApps ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : applications.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No applications received yet.
              </p>
            ) : filteredApplications.length === 0 ? (
              <p className="rounded-xl border border-dashed border-violet-200 bg-violet-50 p-4 text-sm text-violet-700">
                No applications match your filters.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((app, index) => (
                  <article
                    key={app.id || app._id}
                    className="hr-card-enter hr-app-card rounded-xl border border-slate-200 bg-slate-50 p-4"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900">{app.candidateName}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            app.status === "Shortlisted"
                              ? "bg-emerald-100 text-emerald-700"
                              : app.status === "Rejected"
                              ? "bg-rose-100 text-rose-700"
                              : app.status === "Reviewed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {app.status || "Pending"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          Applied for: <span className="font-medium">{app.jobTitle}</span> ({app.jobId})
                        </p>
                        <p className="mt-1 text-xs text-slate-600">Email: {app.email}</p>
                        <p className="mt-1 text-xs text-slate-600">Phone: {app.phone}</p>
                        {app.appliedOn && (
                          <p className="mt-1 text-xs text-slate-500">Applied: {app.appliedOn}</p>
                        )}
                        {app.coverLetter && (
                          <p className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-slate-700 line-clamp-3">
                            {app.coverLetter}
                          </p>
                        )}
                      </div>

                      {/* Action buttons inside card */}
                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        {app.cvDataUrl && (
                          <a
                            href={app.cvDataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:brightness-105"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View CV
                            <ExternalLink className="h-3 w-3 opacity-70" />
                          </a>
                        )}

                        <div className="flex gap-1.5 mt-1">
                          {app.status !== "Shortlisted" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppStatus(app.id || app._id, "Shortlisted")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
                            >
                              Shortlist
                            </button>
                          )}
                          {app.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppStatus(app.id || app._id, "Rejected")}
                              className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
                            >
                              Reject
                            </button>
                          )}
                          {app.status && app.status !== "Pending" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppStatus(app.id || app._id, "Pending")}
                              className="bg-slate-500 hover:bg-slate-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
                            >
                              Reset
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => triggerDeleteApplication(app.id || app._id, app.candidateName)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-0.5"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-[hrPanelIn_0.22s_ease_both]">
            <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete this {deleteConfirm.type === "job" ? "job posting" : "application"}?
            </p>
            {deleteConfirm.title && (
              <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 font-mono">
                {deleteConfirm.title}
              </p>
            )}
            <p className="mt-1 text-xs text-rose-500 font-medium">This action cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ isOpen: false, type: "", id: "", title: "" })}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HRManager;
