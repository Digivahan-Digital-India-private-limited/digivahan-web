import React, { useState } from "react";

const RaiseConcern = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    contactInfo: "",
    concernCategory: "",
    issueDescription: "",
    supportingDocs: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        .fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        
        .scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
      
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-in-up bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
          Raise Concern
        </h1>
        <div className="flex items-center gap-2 mb-8 fade-in-up delay-100">
          <span className="text-yellow-500 text-2xl animate-pulse">⚠️</span>
          <span className="text-lg font-semibold text-gray-800">Raise a Concern – Digivahan</span>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Section */}
          <div className="space-y-6">
            <div className="fade-in-left delay-200 bg-white p-6 rounded-xl shadow-md hover-lift border-l-4 border-yellow-500">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">We're Here to Listen & Resolve</h2>
              <p className="text-gray-700 leading-relaxed">
                At Digivahan, transparency and accountability are at the core of our operations.
                If you have faced any issue related to our services, partnership process,
                technical integration, or communication – we encourage you to let us know.
              </p>
              <p className="text-gray-700 mt-3 leading-relaxed">
                Your feedback and concerns help us improve, strengthen our systems, and
                maintain the highest standards of service.
              </p>
            </div>

            <div className="fade-in-left delay-300 bg-white p-6 rounded-xl shadow-md hover-lift">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <span className="text-2xl">❓</span> When Should You Raise a Concern?
              </h3>
              <p className="text-gray-700 mb-4 font-medium">You may raise a concern if you are facing:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-yellow-50 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-yellow-500 mt-1 text-xl font-bold">✓</span>
                  <span>Service delays or operational issues</span>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-yellow-50 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-yellow-500 mt-1 text-xl font-bold">✓</span>
                  <span>Technical or API-related problems</span>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-yellow-50 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-yellow-500 mt-1 text-xl font-bold">✓</span>
                  <span>Miscommunication or support dissatisfaction</span>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-yellow-50 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-yellow-500 mt-1 text-xl font-bold">✓</span>
                  <span>Partnership or onboarding concerns</span>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-yellow-50 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-yellow-500 mt-1 text-xl font-bold">✓</span>
                  <span>Billing or documentation issues</span>
                </li>
              </ul>
            </div>

            <div className="fade-in-left delay-400 bg-linear-to-br from-yellow-50 to-white p-6 rounded-xl shadow-md hover-lift border border-yellow-200">
              <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📋</span> Our Resolution Process
              </h3>
              <ol className="space-y-4 text-gray-700">
                <li className="flex gap-4 p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <span className="font-bold text-yellow-500 text-2xl min-w-fit">1.</span>
                  <span>
                    <strong className="text-gray-900">Acknowledgement</strong> – We confirm receipt of your concern within 24 working
                    hours.
                  </span>
                </li>
                <li className="flex gap-4 p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <span className="font-bold text-yellow-500 text-2xl min-w-fit">2.</span>
                  <span>
                    <strong className="text-gray-900">Review & Investigation</strong> – The relevant department carefully evaluates the
                    issue.
                  </span>
                </li>
                <li className="flex gap-4 p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <span className="font-bold text-yellow-500 text-2xl min-w-fit">3.</span>
                  <span>
                    <strong className="text-gray-900">Resolution & Response</strong> – A clear explanation and solution are provided
                    within a defined timeline.
                  </span>
                </li>
                <li className="flex gap-4 p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <span className="font-bold text-yellow-500 text-2xl min-w-fit">4.</span>
                  <span>
                    <strong className="text-gray-900">Follow-up</strong> – We ensure the issue is fully resolved to your satisfaction.
                  </span>
                </li>
              </ol>
            </div>

            <div className="fade-in-left delay-500 bg-linear-to-br from-red-50 to-white p-6 rounded-xl shadow-md hover-lift border-l-4 border-red-400">
              <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-2xl">❤️</span> Our Commitment
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We value long-term relationships and believe that addressing concerns
                promptly builds stronger partnerships.
              </p>
              <p className="text-gray-700 mt-3 leading-relaxed">
                At Digivahan, your voice matters – and we are committed to making things right.
              </p>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="fade-in-right delay-200">
            <div className="bg-white rounded-xl shadow-xl p-8 hover-lift border-t-4 border-yellow-500 sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">How to Raise a Concern?</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                You can submit your concern by filling out the form below with complete details, including:
              </p>

              <ul className="space-y-2 text-gray-700 mb-8">
                <li className="flex items-center gap-3 hover:text-yellow-600 transition-colors duration-300">
                  <span className="text-yellow-500">●</span> Your Name
                </li>
                <li className="flex items-center gap-3 hover:text-yellow-600 transition-colors duration-300">
                  <span className="text-yellow-500">●</span> Company Name (if applicable)
                </li>
                <li className="flex items-center gap-3 hover:text-yellow-600 transition-colors duration-300">
                  <span className="text-yellow-500">●</span> Contact Information
                </li>
                <li className="flex items-center gap-3 hover:text-yellow-600 transition-colors duration-300">
                  <span className="text-yellow-500">●</span> Concern Category
                </li>
                <li className="flex items-center gap-3 hover:text-yellow-600 transition-colors duration-300">
                  <span className="text-yellow-500">●</span> Detailed Description of the Issue
                </li>
                <li className="flex items-center gap-3 hover:text-yellow-600 transition-colors duration-300">
                  <span className="text-yellow-500">●</span> Supporting Documents (if any)
                </li>
              </ul>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name (if applicable)
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Information (Email/Phone) *
                  </label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                    placeholder="Email or phone number"
                    required
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Concern Category *
                  </label>
                  <select
                    name="concernCategory"
                    value={formData.concernCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300 cursor-pointer"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="service">Service Issues</option>
                    <option value="technical">Technical Problems</option>
                    <option value="communication">Communication</option>
                    <option value="partnership">Partnership Concerns</option>
                    <option value="billing">Billing Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Detailed Description of the Issue *
                  </label>
                  <textarea
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300 resize-none"
                    placeholder="Please describe your concern in detail..."
                    required
                  ></textarea>
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Supporting Documents (if any)
                  </label>
                  <input
                    type="file"
                    name="supportingDocs"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 text-white font-bold py-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 mt-6"
                >
                  Submit Concern
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>🔒 Confidentiality Assured:</strong> Our team is committed to handling your concern professionally and confidentially.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseConcern;
