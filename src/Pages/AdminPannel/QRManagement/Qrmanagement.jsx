import React from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { QrCode } from "lucide-react";
import { MdBlockFlipped } from "react-icons/md";
import SalesPersonProfile from "./SalesPersonProfile";

const SalesPersonInfo = [
  {
    id: 1,
    full_name: "Rahul Kumar",
    SP: 104,
    QR_Assigned: 47,
  },
  {
    id: 2,
    full_name: "Amit Sharma",
    SP: 98,
    QR_Assigned: 52,
  },
  {
    id: 3,
    full_name: "Pankaj Verma",
    SP: 120,
    QR_Assigned: 63,
  },
  {
    id: 4,
    full_name: "Rohit Singh",
    SP: 87,
    QR_Assigned: 39,
  },
  {
    id: 5,
    full_name: "Suresh Yadav",
    SP: 110,
    QR_Assigned: 58,
  },
  {
    id: 6,
    full_name: "Ankit Mishra",
    SP: 95,
    QR_Assigned: 44,
  },
  {
    id: 7,
    full_name: "Vikash Gupta",
    SP: 132,
    QR_Assigned: 71,
  },
  {
    id: 8,
    full_name: "Deepak Pandey",
    SP: 76,
    QR_Assigned: 33,
  },
  {
    id: 9,
    full_name: "Manish Tiwari",
    SP: 101,
    QR_Assigned: 49,
  },
  {
    id: 10,
    full_name: "Neeraj Patel",
    SP: 89,
    QR_Assigned: 41,
  },
];

const Qrmanagement = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full h-screen overflow-y-auto bg-white md:p-5 p-2">
      <h1 className="text-2xl  text-gray-900">QR Management</h1>
      <p className="text-sm text-gray-600">
        Manage and monitor QR code allocation
      </p>

      {/* ----------------- ROW 1 ----------------- */}
      <div className="flex gap-5">
        {/* Card 1 - Assigned QR Codes */}
        <div> 
          <div
            onClick={() => navigate("/check-assigned-qr")}
            className="relative bg-blue-200 h-28 w-125 rounded-lg border border-gray-300 mt-5 p-4 cursor-pointer"
          >
            <p className="text-gray-600 text-sm">Assigned QR Codes</p>

            <div className="flex flex-row gap-2 mt-2">
              <p className="text-3xl font-semibold">487</p>
              <p className="text-green-400 text-sm mt-2">~12%</p>
            </div>

            <div className="absolute top-4 right-4 bg-white h-12 w-12 rounded-full flex items-center justify-center shadow">
              <QrCode className="text-gray-700 text-xl" />
            </div>
          </div>
        </div>

        {/* Card 2 - Blocked QR Codes */}
        <div
          onClick={() => navigate("/check-blocked-qr")}
          className="relative bg-pink-200 h-28 w-125 rounded-lg border border-gray-300 mt-5 p-4"
        >
          <p className="text-gray-600 text-sm">Blocked QR Codes</p>

          <div className="flex flex-row gap-2 mt-2">
            <p className="text-3xl font-semibold">23</p>
            <p className="text-red-400 text-sm mt-2">~5%</p>
          </div>

          <div className="absolute top-4 right-4 bg-white h-12 w-12 rounded-full flex items-center justify-center shadow">
            <MdBlockFlipped className="text-gray-700 text-xl" />
          </div>
        </div>
      </div>

      {/* ----------------- ROW 2 ----------------- */}
      <div className="flex gap-5">
        {/* Card 3 - Total Unassigned QR Codes */}
        <div className="relative bg-yellow-100 h-28 w-125 rounded-lg border border-gray-300 mt-5 p-4">
          <p className="text-gray-600 text-sm">Total Unassigned QR Codes</p>

          <div className="flex flex-row gap-2 mt-2">
            <p className="text-3xl font-semibold">145</p>
          </div>

          <div className="absolute top-4 right-4 bg-white h-12 w-12 rounded-full flex items-center justify-center shadow">
            <QrCode className="text-gray-700 text-xl" />
          </div>
        </div>

        {/* Card 4 - QR Not Allotted to Sales Persons */}
        <div
          onClick={() => navigate("/allotted-qr-code")}
          className="relative bg-orange-200 h-28 w-125 rounded-lg border border-gray-300 mt-5 p-4"
        >
          <p className="text-gray-600 text-sm">
            QR Not Allotted to Sales Persons
          </p>

          <div className="flex flex-row gap-2 mt-2">
            <p className="text-3xl font-semibold">68</p>
          </div>

          <div className="absolute top-4 right-4 bg-white h-12 w-12 rounded-full flex items-center justify-center shadow">
            <Users className="text-gray-700 text-xl" />
          </div>
        </div>
      </div>
      <h1 className="text-xl  text-gray-900 mt-3">
        Sales Person QR Allocation Summary
      </h1>
      <p className="text-sm text-gray-600">
        View QR code distribution across sales team
      </p>

      {/* many cards secction */}

      <div className="grid grid-cols-4 gap-4 mt-3">
        {/* Card 1 - Rahul Sharma */}
        {SalesPersonInfo?.map((data) => (
          <SalesPersonProfile key={data.id} info={data} />
        ))}
      </div>
    </main>
  );
};

export default Qrmanagement;
