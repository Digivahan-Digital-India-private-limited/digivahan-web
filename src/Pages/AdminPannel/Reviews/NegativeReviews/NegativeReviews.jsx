import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NegativeReviews = () => {
  const navigate = useNavigate();

  // Sample data - replace with actual API data
  const [reviews] = useState([
    {
      customerId: 'CU-3456',
      customerName: 'Aman Singh',
      review: 'Product ki quality achhi nahi hai.',
      rating: 1
    },
    {
      customerId: 'CU-7890',
      customerName: 'Kavita Sharma',
      review: 'Very poor support.',
      rating: 2
    }
  ]);

  const handleReply = (review) => {
    navigate('/admin/reviews/reply', { state: { reviewData: review } });
  };

  return (
    <div className="p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/reviews')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Negative Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">Sorted by priority (most critical first)</p>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Review</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-blue-600 font-medium">{review.customerId}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{review.customerName}</td>
                  <td className="px-6 py-4 text-gray-700">{review.review}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-100 rounded-lg w-fit">
                      <span className="text-gray-800 font-semibold">{review.rating}</span>
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleReply(review)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                      </svg>
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NegativeReviews;
