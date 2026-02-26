import React, { useState } from "react";
import { ArrowLeft, Phone, Mail, User, Ban, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InteractorReports = () => {
  const navigate = useNavigate();
  const [justification, setJustification] = useState("");
  const [showUnsuspendForm, setShowUnsuspendForm] = useState(false);
  const [showSuspendForm, setShowSuspendForm] = useState(false);
  const [showBlockQRForm, setShowBlockQRForm] = useState(false);
  const [suspensionTime, setSuspensionTime] = useState("24 hours");
  const [blockTime, setBlockTime] = useState("24 hours");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [qrId, setQrId] = useState("");

  // Mock user data
  const userData = {
    name: "Rohan Verma",
    userId: "VEH-3421",
    contact: "+91 98765 43210",
    email: "rohan.verma@email.com",
    accountType: "Premium Member",
    activeQRCount: "5 QR Codes",
    verificationStatus: "Verified"
  };

  // Mock reports data
  const reports = [
    {
      id: 1,
      reportType: "Harassment",
      reportedByUser: "Priya Sharma (CU-5632)",
      message: "Inappropriate behavior and harassing messages",
      date: "22 Dec, 2025"
    },
    {
      id: 2,
      reportType: "Fake Profile",
      reportedByUser: "Amit Kumar (CU-7821)",
      message: "Using fake identity and misleading information",
      date: "20 Dec, 2025"
    },
    {
      id: 3,
      reportType: "Fraud",
      reportedByUser: "Neha Singh (CU-4532)",
      message: "Fraudulent transaction attempt",
      date: "18 Dec, 2025"
    }
  ];

  const getReportTypeBadge = (type) => {
    const styles = {
      "Harassment": "bg-red-100 text-red-600",
      "Fake Profile": "bg-orange-100 text-orange-600",
      "Fraud": "bg-red-100 text-red-600"
    };
    return styles[type] || "bg-gray-100 text-gray-600";
  };

  const handlePostJustification = () => {
    console.log("Justification posted:", justification);
    setJustification("");
  };

  return (
    <main className="w-full min-h-screen overflow-y-auto bg-gray-50 md:p-6 p-3">
      {/* Top Header - Search & User */}
      <header className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-xl">
            🔔
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              1
            </span>
          </button>
          <span className="text-gray-700">👤 Admin User</span>
        </div>
      </header>

      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/reports")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </button>

      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">User Profile</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <p className="font-medium text-gray-900">{userData.contact}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <span className="inline-block px-3 py-1 bg-[#E0F7F6] text-[#0D9488] border border-[#5EEAD4] rounded-full text-sm font-medium">
                  {userData.accountType}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verification Status</p>
                <span className="inline-block px-3 py-1 bg-[#E0F7F6] text-[#0D9488] border border-[#5EEAD4] rounded-full text-sm font-medium">
                  {userData.verificationStatus}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-semibold text-gray-900">{userData.userId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="font-medium text-gray-900">{userData.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active QR Count</p>
                <p className="font-semibold text-gray-900">{userData.activeQRCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button 
            onClick={() => setShowSuspendForm(!showSuspendForm)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Ban className="w-4 h-4" />
            Suspend User
          </button>
          <button 
            onClick={() => setShowBlockQRForm(!showBlockQRForm)}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            <Ban className="w-4 h-4" />
            Block QR Code
          </button>
        </div>
      </div>

      {/* Suspend User Form */}
      {showSuspendForm && (
        <div className="bg-[#FFF7ED] rounded-xl border-2 border-[#FDBA74] p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Suspend User</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">User ID</label>
              <input
                type="text"
                value={userData.userId}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Suspension Time</label>
              <select
                value={suspensionTime}
                onChange={(e) => setSuspensionTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 appearance-none cursor-pointer"
              >
                <option value="24 hours">24 hours</option>
                <option value="48 hours">48 hours</option>
                <option value="7 days">7 days</option>
                <option value="30 days">30 days</option>
                <option value="Permanent">Permanent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Reason</label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Enter reason for suspension..."
                className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-none bg-white"
              />
            </div>
            
            <button className="px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Submit Suspension
            </button>
          </div>
        </div>
      )}

      {/* Block QR Code Form */}
      {showBlockQRForm && (
        <div className="bg-[#FFF1F2] rounded-xl border-2 border-[#FDA4AF] p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Block QR Code</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">QR ID</label>
              <input
                type="text"
                value={qrId}
                onChange={(e) => setQrId(e.target.value)}
                placeholder="Enter QR ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Block Time</label>
              <select
                value={blockTime}
                onChange={(e) => setBlockTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 appearance-none cursor-pointer"
              >
                <option value="24 hours">24 hours</option>
                <option value="48 hours">48 hours</option>
                <option value="7 days">7 days</option>
                <option value="30 days">30 days</option>
                <option value="Permanent">Permanent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Reason</label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter reason for blocking..."
                className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-none bg-white"
              />
            </div>
            
            <button className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
              Submit Block
            </button>
          </div>
        </div>
      )}

      {/* Reports Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Reports Filed Against This User</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Report Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reported By User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Message</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Screenshot/Proof</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getReportTypeBadge(report.reportType)}`}>
                        {report.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.reportedByUser}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.message}</td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
                        <Image className="w-4 h-4" />
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{report.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Justification Section */}
      <div className="bg-[#FFF9E6] rounded-xl border-2 border-[#F5DEB3] p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">User Justification</h2>
        <p className="text-gray-600 text-sm mb-4">Enter justification on behalf of user</p>
        
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Enter justification..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
        />
        
        <button
          onClick={handlePostJustification}
          className="mt-4 px-6 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
        >
          Post Justification
        </button>
      </div>

      {/* Unsuspend / Unblock Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Unsuspend / Unblock</h2>
        
        <button
          onClick={() => setShowUnsuspendForm(!showUnsuspendForm)}
          className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          {showUnsuspendForm ? 'Hide Form' : 'Show Unsuspend Form'}
        </button>

        {showUnsuspendForm && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">User ID (to unsuspend)</label>
              <input
                type="text"
                placeholder="Enter User ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">OR QR ID (to unblock QR)</label>
              <input
                type="text"
                placeholder="Enter QR ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Reason</label>
              <textarea
                placeholder="Enter reason for unsuspending..."
                className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-none bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Submit Unsuspend
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default InteractorReports;
