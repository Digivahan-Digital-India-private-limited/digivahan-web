import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, User, Phone, Mail } from 'lucide-react';

const IssueResolution = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const issueData = location.state?.issueData;
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'App crash ho raha hai jab QR scan karta hoon',
      time: '10:30 AM',
      sender: 'user'
    },
    {
      id: 2,
      text: 'Can you tell me which device you are using?',
      time: '10:35 AM',
      sender: 'admin'
    },
    {
      id: 3,
      text: 'iPhone 12, iOS 17',
      time: '10:36 AM',
      sender: 'user'
    },
    {
      id: 4,
      text: 'Thank you. We are looking into this issue.',
      time: '10:40 AM',
      sender: 'admin'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sender: 'admin'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleMarkAsResolved = () => {
    alert('Issue marked as resolved!');
    navigate(-1);
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
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Issue Resolution</h1>
          <p className="text-gray-500 text-sm mt-1">{issueData?.issueSummary || 'App crash while scanning QR'}</p>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">User Profile</h2>
        
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
            <User className="w-12 h-12 text-white" />
          </div>

          {/* User Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">User Name</p>
                <p className="text-lg font-semibold text-gray-900">{issueData?.userName || 'Rohan Mehta'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Membership Status</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium">
                  Active
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">User ID</p>
                <p className="text-lg font-semibold text-gray-900">{issueData?.userId || 'USR-1021'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>rohan.mehta@email.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Chat - Issue Resolution</h2>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md ${msg.sender === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-3`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your response..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>

      {/* Mark as Resolved Button */}
      <div className="flex justify-end">
        <button
          onClick={handleMarkAsResolved}
          className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg text-lg"
        >
          <CheckCircle className="w-5 h-5" />
          Mark as Resolved
        </button>
      </div>
    </main>
  );
};

export default IssueResolution;
