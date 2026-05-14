import React, { useEffect, useMemo, useState } from "react";
import { addCareerApplication, loadCareerJobs, saveCareerJobs } from "../utils/careerJobs";

const DEPARTMENTS = [
  "All",
  "Engineering",
  "Business",
  "Operations",
  "Design",
];

const WHY_JOIN_US = [
  {
    title: "High Impact Work",
    text: "Build products that solve real mobility and safety problems for thousands of users.",
  },
  {
    title: "Learning Culture",
    text: "Work in a team that values mentorship, ownership, and continuous skill growth.",
  },
  {
    title: "Fast Execution",
    text: "Move quickly from idea to release with close collaboration across teams.",
  },
];

const BENEFITS = [
  "Flexible working model",
  "Performance-based growth",
  "Skill-building and training",
  "Collaborative team environment",
  "Opportunity to work on live products",
  "Inclusive and transparent culture",
];

const HIRING_PROCESS = [
  "Apply for your preferred role",
  "Initial screening and profile review",
  "Technical or functional interview round",
  "Final culture fit discussion",
  "Offer and onboarding",
];

const CareerPage = () => {
  const [jobs, setJobs] = useState(loadCareerJobs);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationForm, setApplicationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    setJobs(loadCareerJobs());
  }, []);

  useEffect(() => {
    saveCareerJobs(jobs);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const statusMatch = (job.status || "Open") === "Open";
      const departmentMatch =
        selectedDepartment === "All" || job.department === selectedDepartment;

      const searchableText = [job.title, job.type, job.department, job.location]
        .join(" ")
        .toLowerCase();
      const queryMatch =
        searchQuery.trim() === "" || searchableText.includes(searchQuery.toLowerCase());

      return statusMatch && departmentMatch && queryMatch;
    });
  }, [jobs, selectedDepartment, searchQuery]);

  const resetApplicationForm = () => {
    setApplicationForm({
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
    });
    setCvFile(null);
    setApplicationMessage("");
  };

  const handleOpenApplyModal = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
    setApplicationMessage("");
  };

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
    setSelectedJob(null);
    resetApplicationForm();
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmitApplication = async (event) => {
    event.preventDefault();
    if (!selectedJob) return;

    if (!cvFile) {
      setApplicationMessage("Please upload your CV before submitting.");
      return;
    }

    try {
      const cvDataUrl = await fileToDataUrl(cvFile);

      addCareerApplication({
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        candidateName: applicationForm.fullName.trim(),
        email: applicationForm.email.trim(),
        phone: applicationForm.phone.trim(),
        coverLetter: applicationForm.coverLetter.trim(),
        cvFileName: cvFile.name,
        cvMimeType: cvFile.type,
        cvDataUrl,
      });

      setApplicationMessage("Application submitted successfully.");
      setTimeout(() => {
        handleCloseApplyModal();
      }, 800);
    } catch {
      setApplicationMessage("Unable to submit application. Please try again.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white px-4 py-10 sm:px-6 lg:px-8">
      <style>{`
        @keyframes careerFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes careerSlideIn {
          from { opacity: 0; transform: translateX(-26px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes careerGlow {
          0%, 100% { opacity: .45; transform: scale(1); }
          50% { opacity: .8; transform: scale(1.08); }
        }

        .career-hero-anim {
          animation: careerFadeUp .65s ease both;
        }

        .career-filter-anim {
          animation: careerSlideIn .55s cubic-bezier(.22,1,.36,1) both;
        }

        .career-list-anim {
          animation: careerFadeUp .65s ease both;
        }

        .career-card {
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }

        .career-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 36px rgba(0, 0, 0, .09);
          border-color: #fbbf24;
        }

        .career-dot {
          animation: careerGlow 3s ease-in-out infinite;
        }

        .career-theme-tab {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          transition: all .28s ease;
        }

        .career-theme-tab::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(251,191,36,.14), rgba(249,115,22,.12));
          opacity: 0;
          transition: opacity .28s ease;
        }

        .career-theme-tab:hover::before {
          opacity: 1;
        }

        .career-process-tab {
          border: 1px solid #fde68a;
          background: linear-gradient(90deg, #fffef7 0%, #fff7ed 100%);
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .career-process-tab:hover {
          transform: translateY(-2px);
          border-color: #fbbf24;
          box-shadow: 0 12px 24px rgba(251,191,36,.18);
        }

        .career-process-count {
          background: linear-gradient(180deg, #facc15 0%, #f59e0b 100%);
          box-shadow: 0 6px 14px rgba(245, 158, 11, .35);
        }

        @keyframes careerModalIn {
          from { opacity: 0; transform: translateY(22px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .career-modal-card {
          animation: careerModalIn .26s ease both;
        }
      `}</style>

      <div className={`${isApplyModalOpen ? "blur-sm pointer-events-none select-none" : ""} transition duration-200`}>

      <div
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #fb923c 0%, transparent 70%)" }}
      />

      <div className="career-hero-anim mx-auto mb-8 max-w-7xl rounded-2xl border border-yellow-100 bg-linear-to-r from-yellow-50 via-white to-orange-50 p-6 sm:p-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          <span className="career-dot inline-block h-2 w-2 rounded-full bg-yellow-500" />
          We are hiring
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Careers at DigiVahan</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
          Join a fast-moving team building smart digital solutions for safer and better vehicle services.
          Explore our latest openings and apply to the role that matches your skills.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <aside className="career-filter-anim lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Filter Jobs</h2>

            <form
              className="mt-4"
              onSubmit={(event) => {
                event.preventDefault();
                setSearchQuery(searchInput.trim());
              }}
            >
              <label htmlFor="career-search" className="text-sm text-gray-500">
                Search job type
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="career-search"
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Ex: Internship, Full Time"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-yellow-500"
                >
                  Search
                </button>
              </div>
            </form>

            <p className="mt-1 text-sm text-gray-500">Department</p>

            <div className="mt-4 flex flex-col gap-2">
              {DEPARTMENTS.map((department) => {
                const isActive = selectedDepartment === department;

                return (
                  <button
                    key={department}
                    type="button"
                    onClick={() => setSelectedDepartment(department)}
                    className={`career-theme-tab w-full border px-3 py-2 text-left text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "border-yellow-400 bg-linear-to-r from-yellow-100 to-orange-100 text-yellow-900 shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-yellow-300"
                    }`}
                  >
                    <span className="relative z-10">{department}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-yellow-100 bg-yellow-50 p-3">
              <p className="text-xs font-semibold text-yellow-700">Quick Tip</p>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                Search by role type like Full Time, Internship, or by location to find relevant openings faster.
              </p>
            </div>
          </div>
        </aside>

        <section className="career-list-anim lg:col-span-9">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">New Hirings</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 sm:text-sm">
              {filteredJobs.length} Open Position{filteredJobs.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredJobs.map((job, index) => (
              <article
                key={job.id}
                className="career-card rounded-2xl border border-gray-200 bg-white p-5"
                style={{ animation: `careerFadeUp .55s ease both`, animationDelay: `${index * 90}ms` }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <p className="mt-1 text-sm font-medium text-yellow-700">{job.department}</p>
                  </div>
                  <span className="rounded-lg bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-700">
                    {job.type}
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-600">{job.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <span className="rounded-md bg-gray-50 px-2 py-1">Location: {job.location}</span>
                  <span className="rounded-md bg-gray-50 px-2 py-1">Exp: {job.experience}</span>
                  <span className="rounded-md bg-gray-50 px-2 py-1">Posted: {job.posted}</span>
                  <span className="rounded-md bg-gray-50 px-2 py-1">ID: {job.id}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenApplyModal(job)}
                  className="mt-5 rounded-xl bg-linear-to-r from-yellow-400 to-orange-400 px-4 py-2 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02]"
                >
                  Apply Now
                </button>
              </article>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-sm text-gray-600">
                No openings found for this filter/search. Try another keyword or department.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="mx-auto mt-12 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {WHY_JOIN_US.map((item, index) => (
            <article
              key={item.title}
              className="career-card rounded-2xl border border-gray-200 bg-white p-5"
              style={{ animation: `careerFadeUp .55s ease both`, animationDelay: `${index * 120}ms` }}
            >
              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Perks and Benefits</h2>
          <p className="mt-2 text-sm text-gray-600">
            We care about growth, ownership, and a healthy work environment where people can do their best work.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Our Hiring Process</h2>
          <p className="mt-2 text-sm text-gray-600">
            A simple and transparent process designed to identify great talent quickly.
          </p>
          <div className="mt-4 space-y-3">
            {HIRING_PROCESS.map((step, index) => (
              <div
                key={step}
                className="career-process-tab flex items-center gap-3 rounded-xl px-3 py-2.5"
              >
                <span className="career-process-count flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-medium text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl rounded-2xl border border-yellow-100 bg-linear-to-r from-yellow-50 via-white to-orange-50 p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Did not find a matching role?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
          We are always looking for passionate people in engineering, operations, growth, and design.
          Share your profile with us and we will reach out when a relevant opening is available.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-yellow-500"
          >
            Submit Your Resume
          </button>
          <button
            type="button"
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-yellow-300 hover:bg-yellow-50"
          >
            Contact HR Team
          </button>
        </div>
      </section>
      </div>

      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm">
          <div className="career-modal-card max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-yellow-100 bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Apply for {selectedJob?.title}</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Fill your details and upload your CV. HR team will review your profile.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseApplyModal}
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSubmitApplication}>
              <input
                type="text"
                placeholder="Full Name"
                value={applicationForm.fullName}
                onChange={(event) =>
                  setApplicationForm((prev) => ({ ...prev, fullName: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={applicationForm.email}
                onChange={(event) =>
                  setApplicationForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={applicationForm.phone}
                onChange={(event) =>
                  setApplicationForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                required
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => setCvFile(event.target.files?.[0] || null)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-yellow-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-yellow-700 hover:file:bg-yellow-200"
                required
              />
              <textarea
                placeholder="Cover Letter"
                value={applicationForm.coverLetter}
                onChange={(event) =>
                  setApplicationForm((prev) => ({ ...prev, coverLetter: event.target.value }))
                }
                className="min-h-28 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 md:col-span-2"
                required
              />

              {applicationMessage && (
                <p className="text-sm font-medium text-amber-700 md:col-span-2">{applicationMessage}</p>
              )}

              <button
                type="submit"
                className="rounded-xl bg-linear-to-r from-yellow-400 to-orange-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.01] md:col-span-2"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default CareerPage;
