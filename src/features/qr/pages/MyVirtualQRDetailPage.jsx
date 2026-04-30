import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVehicleById } from "../../vehicles/services/vehiclesApi";
import { getVehicleQr } from "../services/qrApi";
import QRCodeViewer from "../components/QRCodeViewer";

const MyVirtualQRDetailPage = () => {
  const { id } = useParams();

  const { data: vehicle } = useQuery({
    queryKey: ["user-vehicle", id],
    queryFn: () => getVehicleById(id),
    enabled: Boolean(id),
  });

  const { data: qrData } = useQuery({
    queryKey: ["vehicle-qr", id],
    queryFn: () => getVehicleQr(id),
    enabled: Boolean(id),
  });

  if (!vehicle || !qrData) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Loading virtual QR details...</div>;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Virtual QR Detail</h2>
        <p className="text-sm text-slate-500">{vehicle.name} • {vehicle.plate}</p>
      </section>

      <QRCodeViewer value={qrData.value} label="Vehicle QR" />

      <Link to="/virtual-qr" className="inline-block rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        Back to QR List
      </Link>
    </div>
  );
};

export default MyVirtualQRDetailPage;
