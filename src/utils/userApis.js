// api/userApi.js
import axios from "axios";

const fetchUserDetails = async (qr_id) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/user-details/${qr_id}`,
    );

    if (!res.data.success) {
      const error = new Error(res.data.message);
      error.type = res.data.error_type;
      throw error;
    }

    return res.data.data;
  } catch (err) {
    if (err.response?.data?.error_type) {
      const error = new Error(err.response.data.message);
      error.type = err.response.data.error_type;
      throw error;
    }

    throw err;
  }
};

export default fetchUserDetails;
