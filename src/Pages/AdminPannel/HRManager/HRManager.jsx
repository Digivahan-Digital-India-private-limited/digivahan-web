import React, { useMemo, useState } from "react";
import { BriefcaseBusiness, CircleCheck, CircleX, FileText, PlusCircle } from "lucide-react";
import {
  loadCareerApplications,
  loadCareerJobs,
  saveCareerJobs,
} from "../../../utils/careerJobs";

const DEPARTMENTS = ["Engineering", "Business", "Operations", "Design"];
const JOB_TYPES = ["Full Time", "Part Time", "Internship", "Contract"];
const HR_TABS = [
  { id: "post", label: "Post Job", icon: PlusCircle },
  { id: "manage", label: "Manage Jobs", icon: BriefcaseBusiness },
  { id: "closed", label: "Closed Positions", icon: CircleX },
  { id: "applications", label: "Applications", icon: FileText },
];

const HRManager = () => {
  const [jobs, setJobs] = useState(loadCareerJobs);
  const [applications, setApplications] = useState(loadCareerApplications);
  const [form, setForm] = useState({
    title: "",
    department: "Engineering",
    location: "",
    type: "Full Time",
    experience: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState("post");
  const [closedSearch, setClosedSearch] = useState("");
  const [closedDepartment, setClosedDepartment] = useState("All");
  const [closedPeriod, setClosedPeriod] = useState("all");
  const [manageSearch, setManageSearch] = useState("");
  const [manageDepartment, setManageDepartment] = useState("All");
  const [managePeriod, setManagePeriod] = useState("all");
  const [applicationsSearch, setApplicationsSearch] = useState("");
  const [applicationsJobFilter, setApplicationsJobFilter] = useState("All");
  const [applicationsPeriod, setApplicationsPeriod] = useState("all");

  const summary = useMemo(() => {
    const open = jobs.filter((job) => (job.status || "Open") === "Open").length;
    const closed = jobs.length - open;
    return { open, closed, total: jobs.length };
  }, [jobs]);

  const closedJobs = useMemo(
    () => jobs.filter((job) => (job.status || "Open") !== "Open"),
    [jobs],
  );

  const getPostedDate = (postedStr) => {
    if (!postedStr) return null;
    if (postedStr === "Just now") return new Date();
    
    const now = new Date();
    const dateParts = postedStr.match(/(\d+)\s*(minute|hour|day|week|month|year)s?\s*ago/i);
    
    if (dateParts) {
      const amount = parseInt(dateParts[1]);
      const unit = dateParts[2].toLowerCase();
      const date = new Date(now);
      
      switch (unit) {
        case "minute":
          date.setMinutes(date.getMinutes() - amount);
          break;
        case "hour":
          date.setHours(date.getHours() - amount);
          break;
        case "day":
          date.setDate(date.getDate() - amount);
          break;
        case "week":
          date.setDate(date.getDate() - amount * 7);
          break;
        case "month":
          date.setMonth(date.getMonth() - amount);
          break;
        case "year":
          date.setFullYear(date.getFullYear() - amount);
          break;
        default:
          return date;
      }
      return date;
    }
    
    try {
      return new Date(postedStr);
    } catch {
      return null;
    }
  };

  const isWithinPeriod = (jobDate, period) => {
    if (!jobDate) return true;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const jobDay = new Date(jobDate.getFullYear(), jobDate.getMonth(), jobDate.getDate());

    switch (period) {
      case "today":
        return jobDay.getTime() === today.getTime();
      case "this_week": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return jobDate >= weekStart;
      }
      case "this_month":
        return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const filteredManageJobs = useMemo(() => {
    const query = manageSearch.trim().toLowerCase();
    return jobs.filter((job) => {
      const isOpen = (job.status || "Open") === "Open";
      if (!isOpen) return false;

      const titleMatch = query === "" || String(job.title || "").toLowerCase().includes(query);
      const departmentMatch = manageDepartment === "All" || job.department === manageDepartment;
      
      const postedDate = getPostedDate(job.posted);
      const periodMatch = isWithinPeriod(postedDate, managePeriod);
      
      return titleMatch && departmentMatch && periodMatch;
    });
  }, [jobs, manageSearch, manageDepartment, managePeriod]);

  const filteredClosedJobs = useMemo(() => {
    const query = closedSearch.trim().toLowerCase();
    return closedJobs.filter((job) => {
      const titleMatch = query === "" || String(job.title || "").toLowerCase().includes(query);
      const departmentMatch = closedDepartment === "All" || job.department === closedDepartment;
      
      const postedDate = getPostedDate(job.posted);
      const periodMatch = isWithinPeriod(postedDate, closedPeriod);
      
      return titleMatch && departmentMatch && periodMatch;
    });
  }, [closedJobs, closedSearch, closedDepartment, closedPeriod]);

  const filteredApplications = useMemo(() => {
    const query = applicationsSearch.trim().toLowerCase();
    return applications.filter((application) => {
      const nameMatch = query === "" || String(application.candidateName || "").toLowerCase().includes(query);
      const emailMatch = query === "" || String(application.email || "").toLowerCase().includes(query);
      const jobMatch = applicationsJobFilter === "All" || application.jobTitle === applicationsJobFilter;
      
      const appliedDate = getPostedDate(application.appliedOn);
      const periodMatch = isWithinPeriod(appliedDate, applicationsPeriod);
      
      return (nameMatch || emailMatch) && jobMatch && periodMatch;
    });
  }, [applications, applicationsSearch, applicationsJobFilter, applicationsPeriod]);

  const uniqueJobTitles = useMemo(() => {
    const titles = Array.from(new Set(applications.map((app) => app.jobTitle).filter(Boolean)));
    return titles;
  }, [applications]);

  const updateJobs = (nextJobs) => {
    setJobs(nextJobs);
    saveCareerJobs(nextJobs);
  };

  const refreshApplications = () => {
    setApplications(loadCareerApplications());
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "applications") {
      refreshApplications();
    }
  };

  const handleCreateJob = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !form.experience.trim() || !form.description.trim()) {
      return;
    }

    const nextId = `DV-${Math.max(100, ...jobs.map((job) => Number(String(job.id).replace(/[^0-9]/g, "")) || 100)) + 1}`;

    const newJob = {
      id: nextId,
      title: form.title.trim(),
      department: form.department,
      location: form.location.trim(),
      type: form.type,
      experience: form.experience.trim(),
      posted: "Just now",
      description: form.description.trim(),
      status: "Open",
    };

    updateJobs([newJob, ...jobs]);
    setForm({
      title: "",
      department: "Engineering",
      location: "",
      type: "Full Time",
      experience: "",
      description: "",
    });
    setActiveTab("manage");
  };

  const toggleJobStatus = (jobId) => {
    const nextJobs = jobs.map((job) => {
      if (job.id !== jobId) return job;
      const nextStatus = (job.status || "Open") === "Open" ? "Closed" : "Open";
      return { ...job, status: nextStatus };
    });
    updateJobs(nextJobs);
  };

  const openUploadedCv = (application) => {
    if (!application.cvDataUrl) return;
    window.open(application.cvDataUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-sky-50 via-slate-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
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
        <header className="rounded-2xl border border-blue-100 bg-linear-to-r from-cyan-50 via-white to-indigo-50 p-5 shadow-sm sm:p-6">
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
            <div className="rounded-xl border border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50 p-3 text-sm">
              <p className="text-emerald-700">Open Positions</p>
              <p className="text-2xl font-bold text-emerald-800">{summary.open}</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-linear-to-r from-rose-50 to-pink-50 p-3 text-sm">
              <p className="text-rose-700">Closed Positions</p>
              <p className="text-2xl font-bold text-rose-800">{summary.closed}</p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50 to-blue-50 p-3 text-sm">
              <p className="text-indigo-700">Total Jobs</p>
              <p className="text-2xl font-bold text-indigo-900">{summary.total}</p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {HR_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const countByTab = {
                post: summary.open,
                manage: jobs.length,
                closed: summary.closed,
                applications: applications.length,
              };
              const count = countByTab[tab.id] ?? 0;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`hr-tab-btn flex items-center justify-between px-4 py-3 text-left ${isActive ? "hr-tab-btn-active" : ""}`}
                  aria-pressed={isActive}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {activeTab === "post" && (
          <section className="hr-panel-enter rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Post New Job</h2>
            <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleCreateJob}>
              <input
                type="text"
                placeholder="Job Title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />

              <select
                value={form.department}
                onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />

              <select
                value={form.type}
                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Experience (e.g. 2-4 years)"
                value={form.experience}
                onChange={(event) => setForm((prev) => ({ ...prev, experience: event.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />

              <textarea
                placeholder="Job description"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className="min-h-28 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:col-span-2"
                required
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:shadow-lg hover:shadow-blue-200 md:col-span-2"
              >
                <PlusCircle className="h-4 w-4" />
                Post Job
              </button>
            </form>
          </section>
        )}

        {activeTab === "manage" && (
          <section className="hr-panel-enter rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Manage Posted Jobs</h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {filteredManageJobs.length} shown
              </span>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              <input
                type="text"
                value={manageSearch}
                onChange={(event) => setManageSearch(event.target.value)}
                placeholder="Search by job title"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 md:col-span-2"
              />
              <select
                value={manageDepartment}
                onChange={(event) => setManageDepartment(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
              <select
                value={managePeriod}
                onChange={(event) => setManagePeriod(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>

            {jobs.filter((job) => (job.status || "Open") === "Open").length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No jobs posted yet. Go to Post Job tab to add a new role.
              </p>
            ) : filteredManageJobs.length === 0 ? (
              <p className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                No open positions match your title/department/period filter.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredManageJobs.map((job, index) => {
                  const isOpen = (job.status || "Open") === "Open";

                  return (
                    <article
                      key={job.id}
                      className="hr-card-enter hr-job-card rounded-xl border border-slate-200 bg-slate-50 p-4"
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                          <p className="mt-1 text-xs text-slate-600">
                            {job.department} | {job.type} | {job.location} | {job.experience}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">Posted: {job.posted}</p>
                          <p className="mt-2 text-sm text-slate-700">{job.description}</p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isOpen ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            {isOpen ? "Open" : "Closed"}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleJobStatus(job.id)}
                            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isOpen ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                          >
                            {isOpen ? <CircleX className="h-3.5 w-3.5" /> : <CircleCheck className="h-3.5 w-3.5" />}
                            {isOpen ? "Close Position" : "Reopen Position"}
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

        {activeTab === "closed" && (
          <section className="hr-panel-enter rounded-2xl border border-rose-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Closed Positions</h2>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                {filteredClosedJobs.length} shown
              </span>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              <input
                type="text"
                value={closedSearch}
                onChange={(event) => setClosedSearch(event.target.value)}
                placeholder="Search closed roles by title"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100 md:col-span-2"
              />
              <select
                value={closedDepartment}
                onChange={(event) => setClosedDepartment(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
              <select
                value={closedPeriod}
                onChange={(event) => setClosedPeriod(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>

            {closedJobs.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No closed positions right now.
              </p>
            ) : filteredClosedJobs.length === 0 ? (
              <p className="rounded-xl border border-dashed border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                No closed positions match your title/department/period filter.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredClosedJobs.map((job, index) => (
                  <article
                    key={job.id}
                    className="hr-card-enter hr-job-card rounded-xl border border-slate-200 bg-slate-50 p-4"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                        <p className="mt-1 text-xs text-slate-600">
                          {job.department} | {job.type} | {job.location} | {job.experience}
                        </p>
                        <p className="mt-2 text-sm text-slate-700">{job.description}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                          Closed
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleJobStatus(job.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                          <CircleCheck className="h-3.5 w-3.5" />
                          Reopen Position
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

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
                  onClick={refreshApplications}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Refresh Applications
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              <input
                type="text"
                value={applicationsSearch}
                onChange={(event) => setApplicationsSearch(event.target.value)}
                placeholder="Search by name or email"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 md:col-span-2"
              />
              <select
                value={applicationsJobFilter}
                onChange={(event) => setApplicationsJobFilter(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              >
                <option value="All">All Positions</option>
                {uniqueJobTitles.map((title) => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
              <select
                value={applicationsPeriod}
                onChange={(event) => setApplicationsPeriod(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>

            {applications.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No applications received yet.
              </p>
            ) : filteredApplications.length === 0 ? (
              <p className="rounded-xl border border-dashed border-violet-200 bg-violet-50 p-4 text-sm text-violet-700">
                No applications match your candidate name/email/position/period filter.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((application, index) => (
                  <article
                    key={application.id}
                    className="hr-card-enter hr-app-card rounded-xl border border-slate-200 bg-slate-50 p-4"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{application.candidateName}</h3>
                        <p className="mt-1 text-xs text-slate-600">
                          Applied for: {application.jobTitle} ({application.jobId})
                        </p>
                        <p className="mt-1 text-xs text-slate-600">Email: {application.email}</p>
                        <p className="mt-1 text-xs text-slate-600">Phone: {application.phone}</p>
                        {application.appliedOn && (
                          <p className="mt-1 text-xs text-slate-500">Applied: {application.appliedOn}</p>
                        )}
                        <p className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-slate-700">
                          Cover Letter: {application.coverLetter}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => openUploadedCv(application)}
                        className="inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:brightness-105"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Open Cover Letter CV
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default HRManager;
