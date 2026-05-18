import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const GeneralInformationQueries = () => {
  const navigate = useNavigate();

  const [queries, setQueries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState(null); // 'single' or 'bulk'
  const [targetId, setTargetId] = React.useState(null);

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
      toast.error("Failed to fetch queries");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchQueries();
  }, []);

  const filteredQueries = queries.filter((q) => {
    const fullName = `${q.first_name} ${q.last_name}`.toLowerCase();
    const email = q.email.toLowerCase();
    const search = searchQuery.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredQueries.map(q => q._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const openDeleteModal = (type, id = null) => {
    setDeleteType(type);
    setTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteType === 'single') {
      await performSingleDelete(targetId);
    } else if (deleteType === 'bulk') {
      await performBulkDelete();
    }
    setShowDeleteModal(false);
  };

  const performSingleDelete = async (id) => {
    try {
      setIsDeleting(true);
      const token = Cookies.get("admin_token");
      const response = await axios.delete(`${BASE_URL}/api/admin/delete-query/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        toast.success("Query deleted successfully");
        setQueries(prev => prev.filter(q => q._id !== id));
        setSelectedIds(prev => prev.filter(itemId => itemId !== id));
      }
    } catch (error) {
      console.error("Error deleting query:", error);
      toast.error("Failed to delete query");
    } finally {
      setIsDeleting(false);
    }
  };

  const performBulkDelete = async () => {
    try {
      setIsDeleting(true);
      const token = Cookies.get("admin_token");
      const response = await axios.post(`${BASE_URL}/api/admin/delete-multiple-queries`, 
        { ids: selectedIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        toast.success(`${selectedIds.length} queries deleted successfully`);
        setQueries(prev => prev.filter(q => !selectedIds.includes(q._id)));
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error deleting multiple queries:", error);
      toast.error("Failed to delete selected queries");
    } finally {
      setIsDeleting(false);
    }
  };

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
    <main className="w-full min-h-screen overflow-y-auto bg-gray-50 md:p-6 p-3">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-center text-gray-600 mb-6">
                {deleteType === 'bulk' 
                  ? `Are you sure you want to delete ${selectedIds.length} selected queries? This action cannot be undone.` 
                  : "Are you sure you want to delete this query? This action cannot be undone."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header - Search & User */}
      <header className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search queries by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <div className="flex items-center gap-4">
          {selectedIds.length > 0 && (
            <button
              onClick={() => openDeleteModal('bulk')}
              disabled={isDeleting}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium flex items-center gap-2 border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button className="relative text-xl p-2 hover:bg-gray-100 rounded-full transition">
            🔔
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              1
            </span>
          </button>
          <div className="flex items-center gap-2 border-l pl-4">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-gray-700 font-medium">Admin User</span>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/customer-queries")}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition shadow-sm"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              General Information Queries
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Showing {filteredQueries.length} active inquiries
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={filteredQueries.length > 0 && selectedIds.length === filteredQueries.length}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Query
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading queries...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-10 h-10 text-gray-300" />
                      <p>{searchQuery ? "No matching queries found" : "No queries found"}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQueries.map((query) => (
                  <tr 
                    key={query._id} 
                    className={`${selectedIds.includes(query._id) ? 'bg-blue-50/50' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.includes(query._id)}
                        onChange={() => handleSelectItem(query._id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {query.first_name} {query.last_name}
                      </div>
                      <div className="text-xs text-gray-500">{query.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                      {query.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate" title={query.query}>
                        {query.query}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(query.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate('/customer-queries/reply', { state: { query } })}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Reply"
                        >
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal('single', query._id)}
                          disabled={isDeleting}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default GeneralInformationQueries;
