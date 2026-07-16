import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";
const CAREER_API = `${BASE_URL}/api/career`;

// ── Helper: get admin auth headers ───────────────────────────────────────────
const getAdminHeaders = () => {
  const token = Cookies.get("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ═══════════════════════════════════════════════════════════
   API — JOBS
═══════════════════════════════════════════════════════════ */

/**
 * Fetch all jobs from the backend.
 * @param {{ status?: string, department?: string, search?: string }} filters
 * @returns {Promise<Array>}
 */
export const fetchJobsFromAPI = async (filters = {}) => {
  try {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.department && filters.department !== "All")
      params.department = filters.department;
    if (filters.search && filters.search.trim())
      params.search = filters.search.trim();

    const res = await axios.get(`${CAREER_API}/jobs`, { params });
    return res.data?.jobs || [];
  } catch (err) {
    console.error("fetchJobsFromAPI error:", err);
    return [];
  }
};

/**
 * Post a new job (admin only).
 * @param {{ title, department, location, type, experience, description }} jobData
 * @returns {Promise<{ status: boolean, job?: object, message?: string }>}
 */
export const postJobToAPI = async (jobData) => {
  try {
    const res = await axios.post(`${CAREER_API}/jobs`, jobData, {
      headers: getAdminHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("postJobToAPI error:", err);
    return {
      status: false,
      message: err.response?.data?.message || "Failed to post job",
    };
  }
};

/**
 * Toggle job status Open ↔ Closed (admin only).
 * @param {string} jobId  – the DV-XXX jobId
 * @returns {Promise<{ status: boolean, job?: object, message?: string }>}
 */
export const toggleJobStatusAPI = async (jobId) => {
  try {
    const res = await axios.patch(
      `${CAREER_API}/jobs/${encodeURIComponent(jobId)}/status`,
      {},
      { headers: getAdminHeaders() }
    );
    return res.data;
  } catch (err) {
    console.error("toggleJobStatusAPI error:", err);
    return {
      status: false,
      message: err.response?.data?.message || "Failed to toggle job status",
    };
  }
};

/* ═══════════════════════════════════════════════════════════
   API — APPLICATIONS
═══════════════════════════════════════════════════════════ */

/**
 * Submit a job application (public).
 * @param {{ jobId, jobTitle, candidateName, email, phone, coverLetter }} data
 * @param {File|null} cvFile
 * @returns {Promise<{ status: boolean, application?: object, message?: string }>}
 */
export const submitApplicationToAPI = async (data, cvFile) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null) formData.append(key, val);
    });
    if (cvFile) formData.append("cv", cvFile);

    const res = await axios.post(`${CAREER_API}/applications`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("submitApplicationToAPI error:", err);
    return {
      status: false,
      message: err.response?.data?.message || "Failed to submit application",
    };
  }
};

/**
 * Fetch all applications (admin only).
 * @param {{ jobTitle?: string, search?: string, period?: string }} filters
 * @returns {Promise<Array>}
 */
export const fetchApplicationsFromAPI = async (filters = {}) => {
  try {
    const params = {};
    if (filters.jobTitle && filters.jobTitle !== "All")
      params.jobTitle = filters.jobTitle;
    if (filters.search && filters.search.trim())
      params.search = filters.search.trim();
    if (filters.period && filters.period !== "all")
      params.period = filters.period;

    const res = await axios.get(`${CAREER_API}/applications`, {
      params,
      headers: getAdminHeaders(),
    });
    return res.data?.applications || [];
  } catch (err) {
    console.error("fetchApplicationsFromAPI error:", err);
    return [];
  }
};

/**
 * Update an application status (admin only).
 * @param {string} id - application MongoDB ID
 * @param {"Pending"|"Reviewed"|"Shortlisted"|"Rejected"} status
 * @returns {Promise<{ status: boolean, application?: object, message?: string }>}
 */
export const updateApplicationStatusAPI = async (id, status) => {
  try {
    const res = await axios.patch(
      `${CAREER_API}/applications/${encodeURIComponent(id)}/status`,
      { status },
      { headers: getAdminHeaders() }
    );
    return res.data;
  } catch (err) {
    console.error("updateApplicationStatusAPI error:", err);
    return {
      status: false,
      message: err.response?.data?.message || "Failed to update application status",
    };
  }
};

/**
 * Delete a job posting (admin only).
 * @param {string} jobId
 * @returns {Promise<{ status: boolean, message?: string }>}
 */
export const deleteJobAPI = async (jobId) => {
  try {
    const res = await axios.delete(
      `${CAREER_API}/jobs/${encodeURIComponent(jobId)}`,
      { headers: getAdminHeaders() }
    );
    return res.data;
  } catch (err) {
    console.error("deleteJobAPI error:", err);
    return {
      status: false,
      message: err.response?.data?.message || "Failed to delete job",
    };
  }
};

/**
 * Delete a job application (admin only).
 * @param {string} appId
 * @returns {Promise<{ status: boolean, message?: string }>}
 */
export const deleteApplicationAPI = async (appId) => {
  try {
    const res = await axios.delete(
      `${CAREER_API}/applications/${encodeURIComponent(appId)}`,
      { headers: getAdminHeaders() }
    );
    return res.data;
  } catch (err) {
    console.error("deleteApplicationAPI error:", err);
    return {
      status: false,
      message: err.response?.data?.message || "Failed to delete application",
    };
  }
};

/* ═══════════════════════════════════════════════════════════
   LEGACY localStorage helpers (kept for backward compat)
═══════════════════════════════════════════════════════════ */
export const CAREER_JOBS_STORAGE_KEY = "digivahanCareerJobs";
export const CAREER_APPLICATIONS_STORAGE_KEY = "digivahanCareerApplications";

export const DEFAULT_CAREER_JOBS = [];

export const normalizeCareerJobs = (jobs) =>
  (Array.isArray(jobs) ? jobs : []).map((job, index) => ({
    ...job,
    id: job.id || `DV-${100 + index}`,
    status: job.status || "Open",
  }));

export const loadCareerJobs = () => {
  try {
    const raw = localStorage.getItem(CAREER_JOBS_STORAGE_KEY);
    if (!raw) return DEFAULT_CAREER_JOBS;
    const parsed = JSON.parse(raw);
    const normalized = normalizeCareerJobs(parsed);
    if (normalized.length === 0) return DEFAULT_CAREER_JOBS;
    return normalized;
  } catch {
    return DEFAULT_CAREER_JOBS;
  }
};

export const saveCareerJobs = (jobs) => {
  localStorage.setItem(
    CAREER_JOBS_STORAGE_KEY,
    JSON.stringify(normalizeCareerJobs(jobs))
  );
};

export const normalizeCareerApplications = (applications) =>
  (Array.isArray(applications) ? applications : []).map(
    (application, index) => ({
      ...application,
      id: application.id || `APP-${index + 1}`,
    })
  );

export const loadCareerApplications = () => {
  try {
    const raw = localStorage.getItem(CAREER_APPLICATIONS_STORAGE_KEY);
    if (!raw) return [];
    return normalizeCareerApplications(JSON.parse(raw));
  } catch {
    return [];
  }
};

export const saveCareerApplications = (applications) => {
  localStorage.setItem(
    CAREER_APPLICATIONS_STORAGE_KEY,
    JSON.stringify(normalizeCareerApplications(applications))
  );
};

export const addCareerApplication = (application) => {
  const existing = loadCareerApplications();
  const nextApplication = {
    ...application,
    id: `APP-${Date.now()}`,
    appliedAt: application.appliedAt || new Date().toISOString(),
  };
  saveCareerApplications([nextApplication, ...existing]);
  return nextApplication;
};
