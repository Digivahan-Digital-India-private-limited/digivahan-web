import React from "react";
import { useNavigate } from "react-router-dom";

const ManageUserApp = () => {
  const navigate = useNavigate();

  const handlePage = (path) => {
    navigate(path);
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Manage User App
          </h1>
          <p className="text-gray-600">
            Configure and manage user-facing app content
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Update Policies */}
          <div
            onClick={() => handlePage("/our-policies")}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-blue-500 p-6"
          >
            <div className="bg-blue-500 w-16 h-16 rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Update Policies
            </h3>
            <p className="text-sm text-gray-600">
              Manage Terms, Privacy, Data Protection, and Refund policies
            </p>
          </div>

          {/* Update Fuel Price */}
          <div
            onClick={() => handlePage("/fuel-Price")}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-orange-500 p-6"
          >
            <div className="bg-orange-500 w-16 h-16 rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Update Fuel Price
            </h3>
            <p className="text-sm text-gray-600">
              Update state-wise CNG, Petrol, and Diesel prices
            </p>
          </div>

          {/* Manage Top Trending Cars */}
          <div
            onClick={() => handlePage("/manage-tranding-car")}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-green-500 p-6"
          >
            <div className="bg-green-500 w-16 h-16 rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manage Top Trending Cars
            </h3>
            <p className="text-sm text-gray-600">
              Add, update, delete, or view trending cars
            </p>
          </div>

          {/* Manage Popular Comparison */}
          <div
            onClick={() => handlePage("/manage-popular-comparision")}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-purple-500 p-6"
          >
            <div className="bg-purple-500 w-16 h-16 rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manage Popular Comparison
            </h3>
            <p className="text-sm text-gray-600">
              Create and manage car comparisons
            </p>
          </div>

          {/* Manage Tips Info */}
          <div
            onClick={() => handlePage("/manage-tips-info")}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-orange-600 p-6"
          >
            <div className="bg-orange-600 w-16 h-16 rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manage Tips Info
            </h3>
            <p className="text-sm text-gray-600">
              Update helpful tips for users
            </p>
          </div>

          {/* Manage News */}
          <div
            onClick={() => handlePage("/manage-news")}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-cyan-500 p-6"
          >
            <div className="bg-cyan-500 w-16 h-16 rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manage News
            </h3>
            <p className="text-sm text-gray-600">
              Add and manage automotive news
            </p>
          </div>

          {/* Manage QR Guide */}
          <div
            onClick={() => handlePage("/manage-qr-guide")}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-pink-500 p-6"
          >
            <div className="bg-pink-500 w-16 h-16 rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manage QR Guide
            </h3>
            <p className="text-sm text-gray-600">Update QR code usage guides</p>
          </div>

          {/* Manage QR Benefits */}
          <div
            onClick={() => handlePage("/manage-qr-benefits")}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-teal-500 p-6"
          >
            <div className="bg-teal-500 w-16 h-16 rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manage QR Benefits
            </h3>
            <p className="text-sm text-gray-600">Highlight QR code benefits</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManageUserApp;
