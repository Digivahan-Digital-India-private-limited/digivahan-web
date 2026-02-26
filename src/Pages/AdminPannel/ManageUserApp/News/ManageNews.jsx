import React from "react";
import { ArrowLeft, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageNews = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/manage-user")}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Manage User App
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage News
          </h1>
          <p className="text-gray-600">
            Add, update, delete, or view automotive news
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add News */}
          <div
            onClick={() => navigate("")}
            className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-green-500"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-green-500 p-3 rounded-full">
                <Plus className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Add News
              </h3>
            </div>
            <p className="text-gray-600">Create a new news article</p>
          </div>

          {/* Update News */}
          <div
            onClick={() => navigate("")}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-blue-500"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-blue-500 p-3 rounded-full">
                <Edit className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Update News
              </h3>
            </div>
            <p className="text-gray-600">Modify existing news</p>
          </div>

          {/* Delete News */}
          <div
            onClick={() => navigate("")}
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-red-500"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-red-500 p-3 rounded-full">
                <Trash2 className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Delete News
              </h3>
            </div>
            <p className="text-gray-600">Remove a news article</p>
          </div>

          {/* Check All News */}
          <div
            onClick={() => navigate("")}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-purple-500 p-3 rounded-full">
                <Eye className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Check All News
              </h3>
            </div>
            <p className="text-gray-600">View all news articles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNews;
