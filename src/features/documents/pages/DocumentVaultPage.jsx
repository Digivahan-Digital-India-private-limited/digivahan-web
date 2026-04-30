import React from "react";
import { Download, Eye, FileText, Upload } from "lucide-react";

const docs = [
  { id: "d1", name: "RC Certificate.pdf", type: "Vehicle Document", updatedAt: "09 Apr 2026" },
  { id: "d2", name: "Insurance Policy.pdf", type: "Insurance", updatedAt: "05 Apr 2026" },
  { id: "d3", name: "PUC Certificate.pdf", type: "Compliance", updatedAt: "01 Apr 2026" },
];

const DocumentVaultPage = () => {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Document Vault</h2>
            <p className="text-sm text-slate-500">Store and access important vehicle and identity documents securely.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Upload size={15} />
            Upload
          </button>
        </div>
      </section>

      <section className="space-y-3">
        {docs.map((doc) => (
          <article key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <FileText size={17} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{doc.name}</h3>
                  <p className="text-xs text-slate-500">{doc.type}</p>
                  <p className="text-xs text-slate-400">Updated: {doc.updatedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Eye size={15} />
                </button>
                <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Download size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default DocumentVaultPage;
