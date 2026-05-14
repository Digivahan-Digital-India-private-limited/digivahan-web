import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeViewer = ({ value, label }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-2xl border border-slate-200 p-4">
          <QRCodeCanvas value={value} size={220} includeMargin />
        </div>
        <div className="text-center">
          <h2 className="text-base font-semibold text-slate-900">{label}</h2>
          <p className="text-sm text-slate-500">{value}</p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Download QR
        </button>
      </div>
    </section>
  );
};

export default QRCodeViewer;
