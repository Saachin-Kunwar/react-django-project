import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    withCredentials: true,
});


// ================================
// Request Interceptor
// ================================

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("access");

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// ================================
// Response Interceptor
// ================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        // Access token expired
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            console.log(
                "Access token expired. Trying to refresh..."
            );

            const refreshToken =
                localStorage.getItem("refresh");

            // No refresh token
            if (!refreshToken) {
                console.log(
                    "No refresh token found."
                );

                return Promise.reject(error);
            }

            try {
                // ================================
                // Refresh Token Request
                // ================================

                const refreshResponse = await axios.post(
                    "http://127.0.0.1:8000/api/token/refresh/",
                    {
                        refresh: refreshToken,
                    }
                );

                // ================================
                // New Tokens
                // ================================

                const newAccessToken =
                    refreshResponse.data.access;

                const newRefreshToken =
                    refreshResponse.data.refresh;

                // Save new access token
                localStorage.setItem(
                    "access",
                    newAccessToken
                );

                // Save rotated refresh token
                if (newRefreshToken) {
                    localStorage.setItem(
                        "refresh",
                        newRefreshToken
                    );
                }

                console.log(
                    "New access token received."
                );

                // ================================
                // Retry Original Request
                // ================================

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {

                console.log(
                    "Refresh token expired or invalid."
                );

                // Remove tokens
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                // Tell React authentication failed
                window.dispatchEvent(
                    new Event("auth:logout")
                );

                return Promise.reject(
                    refreshError
                );
            }
        }

        return Promise.reject(error);
    }
);


export default api;