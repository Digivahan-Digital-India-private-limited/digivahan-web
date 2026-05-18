import React from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const CustomerQueries = () => {
  const navigate = useNavigate();
  // FAQ Management actions
  const faqActions = [
    {
      id: 1,
      icon: Plus,
      title: "Post FAQ",
      description: "Add a new frequently asked question",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      iconBg: "bg-blue-500",
      iconColor: "text-white",
    },
    {
      id: 2,
      icon: Trash2,
      title: "Delete FAQ",
      description: "Remove an existing FAQ from system",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      iconBg: "bg-red-500",
      iconColor: "text-white",
    },
    {
      id: 3,
      icon: Edit,
      title: "Update FAQ",
      description: "Modify existing FAQ content",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      iconBg: "bg-green-500",
      iconColor: "text-white",
    },
  ];

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
          setQueries(response.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch queries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const getCount = (title) => {
    // Map frontend titles to backend query_types
    // In Contactpage.jsx we send "Contact Form"
    const pendingQueries = queries.filter(q => q.status !== "Completed");
    if (title === "General Information Queries") {
      return pendingQueries.filter(q => q.query_type === "General" || q.query_type === "Contact Form" || !q.query_type).length;
    }
    const typeMap = {
      "Technical Queries": "Technical",
      "Account Related": "Account",
      "Payment / Billing": "Payment",
      "Order / Service Status": "Order Status",
      "Product / Service Complaints": "Product",
      "Feedback & Suggestions": "Support", // fallback
      "Cancellation / Return": "Billing", // fallback
    };
    const mappedType = typeMap[title] || title;
    return pendingQueries.filter(q => q.query_type === mappedType).length;
  };

  // Customer Query Categories
  const queryCategories = [
    {
      id: 1,
      title: "General Information Queries",
      description: "Basic questions about services and features",
      pending: getCount("General Information Queries"),
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      iconBg: "bg-blue-500",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-600",
    },
    {
      id: 2,
      title: "Technical Queries",
      description: "Technical issues and troubleshooting",
      pending: getCount("Technical Queries"),
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      iconBg: "bg-purple-500",
      badgeBg: "bg-purple-100",
      badgeText: "text-purple-600",
    },
    {
      id: 3,
      title: "Account Related",
      description: "Profile, settings and account management",
      pending: getCount("Account Related"),
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-300",
      iconBg: "bg-cyan-500",
      badgeBg: "bg-cyan-100",
      badgeText: "text-cyan-600",
    },
    {
      id: 4,
      title: "Payment / Billing",
      description: "Payment issues and billing queries",
      pending: getCount("Payment / Billing"),
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-300",
      iconBg: "bg-emerald-500",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-600",
    },
    {
      id: 5,
      title: "Order / Service Status",
      description: "Track orders and service requests",
      pending: getCount("Order / Service Status"),
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      iconBg: "bg-orange-500",
      badgeBg: "bg-orange-100",
      badgeText: "text-orange-600",
    },
    {
      id: 6,
      title: "Product / Service Complaints",
      description: "Quality issues and complaints",
      pending: getCount("Product / Service Complaints"),
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      iconBg: "bg-red-500",
      badgeBg: "bg-red-100",
      badgeText: "text-red-600",
    },
    {
      id: 7,
      title: "Feedback & Suggestions",
      description: "Customer feedback and improvement ideas",
      pending: getCount("Feedback & Suggestions"),
      bgColor: "bg-pink-50",
      borderColor: "border-pink-300",
      iconBg: "bg-pink-500",
      badgeBg: "bg-pink-100",
      badgeText: "text-pink-600",
    },
    {
      id: 8,
      title: "Cancellation / Return",
      description: "Cancellation and return requests",
      pending: getCount("Cancellation / Return"),
      bgColor: "bg-amber-50",
      borderColor: "border-amber-300",
      iconBg: "bg-amber-500",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-600",
    },
    {
      id: 9,
      title: "Escalation",
      description: "Escalated issues requiring attention",
      pending: getCount("Escalation"),
      bgColor: "bg-rose-50",
      borderColor: "border-rose-300",
      iconBg: "bg-rose-600",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-600",
    },
    {
      id: 10,
      title: "Onboarding / Setup",
      description: "Help with getting started",
      pending: getCount("Onboarding / Setup"),
      bgColor: "bg-teal-50",
      borderColor: "border-teal-300",
      iconBg: "bg-teal-500",
      badgeBg: "bg-teal-100",
      badgeText: "text-teal-600",
    },
    {
      id: 11,
      title: "Subscription",
      description: "Subscription plans and renewals",
      pending: getCount("Subscription"),
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-300",
      iconBg: "bg-indigo-500",
      badgeBg: "bg-indigo-100",
      badgeText: "text-indigo-600",
    },
    {
      id: 12,
      title: "Verification Queries",
      description: "Identity and account verification",
      pending: getCount("Verification Queries"),
      bgColor: "bg-lime-50",
      borderColor: "border-lime-300",
      iconBg: "bg-lime-500",
      badgeBg: "bg-lime-100",
      badgeText: "text-lime-600",
    },
  ];

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

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Customer Queries
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Manage FAQs and customer support queries
        </p>
      </div>

      {/* FAQ Management Section */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
          FAQ Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {faqActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => {
                  if (action.id === 1) navigate("/post-faq");
                  else if (action.id === 2) navigate("/delete-faq");
                  else if (action.id === 3) navigate("/update-faq");
                }}
                className={`${action.bgColor} border-l-4 ${action.borderColor} rounded-xl p-5 md:p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] shadow-sm`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`${action.iconBg} ${action.iconColor} w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Queries by Category Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
          Customer Queries by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
          {queryCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => {
                if (category.id === 1) navigate("/general-information-queries");
                else if (category.id === 2) navigate("/technical-queries");
                else if (category.id === 3) navigate("/account-related");
                else if (category.id === 4) navigate("/payment-billing");
                else if (category.id === 5) navigate("/order-service-status");
                else if (category.id === 6) navigate("/product-service-complaints");
                else if (category.id === 7) navigate("/feedback-suggestions");
                else if (category.id === 8) navigate("/cancellation-return");
                else if (category.id === 9) navigate("/escalation");
                else if (category.id === 10) navigate("/onboarding-setup");
                else if (category.id === 11) navigate("/subscription");
                else if (category.id === 12) navigate("/verification-queries");
              }}
              className={`${category.bgColor} border-l-4 ${category.borderColor} rounded-xl p-5 md:p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] relative shadow-sm`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`${category.iconBg} w-12 h-12 md:w-14 md:h-14 rounded-full shrink-0`}
                ></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
                      {category.title}
                    </h3>
                    <span
                      className={`${category.badgeBg} ${category.badgeText} px-3 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap`}
                    >
                      {category.pending} pending
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CustomerQueries;
