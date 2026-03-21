import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { ArrowLeft, MessageSquare, Search, Send, UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const STORAGE_KEY = "digivahanConcerns";
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const API_TO_UI_STATUS = {
  PENDING: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

const mapApiConcernToUiConcern = (item) => {
  if (!item) return null;

  const apiStatus = String(item.status || "").toUpperCase();

  return {
    id: item._id,
    name: item.user_id?.name || item.name || "Unknown User",
    contactInfo: item.user_id?.phoneNumber || item.phoneNumber || "",
    concernCategory: item.category || "",
    issueDescription: item.issueDescription || "",
    supportingDocs: Array.isArray(item.incidentProof) ? item.incidentProof.join(", ") : "",
    status: API_TO_UI_STATUS[apiStatus] || item.status || "Open",
    createdAt: item.createdAt,
    chat: item.conversation || [],
  };
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const ConcernChat = () => {
  const navigate = useNavigate();
  const { concernId } = useParams();
  const isSingleConcernMode = Boolean(concernId);

  const [concerns, setConcerns] = useState(() =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
  );
  const [searchToken, setSearchToken] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    const syncConcerns = () => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setConcerns(stored);
    };
    window.addEventListener("storage", syncConcerns);

    return () => {
      window.removeEventListener("storage", syncConcerns);
    };
  }, []);

  const filteredConcerns = useMemo(() => {
    const query = searchToken.trim().toLowerCase();
    if (!query) return concerns;

    return concerns.filter((item) => {
      const token = item.id?.toLowerCase() || "";
      const name = item.name?.toLowerCase() || "";
      return token.includes(query) || name.includes(query);
    });
  }, [concerns, searchToken]);

  const visibleConcerns = useMemo(() => {
    if (isSingleConcernMode) {
      return concerns.filter((item) => item.id === concernId);
    }
    return filteredConcerns;
  }, [isSingleConcernMode, concerns, concernId, filteredConcerns]);

  const activeConcern = useMemo(
    () => concerns.find((item) => item.id === concernId) || null,
    [concerns, concernId],
  );

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeConcern?.id, activeConcern?.chat?.length]);

  const persistConcerns = (updatedConcerns) => {
    setConcerns(updatedConcerns);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConcerns));
  };

  const openConcernChat = (id) => {
    navigate(`/concern-chat-admin/${id}`);
  };

  const handleSendAdminMessage = async () => {
    if (!concernId) {
      toast.error("Please select a concern token first.");
      return;
    }

    if (!activeConcern) return;
    const text = chatInput.trim();

    if (!text) {
      toast.error("Please type a message.");
      return;
    }

    if (isSending) return;

    try {
      setIsSending(true);

      const response = await axios.put(
        `${BASE_URL}/api/concern/conversation/${concernId}`,
        {
          sender: "admin",
          message: text,
        },
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.error || "Failed to send chat message.");
      }

      const updatedConcernFromApi = mapApiConcernToUiConcern(response?.data?.data);

      const updated = updatedConcernFromApi
        ? concerns.map((item) => (item.id === concernId ? updatedConcernFromApi : item))
        : concerns.map((item) =>
            item.id === concernId
              ? {
                  ...item,
                  chat: [
                    ...(item.chat || []),
                    {
                      id: `msg-${Date.now()}`,
                      sender: "admin",
                      message: text,
                      sentAt: new Date().toISOString(),
                    },
                  ],
                }
              : item,
          );

      persistConcerns(updated);
      setChatInput("");
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Failed to send chat message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-slate-100 via-white to-indigo-50 p-5 md:p-8">
      <div className="max-w-350 mx-auto">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-blue-600" /> Concern Chat
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(concernId ? `/manage-concerns/${concernId}` : "/manage-concerns")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-sm text-slate-500">Active Tokens: {concerns.length}</span>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isSingleConcernMode ? "" : "xl:grid-cols-3"} gap-5`}>
          {!isSingleConcernMode && (
            <div className="xl:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-md p-4">
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  placeholder="Search by token or name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-blue-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 max-h-[68vh] overflow-y-auto pr-1">
                {visibleConcerns.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center border border-dashed border-slate-300 rounded-lg p-4">
                    No concern token found.
                  </p>
                ) : (
                  visibleConcerns.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openConcernChat(item.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        concernId === item.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <p className="font-semibold text-slate-800 truncate">{item.name || "Unknown User"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Token: {item.id}</p>
                      <p className="text-xs text-slate-500 mt-1">Status: {item.status || "Open"}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <div className={`${isSingleConcernMode ? "" : "xl:col-span-2"} bg-white rounded-2xl border border-slate-200 shadow-md p-4`}>
            {!activeConcern ? (
              <div className="h-[70vh] flex items-center justify-center text-slate-500 border border-dashed border-slate-300 rounded-xl">
                Select a concern token from the left list to open that exact chat.
              </div>
            ) : (
              <>
                <div className="border-b border-slate-200 pb-3 mb-4">
                  <p className="text-sm text-slate-500">Token ID</p>
                  <p className="font-semibold text-slate-800">{activeConcern.id}</p>
                  <p className="text-sm text-slate-600 mt-1">User: {activeConcern.name || "Unknown"}</p>
                </div>

                <div ref={chatScrollRef} className="h-[52vh] overflow-y-auto pr-2 space-y-3">
                  {(activeConcern.chat || []).length === 0 ? (
                    <p className="text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3">
                      No messages yet. User can chat using this token from Raise Concern page.
                    </p>
                  ) : (
                    activeConcern.chat.map((message) => {
                      const isAdmin = message.sender === "admin";
                      const displayText = message.text || message.message || "";
                      const messageTime = message.sentAt || message.time || message.createdAt;

                      return (
                        <div
                          key={message.id}
                          className={`max-w-[85%] p-3 rounded-xl border ${
                            isAdmin
                              ? "ml-auto bg-blue-100 border-blue-200 text-blue-900"
                              : "mr-auto bg-emerald-100 border-emerald-200 text-emerald-900"
                          }`}
                        >
                          <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                            <UserRound className="w-3.5 h-3.5" /> {isAdmin ? "Admin" : "User"}
                          </p>
                          <p className="text-sm">{displayText}</p>
                          <p className="text-[11px] opacity-70 mt-1">{formatDate(messageTime)}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendAdminMessage();
                      }
                    }}
                    placeholder="Reply to user..."
                    className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendAdminMessage}
                    disabled={isSending}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" /> {isSending ? "Sending..." : "Send"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConcernChat;
