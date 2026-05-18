import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import httpClient from "../../shared/api/httpClient";
import {
  requestWithFallback,
  unwrapCollection,
  unwrapObject,
} from "../../shared/api/requestWithFallback";
import { mockVehicles } from "../../shared/mock/userSystemMockData";

const STORAGE_KEY = "dv_user_vehicles_mock";
const DELETED_IDS_KEY = "dv_user_vehicles_deleted_ids";

const normalizeVehicle = (item) => ({
  id: String(item?.id || item?._id || item?.vehicle_id || item?.vehicleId || ""),
  name: item?.name || item?.vehicle_name || item?.vehicleName || item?.api_data?.custom_vehicle_info?.vehicle_name || "Vehicle",
  type: item?.type || item?.vehicle_type || item?.vehicleType || item?.api_data?.custom_vehicle_info?.vehicle_class || "Car",
  plate: item?.plate || item?.rc_number || item?.registrationNumber || item?.vehicle_id || "N/A",
  fuel: item?.fuel || item?.fuel_type || item?.fuelType || item?.api_data?.custom_vehicle_info?.fuel_type || "Petrol",
  year: String(item?.year || item?.model_year || item?.modelYear || (item?.api_data?.custom_vehicle_info?.vehicle_age ? (new Date().getFullYear() - item.api_data.custom_vehicle_info.vehicle_age) : "2024")),
  ownership: item?.ownership || item?.ownership_type || item?.api_data?.custom_vehicle_info?.ownership_details || "First Owner",
  insuranceStatus: item?.insuranceStatus || item?.insurance_status || item?.api_data?.custom_vehicle_info?.rc_status || "Active",
  pucStatus: item?.pucStatus || item?.puc_status || "Active",
  image: item?.image || item?.vehicle_image || "/Car Image.png",
  qrId: item?.qrId || item?.qr_id || item?.qrCode || "QR-DV-0000",
  vehicle_doc: item?.vehicle_doc || { security_code: "", documents: [] }
});

const getLocalVehicles = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setLocalVehicles = (vehicles) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
};

const getDeletedVehicleIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const setDeletedVehicleIds = (ids) => {
  localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(ids));
};

const mapVehiclePayload = (payload) => ({
  rc_number: payload.rcNumber,
  vehicle_name: payload.vehicleName,
  vehicle_type: payload.type,
  fuel_type: payload.fuel,
  model_year: payload.year,
});

export const getMockBackedVehicles = () => {
  const local = getLocalVehicles();
  const normalizedLocal = local.map(normalizeVehicle);
  const deletedIds = new Set(getDeletedVehicleIds());
  const all = [...normalizedLocal, ...mockVehicles.map(normalizeVehicle)];

  const byId = new Map();
  for (const vehicle of all) {
    if (!vehicle?.id || deletedIds.has(String(vehicle.id))) {
      continue;
    }

    if (!byId.has(vehicle.id)) {
      byId.set(vehicle.id, vehicle);
    }
  }

  return Array.from(byId.values());
};

export const listVehicles = async () => {
  const token = Cookies.get("user_token");
  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.user_id;
    } catch (e) {
      console.error("Token decode error", e);
    }
  }

  const response = await requestWithFallback(
    [
      () => userId ? httpClient.get(`/api/v1/garage/${userId}`) : Promise.reject("No User ID"),
      () => httpClient.get("/api/vehicles"),
    ],
    () => ({ data: getMockBackedVehicles() }),
  );

  return unwrapCollection(response).map(normalizeVehicle);
};

export const getVehicleById = async (id) => {
  const response = await requestWithFallback(
    [
      () => httpClient.get(`/api/vehicles/${id}`),
      () => httpClient.get(`/api/user/vehicles/${id}`),
      () => httpClient.get(`/api/marketplace/vehicles/${id}`),
    ],
    () => {
      const item = getMockBackedVehicles().find((vehicle) => vehicle.id === String(id));
      return { data: item || getMockBackedVehicles()[0] };
    },
  );

  return normalizeVehicle(unwrapObject(response));
};

export const createVehicle = async (payload) => {
  const requestPayload = mapVehiclePayload(payload);

  const response = await requestWithFallback(
    [
      () => httpClient.post("/api/vehicles", requestPayload),
      () => httpClient.post("/api/user/vehicles", requestPayload),
      () => httpClient.post("/api/marketplace/vehicles", requestPayload),
    ],
    () => {
      const local = getLocalVehicles();
      const created = normalizeVehicle({
        ...requestPayload,
        id: `local_${Date.now()}`,
      });
      setLocalVehicles([created, ...local]);
      return { data: created };
    },
  );

  return normalizeVehicle(unwrapObject(response));
};

export const updateVehicle = async (id, payload) => {
  const requestPayload = mapVehiclePayload(payload);

  const response = await requestWithFallback(
    [
      () => httpClient.put(`/api/vehicles/${id}`, requestPayload),
      () => httpClient.patch(`/api/vehicles/${id}`, requestPayload),
      () => httpClient.put(`/api/user/vehicles/${id}`, requestPayload),
      () => httpClient.patch(`/api/user/vehicles/${id}`, requestPayload),
      () => httpClient.put(`/api/marketplace/vehicles/${id}`, requestPayload),
      () => httpClient.patch(`/api/marketplace/vehicles/${id}`, requestPayload),
    ],
    () => {
      const local = getLocalVehicles().map(normalizeVehicle);
      const existing = getMockBackedVehicles().find((vehicle) => vehicle.id === String(id));
      const updated = normalizeVehicle({
        ...(existing || {}),
        ...requestPayload,
        id: String(id),
      });

      const withoutCurrent = local.filter((vehicle) => vehicle.id !== String(id));
      setLocalVehicles([updated, ...withoutCurrent]);

      const deletedIds = getDeletedVehicleIds().filter((item) => item !== String(id));
      setDeletedVehicleIds(deletedIds);

      return { data: updated };
    },
  );

  return normalizeVehicle(unwrapObject(response));
};

export const deleteVehicle = async (id) => {
  await requestWithFallback(
    [
      () => httpClient.delete(`/api/vehicles/${id}`),
      () => httpClient.delete(`/api/user/vehicles/${id}`),
      () => httpClient.delete(`/api/marketplace/vehicles/${id}`),
    ],
    () => {
      const local = getLocalVehicles().map(normalizeVehicle);
      setLocalVehicles(local.filter((vehicle) => vehicle.id !== String(id)));

      const deletedIds = new Set(getDeletedVehicleIds());
      deletedIds.add(String(id));
      setDeletedVehicleIds(Array.from(deletedIds));

      return { data: { success: true } };
    },
  );

  return true;
};
