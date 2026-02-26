import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const PriorityIssue = () => {
  const navigate = useNavigate();

  const [issues] = useState([
    {
      userId: 'USR-1021',
      userName: 'Rohan Mehta',
      issueSummary: 'App crash while scanning QR',
      date: '22 Dec, 4:30 PM'
    },
    {
      userId: 'USR-2134',
      userName: 'Priya Sharma',
      issueSummary: 'Payment not processing',
      date: '22 Dec, 3:15 PM'
    },
    {
      userId: 'USR-3245',
      userName: 'Amit Kumar',
      issueSummary: 'Profile picture not uploading',
      date: '22 Dec, 2:00 PM'
    }
  ]);

  const handleResolve = (issue) => {
    navigate('/admin/issues/resolution', { state: { issueData: issue } });
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

      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/issues')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Priority Issue</h1>
          <p className="text-gray-500 text-sm mt-1">Total issues: {issues.length}</p>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Issue Summary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issues.map((issue, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-blue-600 font-medium">{issue.userId}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{issue.userName}</td>
                  <td className="px-6 py-4 text-gray-700">{issue.issueSummary}</td>
                  <td className="px-6 py-4 text-gray-600">{issue.date}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleResolve(issue)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default PriorityIssue;
