import React from "react";
import { Car, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const navigate = useNavigate();

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

      {/* Header - Matching Figma */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
        <p className="text-gray-500 text-sm">Manage user reports and take action</p>
      </div>

        {/* Report Cards - Matching Figma design exactly */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle Owner Reports Card */}
          <div 
            onClick={() => navigate("/admin/reports/vehicle-owners")}
            className="bg-[#D4EDFC] rounded-2xl p-8 border-l-4 border-l-blue-500 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[160px]"
          >
            <div className="flex items-start justify-between h-full">
              <div className="flex flex-col justify-between h-full">
                <Car className="w-8 h-8 text-blue-600" />
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Vehicle Owner Reports</h3>
                  <p className="text-gray-500 text-sm mt-1">Reports filed against vehicle owners</p>
                </div>
              </div>
              <div className="text-6xl font-bold text-gray-900">24</div>
            </div>
          </div>

          {/* Interactor Reports Card */}
          <div 
            onClick={() => navigate("/admin/reports/interactors")}
            className="bg-[#F0E5FA] rounded-2xl p-8 border-l-4 border-l-purple-500 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[160px]"
          >
            <div className="flex items-start justify-between h-full">
              <div className="flex flex-col justify-between h-full">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Interactor Reports</h3>
                  <p className="text-gray-500 text-sm mt-1">Reports filed against interactors</p>
                </div>
              </div>
              <div className="text-6xl font-bold text-gray-900">18</div>
            </div>
          </div>
        </div>
    </main>
  );
};

export default Reports;
