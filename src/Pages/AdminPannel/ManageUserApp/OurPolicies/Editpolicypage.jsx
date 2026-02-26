import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const Editpolicypage = () => {
  const navigate = useNavigate();
  const { title } = useParams();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back */}
      <button
        onClick={() => navigate("/our-policies")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        ← Back to Policies
      </button>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600 mb-4">
        Last updated: {new Date().toLocaleString()}
      </p>

      {/* Textarea */}
      <textarea
        className="w-full h-96 p-4 border border-gray-200 rounded-lg outline-none text-gray-700"
        placeholder="Enter policy content here..."
      ></textarea>

      {/* Button */}
      <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Update Policy
      </button>
    </div>
  );
};

export default Editpolicypage;
