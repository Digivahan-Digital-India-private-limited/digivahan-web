import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const GeneralInformationQueries = () => {
  const navigate = useNavigate();

  const [queries, setQueries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = Cookies.get("admin_token");
        const response = await axios.get(`${BASE_URL}/api/admin/get-all-query`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data?.success) {
          const allQueries = response.data.data || [];
          // Filter for General or Contact Form
          const filtered = allQueries.filter(q => 
            q.query_type === "General" || 
            q.query_type === "Contact Form" || 
            !q.query_type
          );
          setQueries(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch general queries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <main className="w-full min-h-screen overflow-y-auto bg-white md:p-6 p-3">
      {/* Top Header - Search & User */}
      <header className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">ðŸ”</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-xl">
            ðŸ””
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              1
            </span>
          </button>
          <span className="text-gray-700">ðŸ‘¤ Admin User</span>
        </div>
      </header>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate("/customer-queries")}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              General Information Queries
            </h1>
            <p className="text-sm text-gray-600">Total queries: {queries.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Customer ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Question Asked
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {queries.map((query) => (
                <tr key={query.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {query.first_name} {query.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                    {query.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {query.query}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(query.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate('/customer-queries/reply', { state: { query } })}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default GeneralInformationQueries;



