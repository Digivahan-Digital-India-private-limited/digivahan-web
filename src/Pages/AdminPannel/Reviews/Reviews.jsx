import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, Minus, ThumbsDown } from 'lucide-react';

const Reviews = () => {
  const navigate = useNavigate();

  // Sample data - replace with actual API data
  const stats = {
    happyCustomers: 245,
    sadCustomers: 87,
    totalReviews: 444,
    positiveReviews: 245,
    averageReviews: 112,
    negativeReviews: 87
  };

  const repliedPositiveReviews = [
    {
      customerName: 'Priya Sharma',
      review: 'Excellent service! Very satisfied.',
      yourReply: 'Thank you so much for your positive feedback!',
      date: '22 Dec, 2025',
      status: 'Responded'
    },
    {
      customerName: 'Amit Kumar',
      review: 'Great experience with the app.',
      yourReply: 'We appreciate your support!',
      date: '21 Dec, 2025',
      status: 'Responded'
    }
  ];

  const repliedNegativeReviews = [
    {
      customerName: 'Rakesh Verma',
      review: 'App crashes frequently.',
      yourReply: 'We apologize for the inconvenience. Our team is working on a fix.',
      date: '20 Dec, 2025',
      status: 'Responded'
    },
    {
      customerName: 'Neha Singh',
      review: 'Poor customer support response time.',
      yourReply: 'We are sorry for the delay. We have improved our support team.',
      date: '19 Dec, 2025',
      status: 'Responded'
    }
  ];

  const happyPercentage = Math.round((stats.happyCustomers / stats.totalReviews) * 100);

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
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Reviews Management</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Monitor and respond to customer reviews</p>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          {/* Left - Happy Customers */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">😊</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Happy Customers</p>
              <p className="text-4xl font-bold text-gray-900">{stats.happyCustomers}</p>
            </div>
          </div>

          {/* Right - Sad Customers */}
          <div className="flex items-center gap-3">
            <div>
              <p className="text-gray-500 text-sm text-right">Sad Customers</p>
              <p className="text-4xl font-bold text-gray-900 text-right">{stats.sadCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">😞</span>
            </div>
          </div>
        </div>

        {/* Satisfaction Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-lg">😊</span>
            <p className="text-base font-semibold text-gray-900">Customer Satisfaction High</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div 
              className="bg-green-500 h-8 flex items-center justify-center text-white font-semibold text-sm transition-all"
              style={{ width: `${happyPercentage}%` }}
            >
              {happyPercentage}% Happy
            </div>
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Positive Reviews Card */}
        <div 
          className="bg-green-50 border-l-4 border-green-500 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/admin/reviews/positive')}
        >
          <div className="flex items-center justify-between mb-4">
            <ThumbsUp className="w-12 h-12 text-green-600" strokeWidth={1.5} />
            <h3 className="text-5xl font-bold text-gray-900">{stats.positiveReviews}</h3>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-1">Positive Reviews</p>
          <p className="text-sm text-gray-500">Click to view all reviews</p>
        </div>

        {/* Average Reviews Card */}
        <div 
          className="bg-yellow-50 border-l-4 border-yellow-500 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/admin/reviews/average')}
        >
          <div className="flex items-center justify-between mb-4">
            <Minus className="w-12 h-12 text-yellow-600" strokeWidth={3} />
            <h3 className="text-5xl font-bold text-gray-900">{stats.averageReviews}</h3>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-1">Average Reviews</p>
          <p className="text-sm text-gray-500">Click to view all reviews</p>
        </div>

        {/* Negative Reviews Card */}
        <div 
          className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/admin/reviews/negative')}
        >
          <div className="flex items-center justify-between mb-4">
            <ThumbsDown className="w-12 h-12 text-red-600" strokeWidth={1.5} />
            <h3 className="text-5xl font-bold text-gray-900">{stats.negativeReviews}</h3>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-1">Negative Reviews</p>
          <p className="text-sm text-gray-500">Click to view all reviews</p>
        </div>
      </div>

      {/* Replied Reviews Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Replied Reviews</h2>

        {/* Replied Positive Reviews */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 bg-green-50 px-4 py-3 rounded-lg">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Replied Positive Reviews</h3>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Review</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Your Reply</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {repliedPositiveReviews.map((review, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{review.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{review.review}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{review.yourReply}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{review.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                        {review.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Replied Negative / Average Reviews */}
        <div>
          <div className="flex items-center gap-2 mb-4 bg-orange-50 px-4 py-3 rounded-lg">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Replied Negative / Average Reviews</h3>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer<br/>Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Review</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Your Reply</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {repliedNegativeReviews.map((review, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{review.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{review.review}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{review.yourReply}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{review.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-md text-xs font-semibold">
                        {review.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reviews;
