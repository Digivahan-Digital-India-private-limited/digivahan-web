import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import httpClient from "../../shared/api/httpClient";
import {
  requestWithFallback,
  unwrapCollection,
  unwrapObject,
} from "../../shared/api/requestWithFallback";
import {
  mockEmergencyContacts,
  mockProfile,
} from "../../shared/mock/userSystemMockData";

const PROFILE_STORAGE_KEY = "dv_user_profile_mock";
const CONTACTS_STORAGE_KEY = "dv_user_emergency_contacts_mock";

const splitName = (fullName = "") => {
  const value = String(fullName || "").trim();
  if (!value) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...rest] = value.split(" ");
  return {
    firstName: firstName || "",
    lastName: rest.join(" "),
  };
};

const normalizeProfile = (item) => {
  const basic = item?.basic_details || {};
  const publicData = item?.public_details || {};

  return {
    id: String(item?.id || item?._id || item?.user_id || "u1"),
    firstName: basic.first_name || item?.firstName || item?.first_name || splitName(item?.name || item?.full_Name || item?.full_name || "").firstName || "",
    lastName: basic.last_name || item?.lastName || item?.last_name || splitName(item?.name || item?.full_Name || item?.full_name || "").lastName || "",
    name: item?.name || item?.full_Name || item?.full_name || `${basic.first_name || ""} ${basic.last_name || ""}`.trim() || "User",
    phone: basic.phone_number || item?.phone || item?.phone_number || "",
    email: basic.email || item?.email || "",
    address: publicData.address || item?.address || "",
    occupation: basic.occupation || item?.occupation || "",
    avatar: basic.profile_pic || item?.avatar || item?.profile_pic || "",
  };
};

const normalizeEmergencyContact = (item) => ({
  id: String(item?.id || item?._id || item?.contact_id || ""),
  name:
    item?.name ||
    `${item?.first_name || ""} ${item?.last_name || ""}`.trim() ||
    "Emergency Contact",
  relation: item?.relation || "Contact",
  phone: item?.phone || item?.phone_number || "",
  avatar: item?.avatar || item?.profile_pic || mockEmergencyContacts[0].avatar,
});

const getLocalProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? normalizeProfile(parsed) : null;
  } catch {
    return null;
  }
};

const setLocalProfile = (profile) => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

const getLocalEmergencyContacts = () => {
  try {
    const raw = localStorage.getItem(CONTACTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeEmergencyContact) : [];
  } catch {
    return [];
  }
};

const setLocalEmergencyContacts = (contacts) => {
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
};

const mapProfilePayload = (payload) => ({
  name:
    payload.name ||
    `${payload.firstName || ""} ${payload.lastName || ""}`.trim(),
  first_name: payload.firstName,
  last_name: payload.lastName,
  email: payload.email,
  phone_number: payload.phone,
  occupation: payload.occupation,
  address: payload.address,
  avatar: payload.avatar,
  profile_pic: payload.avatar,
});

export const getProfile = async () => {
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
      () => userId ? httpClient.post("/api/get_user_details", { user_id: userId, details_type: "all" }) : Promise.reject("No User ID"),
      () => httpClient.get("/api/users/me"),
      () => httpClient.get("/api/user/profile"),
    ],
    () => ({ data: getLocalProfile() || mockProfile }),
  );

  return normalizeProfile(unwrapObject(response));
};

export const listEmergencyContacts = async () => {
  const localContacts = getLocalEmergencyContacts();

  if (localContacts.length) {
    return localContacts;
  }

  const response = await requestWithFallback(
    [
      () => httpClient.get("/api/users/emergency-contacts"),
      () => httpClient.get("/api/user/emergency-contacts"),
      () => httpClient.get("/api/users/me"),
    ],
    () => ({ data: mockEmergencyContacts }),
  );

  const body = unwrapObject(response);

  if (Array.isArray(body?.emergency_contacts)) {
    return body.emergency_contacts.map(normalizeEmergencyContact);
  }

  return unwrapCollection(response).map(normalizeEmergencyContact);
};

export const updateProfile = async (payload) => {
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

  const requestPayload = {
    ...mapProfilePayload(payload),
    user_id: userId,
  };

  const response = await requestWithFallback(
    [
      () => httpClient.put("/api/update_user", requestPayload),
      () => httpClient.patch("/api/users/me", requestPayload),
      () => httpClient.put("/api/users/me", requestPayload),
    ],
    () => {
      const updated = normalizeProfile({
        ...(getLocalProfile() || mockProfile),
        ...requestPayload,
      });
      setLocalProfile(updated);
      return { data: updated };
    },
  );

  return normalizeProfile(unwrapObject(response));
};

export const createEmergencyContact = async (payload) => {
  const requestPayload = {
    name: payload.name,
    relation: payload.relation,
    phone: payload.phone,
  };

  const response = await requestWithFallback(
    [
      () => httpClient.post("/api/users/emergency-contacts", requestPayload),
      () => httpClient.post("/api/user/emergency-contacts", requestPayload),
      () => httpClient.post("/api/emergency-contacts", requestPayload),
    ],
    () => {
      const existing = getLocalEmergencyContacts();
      const base = existing.length ? existing : mockEmergencyContacts.map(normalizeEmergencyContact);
      const created = normalizeEmergencyContact({
        ...requestPayload,
        id: `ec_${Date.now()}`,
      });
      setLocalEmergencyContacts([created, ...base]);
      return { data: created };
    },
  );

  return normalizeEmergencyContact(unwrapObject(response));
};

export const deleteEmergencyContact = async (contactId) => {
  await requestWithFallback(
    [
      () => httpClient.delete(`/api/users/emergency-contacts/${contactId}`),
      () => httpClient.delete(`/api/user/emergency-contacts/${contactId}`),
      () => httpClient.delete(`/api/emergency-contacts/${contactId}`),
    ],
    () => {
      const existing = getLocalEmergencyContacts();
      const base = existing.length ? existing : mockEmergencyContacts.map(normalizeEmergencyContact);
      setLocalEmergencyContacts(base.filter((item) => item.id !== String(contactId)));
      return { data: { success: true } };
    },
  );

  return true;
};

export const updateEmergencyContact = async (contactId, payload) => {
  const requestPayload = {
    name: payload.name,
    relation: payload.relation,
    phone: payload.phone,
  };

  const response = await requestWithFallback(
    [
      () => httpClient.patch(`/api/users/emergency-contacts/${contactId}`, requestPayload),
      () => httpClient.put(`/api/users/emergency-contacts/${contactId}`, requestPayload),
      () => httpClient.patch(`/api/user/emergency-contacts/${contactId}`, requestPayload),
      () => httpClient.put(`/api/user/emergency-contacts/${contactId}`, requestPayload),
    ],
    () => {
      const existing = getLocalEmergencyContacts();
      const base = existing.length
        ? existing
        : mockEmergencyContacts.map(normalizeEmergencyContact);
      const updated = normalizeEmergencyContact({
        ...base.find((item) => item.id === String(contactId)),
        ...requestPayload,
        id: String(contactId),
      });

      setLocalEmergencyContacts(
        base.map((item) => (item.id === String(contactId) ? updated : item)),
      );

      return { data: updated };
    },
  );

  return normalizeEmergencyContact(unwrapObject(response));
};
