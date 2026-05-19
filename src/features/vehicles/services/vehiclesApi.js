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
  insuranceStatus: (() => {
    const val = item?.insuranceStatus || item?.insurance_status;
    if (val && val !== "N/A") return val;
    const expiry = item?.api_data?.custom_vehicle_info?.insurance_expiry;
    if (!expiry) return "Active";
    try {
      const expDate = new Date(expiry);
      if (isNaN(expDate.getTime())) return "Active";
      return expDate > new Date() ? "Active" : "Expired";
    } catch {
      return "Active";
    }
  })(),
  pucStatus: (() => {
    const val = item?.pucStatus || item?.puc_status;
    if (val && val !== "N/A") return val;
    const expiry = item?.api_data?.custom_vehicle_info?.pollution_expiry;
    if (!expiry) return "Active";
    try {
      const expDate = new Date(expiry);
      if (isNaN(expDate.getTime())) return "Active";
      return expDate > new Date() ? "Active" : "Expired";
    } catch {
      return "Active";
    }
  })(),
  image: item?.image || item?.vehicle_image || "/Car Image.png",
  qrId: item?.qrId || item?.qr_id || (item?.qr_list && item.qr_list.length > 0 ? item.qr_list[0] : null) || item?.qrCode || "QR-DV-0000",
  qr_list: item?.qr_list || [],
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
    () => ({ data: { vehicles: getMockBackedVehicles() } }),
  );

  // Safely extract vehicles array
  const body = response?.data ?? response;
  let items = [];
  if (body) {
    if (Array.isArray(body)) {
      items = body;
    } else if (Array.isArray(body.vehicles)) {
      items = body.vehicles;
    } else if (body.data && typeof body.data === "object") {
      if (Array.isArray(body.data)) {
        items = body.data;
      } else if (Array.isArray(body.data.vehicles)) {
        items = body.data.vehicles;
      }
    }
  }

  // Fallback to mock data if no vehicles found and not logged in
  if (items.length === 0 && !userId) {
    items = getMockBackedVehicles();
  }

  return items.map(normalizeVehicle);
};

export const getVehicleById = async (id) => {
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
      async () => {
        // Fetch the user's active garage
        const res = await httpClient.get(`/api/v1/garage/${userId}`);
        const vehiclesList = res.data?.data?.vehicles || [];
        // Find the vehicle with matching vehicle_id
        const item = vehiclesList.find(
          (v) => String(v.vehicle_id || v.id || v._id || "").toUpperCase() === String(id).toUpperCase()
        );
        if (!item) throw new Error("Vehicle not found in garage");
        return { data: item };
      }
    ],
    () => {
      const item = getMockBackedVehicles().find(
        (vehicle) => String(vehicle.id).toUpperCase() === String(id).toUpperCase()
      );
      return { data: item || getMockBackedVehicles()[0] };
    },
  );

  return normalizeVehicle(unwrapObject(response));
};

export const fetchVehicleRtoDetails = async (rcNumber) => {
  const vehicleNumber = String(rcNumber).toUpperCase().trim();
  const response = await httpClient.post("/api/v1/add-vehicle", {
    vehicle_number: vehicleNumber
  }, {
    timeout: 65000  // RTO API can take up to 30s + premium fallback another 30s
  });
  const data = response.data;
  if (!data?.status && !data?.success) {
    const err = new Error(data?.message || "Vehicle not found in RTO registry");
    err.response = { data };
    throw err;
  }
  return data?.data?.result || data;
};

export const addVehicleToGarage = async (rcNumber, ownerName) => {
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

  const vehicleNumber = String(rcNumber).toUpperCase().trim();
  const response = await httpClient.post("/api/v1/user/add-garage", {
    user_id: userId,
    vehicle_number: vehicleNumber,
    owner_name: ownerName
  });
  return response.data;
};

export const createVehicle = async (payload) => {
  const vehicleNumber = String(payload.rcNumber || payload.rc_number || "").toUpperCase().trim();
  try {
    const details = await fetchVehicleRtoDetails(vehicleNumber);
    const ownerName = details?.custom_vehicle_info?.owner_name || "test owner";
    return await addVehicleToGarage(vehicleNumber, ownerName);
  } catch (error) {
    console.error("Fallback creation in createVehicle", error);
    const local = getLocalVehicles();
    const created = normalizeVehicle({
      id: vehicleNumber || `local_${Date.now()}`,
      rc_number: vehicleNumber,
      vehicle_name: payload.vehicleName,
      vehicle_type: payload.type,
      fuel_type: payload.fuel,
      model_year: payload.year,
    });
    setLocalVehicles([created, ...local]);
    return created;
  }
};

export const updateVehicle = async (id, payload) => {
  const requestPayload = mapVehiclePayload(payload);

  const response = await requestWithFallback(
    [
      () => httpClient.put(`/api/vehicles/${id}`, requestPayload),
      () => httpClient.patch(`/api/vehicles/${id}`, requestPayload),
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

  await requestWithFallback(
    [
      () => httpClient.post("/api/v1/garage/remove-vehicle", {
        user_id: userId,
        vehicle_number: String(id).toUpperCase().trim()
      })
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
