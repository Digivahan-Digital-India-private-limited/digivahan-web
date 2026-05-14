import httpClient from "../../shared/api/httpClient";
import { requestWithFallback, unwrapObject } from "../../shared/api/requestWithFallback";

export const getVehicleQr = async (vehicleId) => {
  const response = await requestWithFallback(
    [
      () => httpClient.get(`/api/vehicles/${vehicleId}/qr`),
      () => httpClient.get(`/api/qr/${vehicleId}`),
      () => httpClient.get(`/api/user/vehicles/${vehicleId}/qr`),
    ],
    () => ({
      data: {
        qr_id: `QR-DV-${vehicleId}`,
        qr_value: `DV:VEHICLE:${vehicleId}`,
        image_url: null,
      },
    }),
  );

  const data = unwrapObject(response);

  return {
    id: String(data?.id || data?._id || data?.qr_id || `QR-DV-${vehicleId}`),
    value: data?.value || data?.qr_value || `DV:VEHICLE:${vehicleId}`,
    imageUrl: data?.image_url || data?.imageUrl || null,
  };
};
