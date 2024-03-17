import api from "~/services/apiService";
import { decryptUserId } from "~/utils/hashUserId";

async function fetchUserData(userId, secretKey) {
  try {
    const decodeUserId = decryptUserId(userId, secretKey);
    const response = await api.get(`/user/getUserById/${decodeUserId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function fetchUserDataV2(userId) {
  try {
    const response = await api.get(`/user/getUserById/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export { fetchUserData, fetchUserDataV2 };
