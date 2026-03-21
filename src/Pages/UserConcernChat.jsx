import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MessageSquare, Search, Send, ShieldAlert, Ticket } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const STORAGE_KEY = "digivahanConcerns";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const normalizeMessage = (message, index) => {
  const sender = String(message?.sender || "user").toLowerCase();
  return {
    id: message?.id || `msg-${index}-${Date.now()}`,
    sender,
    text: message?.text || message?.message || "",
    time: message?.time || message?.sentAt || message?.createdAt || new Date().toISOString(),
  };
};

const getStoredConcerns = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const UserConcernChat = () => {
  const navigate = useNavigate();
  const { tokenId = "" } = useParams();

  const [searchToken, setSearchToken] = useState(tokenId);
  const [concerns, setConcerns] = useState(() => getStoredConcerns());
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    const syncConcerns = () => {
      setConcerns(getStoredConcerns());
    };

    window.addEventListener("storage", syncConcerns);

    return () => {
      window.removeEventListener("storage", syncConcerns);
    };
  }, []);

  useEffect(() => {
    setSearchToken(tokenId);
  }, [tokenId]);

  const activeToken = useMemo(() => {
    const current = (tokenId || searchToken || "").trim();
    return current || "";
  }, [tokenId, searchToken]);

  const concern = useMemo(() => {
    if (!activeToken) return null;
    return concerns.find((item) => item.id === activeToken) || null;
  }, [concerns, activeToken]);

  const messages = useMemo(() => {
    if (!concern?.chat) return [];
    return concern.chat.map(normalizeMessage).filter((item) => item.text);
  }, [concern]);

  const handleTokenSearch = () => {
    const token = searchToken.trim();

    if (!token) {
      toast.error("Please enter your token ID.");
      return;
    }

    const matched = concerns.find((item) => item.id === token);

    if (!matched) {
      toast.error("No concern found for this token ID.");
      return;
    }

    navigate(`/concern-chat-user/${token}`);
  };

  const handleSend = () => {
    if (!concern) {
      toast.error("Please open a valid token first.");
      return;
    }

    const text = userMessage.trim();
    if (!text) {
      toast.error("Please type a message.");
      return;
    }

    const nextMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toISOString(),
    };

    const updatedConcerns = concerns.map((item) =>
      item.id === concern.id
        ? {
            ...item,
            chat: [...(item.chat || []), nextMessage],
          }
        : item,
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConcerns));
    setConcerns(updatedConcerns);
    setUserMessage("");
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-slate-100 via-white to-indigo-100 p-4 sm:p-6 md:p-10">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-fade-in { animation: fadeIn 0.45s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.45s ease-out forwards; }
        .animate-floating { animation: floating 2.8s ease-in-out infinite; }
      `}</style>

      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="rounded-3xl border border-indigo-100 bg-white/90 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="px-5 sm:px-7 py-5 bg-linear-to-r from-indigo-600 to-blue-600 text-white">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 grid place-items-center animate-floating">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight">Concern Support Chat</h1>
                  <p className="text-indigo-100 text-sm">Track your concern and chat with admin using token ID</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/Raise-concern-page")}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <aside className="lg:col-span-4 border-r border-slate-100 p-5 sm:p-6 bg-linear-to-b from-indigo-50/70 to-white">
              <div className="space-y-4 animate-slide-in">
                <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Open your token chat</p>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchToken}
                      onChange={(e) => setSearchToken(e.target.value)}
                      placeholder="Enter token ID"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTokenSearch}
                    className="w-full mt-3 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    <Ticket className="w-4 h-4" /> Open Chat
                  </button>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                  <p className="text-sm text-indigo-900 leading-relaxed">
                    Keep your token safe. All updates and admin messages for this concern are linked to your token ID.
                  </p>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-8 p-4 sm:p-6">
              {!concern ? (
                <div className="h-[55vh] min-h-90 rounded-2xl border border-dashed border-slate-300 grid place-items-center text-center px-6">
                  <div>
                    <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-slate-700">No active concern found</h2>
                    <p className="text-slate-500 mt-2">Enter a valid token ID and click Open Chat to view admin messages.</p>
                  </div>
                </div>
              ) : (
                <div className="h-[68vh] min-h-105 flex flex-col rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-4 sm:px-5 py-4 border-b border-slate-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs text-slate-500">Token ID</p>
                        <p className="text-sm sm:text-base font-bold text-slate-800 break-all">{concern.id}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                        {concern.status || "Open"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-linear-to-b from-slate-50 to-white space-y-3">
                    {messages.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                        No messages yet. Admin updates will appear here for this concern.
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isAdmin = message.sender === "admin";
                        return (
                          <div
                            key={message.id}
                            className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-3 border shadow-xs animate-fade-in ${
                              isAdmin
                                ? "mr-auto bg-blue-50 border-blue-200 text-blue-950"
                                : "ml-auto bg-emerald-50 border-emerald-200 text-emerald-950"
                            }`}
                          >
                            <p className="text-xs font-semibold mb-1 opacity-90">{isAdmin ? "Admin" : "You"}</p>
                            <p className="text-sm leading-relaxed wrap-break-word">{message.text}</p>
                            <p className="text-[11px] opacity-65 mt-1">{formatDate(message.time)}</p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSend();
                        }}
                        placeholder="Write message to admin..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleSend}
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                      >
                        <Send className="w-4 h-4" /> Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserConcernChat;
