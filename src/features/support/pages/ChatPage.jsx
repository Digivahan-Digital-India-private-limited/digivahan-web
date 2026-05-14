import React, { useEffect, useRef, useState } from "react";
import { Circle, Send } from "lucide-react";

const initialMessages = [
  { id: 1, from: "support", text: "Hello! How can we help you today?", time: "10:00 AM" },
  { id: 2, from: "user", text: "I want help with my QR order tracking.", time: "10:01 AM" },
];

const ChatPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) {
      return;
    }

    node.scrollTop = node.scrollHeight;
  }, [messages]);

  const handleSend = (event) => {
    event?.preventDefault();

    const text = input.trim();
    if (!text) {
      return;
    }

    const next = {
      id: Date.now(),
      from: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, next]);
    setInput("");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Support Chat</h2>
        <p className="text-sm text-slate-500">Chat with DigiVahan support for account, vehicle, and QR help.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">DigiVahan Support</h3>
              <p className="text-xs text-slate-500">Classic live chat interface</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <Circle size={9} className="fill-emerald-500 text-emerald-500" />
              Agent Online
            </div>
          </div>
        </div>

        <div className="flex h-[64vh] min-h-96 flex-col bg-slate-50">
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  message.from === "user"
                    ? "ml-auto bg-emerald-600 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                <p>{message.text}</p>
                <p className={`mt-1 text-[11px] ${message.from === "user" ? "text-white/80" : "text-slate-400"}`}>
                  {message.time}
                </p>
              </article>
            ))}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your message"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
