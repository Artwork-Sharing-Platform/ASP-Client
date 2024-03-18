import axios from "axios";
import TokenService from "./tokenService";

const excludedRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/google",
  "/auth/token",
  "/auth/logout",
];

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(async (config) => {
  const accessToken = TokenService.getAccessToken();
  if (
    accessToken &&
    !excludedRoutes.some((route) => config.url.includes(route))
  ) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use the refresh token to obtain a new access token
        const refreshToken = TokenService.getRefreshToken();
        const response = await api.post("/auth/token", { refreshToken });
        const newAccessToken = response.data.accessToken;
        // Update the access token in the TokenService
        TokenService.setAccessToken(newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (error) {
        console.error("Error refreshing token:", error);
        TokenService.removeTokens();
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
