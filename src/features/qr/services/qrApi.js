import httpClient from "../../shared/api/httpClient";
import { requestWithFallback, unwrapObject } from "../../shared/api/requestWithFallback";

export const getVehicleQr = async (qrId) => {
  const originUrl = window.location.origin;
  if (!qrId || qrId === "QR-DV-0000") {
    return {
      id: "QR-DV-0000",
      value: `${originUrl}/send-notification/QR-DV-0000`,
      imageUrl: null,
    };
  }

  const response = await requestWithFallback(
    [
      () => httpClient.get(`/api/qr/${qrId}`),
    ],
    () => ({
      data: {
        qr_id: qrId,
        qr_value: `${originUrl}/send-notification/${qrId}`,
        image_url: null,
      },
    }),
  );

  const data = unwrapObject(response);

  return {
    id: String(data?.id || data?._id || data?.qr_id || qrId),
    value: data?.value || data?.qr_value || `${originUrl}/send-notification/${data?.qr_id || qrId}`,
    imageUrl: data?.image_url || data?.imageUrl || data?.qr_img || null,
  };
};
