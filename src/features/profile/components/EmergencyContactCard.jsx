import React from "react";
import { MessageSquare, Pencil, Phone, Trash2 } from "lucide-react";

const EmergencyContactCard = ({ contact, onEdit, onDelete, deleting }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={contact.avatar} alt={contact.name} className="h-12 w-12 rounded-full border border-slate-200 object-cover" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{contact.name}</h3>
            <p className="text-xs text-slate-500">{contact.relation}</p>
            <p className="text-xs text-slate-500">{contact.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
            <MessageSquare size={16} />
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(contact.id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Pencil size={16} />
          </button>
          <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
            <Phone size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(contact.id)}
            disabled={deleting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default EmergencyContactCard;
