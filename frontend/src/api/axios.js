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

            if (!refreshToken) {
                console.log(
                    "No refresh token found."
                );

                return Promise.reject(error);
            }

            try {

                const refreshResponse =
                    await axios.post(
                        "http://127.0.0.1:8000/api/token/refresh/",
                        {
                            refresh: refreshToken,
                        }
                    );

                const newAccessToken =
                    refreshResponse.data.access;

                const newRefreshToken =
                    refreshResponse.data.refresh;

                localStorage.setItem(
                    "access",
                    newAccessToken
                );

                if (newRefreshToken) {
                    localStorage.setItem(
                        "refresh",
                        newRefreshToken
                    );
                }

                console.log(
                    "New access token received."
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {

                console.log(
                    "Refresh token expired or invalid."
                );

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.dispatchEvent(
                    new Event("auth:logout")
                );

                return Promise.reject(
                    refreshError
                );
            }
        }


        // 401
        if (error.response?.status === 401) {
            console.log(
                "Authentication required."
            );
        }

        // 403
        if (error.response?.status === 403) {
            console.log(
                "Permission denied."
            );
        }

        // 400
        if (error.response?.status === 400) {
            console.log(
                "Bad request or validation error."
            );
        }

        // 500
        if (error.response?.status >= 500) {
            console.log(
                "Server error. Please try again later."
            );
        }

        // Network error
        if (!error.response) {
            console.log(
                "Network error. Please check the backend server."
            );
        }

        return Promise.reject(error);
    }
);


export default api;