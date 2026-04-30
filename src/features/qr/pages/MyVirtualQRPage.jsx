import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import QRCodeViewer from "../components/QRCodeViewer";
import { getVehicleById } from "../../vehicles/services/vehiclesApi";
import { getVehicleQr } from "../services/qrApi";

const MyVirtualQRPage = () => {
  const { id } = useParams();

  const { data: vehicle, isLoading: isVehicleLoading } = useQuery({
    queryKey: ["user-vehicle", id],
    queryFn: () => getVehicleById(id),
    enabled: Boolean(id),
  });

  const { data: qrData, isLoading: isQrLoading } = useQuery({
    queryKey: ["vehicle-qr", id],
    queryFn: () => getVehicleQr(id),
    enabled: Boolean(id),
  });

  if (isVehicleLoading || isQrLoading || !vehicle || !qrData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading QR details...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">My Virtual QR</h2>
        <p className="text-sm text-slate-500">{vehicle.name} • {vehicle.plate}</p>
      </section>

      <QRCodeViewer value={qrData.value || `${vehicle.qrId}:${vehicle.plate}`} label="Vehicle QR" />
    </div>
  );
};

export default MyVirtualQRPage;
