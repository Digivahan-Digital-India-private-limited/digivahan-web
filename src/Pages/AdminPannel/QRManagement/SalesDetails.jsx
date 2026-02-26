import React from "react";
import { ArrowLeft, Mail, Phone, TrendingUp } from "lucide-react";

const SalesDetails = () => {
  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-50 p-6">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to QR Management</span>
      </button>
      {/* Sales Person Profile */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Sales Person Profile
        </h2>

        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Details */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Name</p>
              <p className="text-base font-semibold text-gray-900">
                Rahul Sharma
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Contact Number</p>
              <div className="flex items-center gap-2 text-gray-900">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Sales Person ID</p>
              <p className="text-sm font-medium text-gray-900">SP-105</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Department</p>
              <p className="text-sm font-medium text-gray-900">
                Sales & Marketing
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Email Address</p>
              <div className="flex items-center gap-2 text-gray-900">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">rahul.sharma@company.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Performance Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          QR Performance Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Completion Rate */}
          <div className="flex flex-col items-center">
            {/* Semi Circle Progress */}
            <div className="relative w-48 h-24 mb-4">
              <svg className="w-full h-full" viewBox="0 0 200 100">
                {/* Background Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                {/* Progress Arc - 53% */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset="118"
                />
              </svg>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">53%</p>
            <p className="text-sm text-gray-500">Completion Rate</p>

            {/* Stats Below */}
            <div className="grid grid-cols-2 gap-4 mt-6 w-full">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">80</p>
                <p className="text-xs text-gray-600 mt-1">Total Assigned</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">42</p>
                <p className="text-xs text-gray-600 mt-1">Total Sold</p>
              </div>
            </div>
          </div>

          {/* Right Side - Stats Cards */}
          <div className="flex flex-col gap-4">
            {/* Best Performance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-700 mb-1">
                    Best Performance
                  </p>
                  <p className="text-lg font-semibold text-green-900">
                    November 2025
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>

            {/* Average Sales */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-700 mb-1">
                Average Sales Per Month
              </p>
              <p className="text-lg font-semibold text-blue-900">14 QR Codes</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-xs text-purple-700 mb-1">
                Total Revenue Generated
              </p>
              <p className="text-lg font-semibold text-purple-900">₹2,45,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Last 3 Month Sales Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Last 3 Month Sales Activity
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Track monthly performance trends
        </p>

        {/* Chart */}
        <div className="relative h-64 mb-6">
          <svg className="w-full h-full" viewBox="0 0 800 250">
            {/* Grid Lines */}
            {[0, 5, 10, 15, 20].map((value, i) => (
              <g key={i}>
                <line
                  x1="60"
                  y1={230 - value * 10}
                  x2="780"
                  y2={230 - value * 10}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x="40"
                  y={235 - value * 10}
                  fontSize="12"
                  fill="#6B7280"
                  textAnchor="end"
                >
                  {value}
                </text>
              </g>
            ))}

            {/* Line Chart */}
            <polyline
              points="120,110 400,50 680,110"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
            />

            {/* Data Points */}
            <circle cx="120" cy="110" r="6" fill="#3B82F6" />
            <circle cx="400" cy="50" r="6" fill="#3B82F6" />
            <circle cx="680" cy="110" r="6" fill="#3B82F6" />

            {/* X-axis Labels */}
            <text
              x="120"
              y="250"
              fontSize="14"
              fill="#6B7280"
              textAnchor="middle"
            >
              October
            </text>
            <text
              x="400"
              y="250"
              fontSize="14"
              fill="#6B7280"
              textAnchor="middle"
            >
              November
            </text>
            <text
              x="680"
              y="250"
              fontSize="14"
              fill="#6B7280"
              textAnchor="middle"
            >
              December
            </text>
          </svg>
        </div>

        {/* Month Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600 mt-1">October Sales</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
            <p className="text-2xl font-bold text-green-600">18</p>
            <p className="text-sm text-gray-600 mt-1">November Sales</p>
            <p className="text-xs text-green-600 mt-1 font-medium">
              ↑ Best Month
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600 mt-1">December Sales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDetails;
