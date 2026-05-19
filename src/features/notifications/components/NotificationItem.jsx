import React from "react";
import { Bell, ShieldAlert, TriangleAlert } from "lucide-react";

const typeMap = {
  info: { Icon: Bell, color: "text-emerald-600 bg-emerald-50" },
  warning: { Icon: TriangleAlert, color: "text-amber-700 bg-amber-50" },
  critical: { Icon: ShieldAlert, color: "text-rose-600 bg-rose-50" },
};

const NotificationItem = ({ notification, onMarkRead, disabled }) => {
  const { Icon, color } = typeMap[notification.type] || typeMap.info;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full ${color}`}>
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{notification.title}</h3>
            {notification.unread && <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />}
          </div>
          <p className="mt-1 text-sm text-slate-600">{notification.description}</p>
          {notification.vehicleId && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              Vehicle: <span className="uppercase text-slate-950 font-bold">{notification.vehicleId}</span>
            </div>
          )}
          {notification.incidentProof && notification.incidentProof.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {notification.incidentProof.map((imgUrl, index) => (
                <a
                  key={index}
                  href={imgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative h-20 w-28 overflow-hidden rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:ring-2 hover:ring-emerald-100 transition"
                >
                  <img
                    src={imgUrl}
                    alt={`Incident proof ${index + 1}`}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition duration-150">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">View Image</span>
                  </div>
                </a>
              ))}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">{notification.time}</p>
            {notification.unread && (
              <button
                type="button"
                onClick={() => onMarkRead?.(notification.id)}
                disabled={disabled}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default NotificationItem;
