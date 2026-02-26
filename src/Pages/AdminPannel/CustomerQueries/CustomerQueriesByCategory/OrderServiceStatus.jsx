import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";

const OrderServiceStatus = () => {
  const navigate = useNavigate();
  const queries = [
    { id: 1, customerName: "Rakesh Kumar", customerId: "CU-5932", question: "App crash ho raha hai jab main payment karta hoon", dateTime: "23 Dec, 3:45 PM" },
    { id: 2, customerName: "Priya Sharma", customerId: "CU-5845", question: "Mera order kahan hai? Tracking nahi dikh raha", dateTime: "23 Dec, 2:30 PM" },
    { id: 3, customerName: "Amit Verma", customerId: "CU-5723", question: "Password reset link nahi aa raha email pe", dateTime: "23 Dec, 1:15 PM" },
    { id: 4, customerName: "Neha Patel", customerId: "CU-5654", question: "Refund kab milega? Already 5 days ho gaye", dateTime: "23 Dec, 11:20 AM" },
    { id: 5, customerName: "Suresh Reddy", customerId: "CU-5598", question: "Premium subscription activate nahi ho raha", dateTime: "23 Dec, 10:05 AM" },
  ];
  return (
    <main className="w-full min-h-screen overflow-y-auto bg-white md:p-6 p-3">
      <header className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-1/2 relative">
          <input type="text" placeholder="Search..." className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <span className="absolute left-3 top-2.5 text-gray-400"></span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative text-xl"><span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">1</span></button>
          <span className="text-gray-700"> Admin User</span>
        </div>
      </header>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/customer-queries")} className="text-gray-600 hover:text-gray-900 transition"><ArrowLeft className="w-6 h-6" /></button>
          <div><h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Order / Service Status</h1><p className="text-sm text-gray-600">Total queries: {queries.length}</p></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr><th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer Name</th><th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer ID</th><th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Question Asked</th><th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th><th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {queries.map((query) => (
                <tr key={query.id} className="hover:bg-gray-50 transition"><td className="px-6 py-4 text-sm text-gray-900">{query.customerName}</td><td className="px-6 py-4 text-sm text-blue-600 font-medium">{query.customerId}</td><td className="px-6 py-4 text-sm text-gray-700">{query.question}</td><td className="px-6 py-4 text-sm text-gray-600">{query.dateTime}</td><td className="px-6 py-4"><button onClick={() => navigate('/customer-queries/reply', { state: { query } })} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"><MessageSquare className="w-4 h-4" />Reply</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div></main>
  );
};
export default OrderServiceStatus;




