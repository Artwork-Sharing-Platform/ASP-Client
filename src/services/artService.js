import api from "~/services/apiService";

async function fetchArtworkList() {
  try {
    const response = await api.get("/art/getAllArtworkByCreatedAtArt");
    return response.data;
  } catch (error) {
    console.error("Error fetching artwork list:", error);
    throw error;
  }
}

async function fetchPinInformationById(id) {
  try {
    const response = await api.get(`/art/getArtworkById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pin information:", error);
    throw error;
  }
}

async function fetchPinInformationByUserId(userId) {
  try {
    const response = await api.get(`/art/getArtworkByUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pin information:", error);
    throw error;
  }
}

async function fetchGetReactionByUserIdAndArtId(artId, userId) {
  try {
    const response = await api.get(`art/get-reaction/${artId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pin information:", error);
    throw error;
  }
}

async function fetchGetReactionLength(artId) {
  try {
    const response = await api.get(`art/get-reaction-length/${artId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pin information:", error);
    throw error;
  }
}

async function fetchGetArtworkByCategoryId(categoryId) {
  try {
    const response = await api.get(`art/getArtworkByCategoryId/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pin information:", error);
    throw error;
  }
}

export {
  fetchArtworkList,
  fetchPinInformationById,
  fetchPinInformationByUserId,
  fetchGetReactionByUserIdAndArtId,
  fetchGetReactionLength,
  fetchGetArtworkByCategoryId,
};
