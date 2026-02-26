import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Issues = () => {
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState('');

  // Sample data
  const issueStats = [
    {
      id: 1,
      count: 8,
      title: 'Priority Issue',
      description: 'Critical issues requiring immediate attention',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      dotColor: 'bg-red-500',
      link: '/admin/issues/priority'
    },
    {
      id: 2,
      count: 15,
      title: 'App Issue',
      description: 'Application bugs and technical problems',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      dotColor: 'bg-blue-500',
      link: '/admin/issues/app'
    },
    {
      id: 3,
      count: 12,
      title: 'Service Issue',
      description: 'Service quality and delivery issues',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      dotColor: 'bg-yellow-500',
      link: '/admin/issues/service'
    },
    {
      id: 4,
      count: 9,
      title: 'Support Issue',
      description: 'Customer support related problems',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      dotColor: 'bg-orange-500',
      link: '/admin/issues/support'
    },
    {
      id: 5,
      count: 22,
      title: 'Suggestion',
      description: 'Feature requests and improvements',
      color: 'green',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-500',
      dotColor: 'bg-teal-500',
      link: '/admin/issues/suggestion'
    }
  ];

  const resolvedTickets = [
    {
      ticketId: 'TKT-12345',
      userName: 'Vikram Singh',
      issue: 'Login issue fixed',
      category: 'App Issue',
      status: 'Resolved',
      dateResolved: '21 Dec, 2025'
    },
    {
      ticketId: 'TKT-12346',
      userName: 'Neha Patel',
      issue: 'QR code not generating',
      category: 'Service Issue',
      status: 'Resolved',
      dateResolved: '20 Dec, 2025'
    }
  ];

  const handleCheckTicket = () => {
    if (ticketId.trim()) {
      console.log('Checking ticket:', ticketId);
      // Add your ticket check logic here
    }
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

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Issues / Priority</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Manage and resolve customer issues</p>
      </div>

      {/* Issue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {issueStats.map((issue) => (
          <div 
            key={issue.id}
            onClick={() => navigate(issue.link)}
            className={`${issue.bgColor} ${issue.borderColor} border-l-4 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-16 h-16 ${issue.dotColor} rounded-full`}></div>
              <h3 className="text-5xl font-bold text-gray-900">{issue.count}</h3>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-1">{issue.title}</p>
            <p className="text-sm text-gray-500">{issue.description}</p>
          </div>
        ))}
      </div>

      {/* Resolved Tickets Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Resolved Tickets</h2>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ticket ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Issue</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date Resolved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {resolvedTickets.map((ticket, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-blue-600 font-medium">{ticket.ticketId}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{ticket.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.issue}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.category}</td>
                  <td className="px-6 py-4">
                    <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.dateResolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Search Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ticket Search</h2>
        
        <div className="flex gap-4">
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter Ticket ID (e.g., TKT-12345)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleCheckTicket}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Search className="w-5 h-5" />
            Check Ticket
          </button>
        </div>
      </div>
    </main>
  );
};

export default Issues;
