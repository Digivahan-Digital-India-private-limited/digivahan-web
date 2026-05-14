export const CAREER_JOBS_STORAGE_KEY = "digivahanCareerJobs";
export const CAREER_APPLICATIONS_STORAGE_KEY = "digivahanCareerApplications";

export const DEFAULT_CAREER_JOBS = [
  {
    id: "DV-101",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Delhi NCR",
    type: "Full Time",
    experience: "1-3 years",
    posted: "2 days ago",
    description:
      "Build and improve user-facing features using React, Tailwind, and API integrations.",
    status: "Open",
  },
  {
    id: "DV-102",
    title: "Backend Developer",
    department: "Engineering",
    location: "Delhi NCR",
    type: "Full Time",
    experience: "2-4 years",
    posted: "4 days ago",
    description:
      "Develop secure APIs, optimize database queries, and support scalable product modules.",
    status: "Open",
  },
  {
    id: "DV-103",
    title: "Business Development Executive",
    department: "Business",
    location: "Jaipur",
    type: "Full Time",
    experience: "1-2 years",
    posted: "1 week ago",
    description:
      "Drive partner onboarding, manage outreach, and expand DigiVahan's dealer network.",
    status: "Open",
  },
  {
    id: "DV-104",
    title: "Customer Support Associate",
    department: "Operations",
    location: "Remote",
    type: "Full Time",
    experience: "0-2 years",
    posted: "3 days ago",
    description:
      "Resolve customer queries, track issues, and coordinate with internal product teams.",
    status: "Open",
  },
  {
    id: "DV-105",
    title: "Graphic Designer",
    department: "Design",
    location: "Delhi NCR",
    type: "Part Time",
    experience: "1-3 years",
    posted: "5 days ago",
    description:
      "Create visual assets for app screens, campaigns, and social media communication.",
    status: "Open",
  },
  {
    id: "DV-106",
    title: "Operations Intern",
    department: "Operations",
    location: "Noida",
    type: "Internship",
    experience: "Freshers",
    posted: "1 day ago",
    description:
      "Support daily operations, reporting, and process coordination across teams.",
    status: "Open",
  },
];

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
  localStorage.setItem(CAREER_JOBS_STORAGE_KEY, JSON.stringify(normalizeCareerJobs(jobs)));
};

export const normalizeCareerApplications = (applications) =>
  (Array.isArray(applications) ? applications : []).map((application, index) => ({
    ...application,
    id: application.id || `APP-${index + 1}`,
  }));

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
