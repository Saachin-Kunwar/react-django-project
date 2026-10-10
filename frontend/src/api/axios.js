// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://127.0.0.1:8000/api",
//     withCredentials: true,
// });


// api.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem("access");

//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error),
// );

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (
//             error.response?.status === 401 &&
//             !originalRequest._retry &&
//             !originalRequest.url.includes("/token/") &&
//             !originalRequest.url.includes("/auth/login/")
//         ) {
//             originalRequest._retry = true;

//             console.log("Access token expired. Trying to refresh...");

//             const refreshToken = localStorage.getItem("refresh");

//             if (!refreshToken) {
//                 console.log("No refresh token found.");
//                 return Promise.reject(error);
//             }

//             try {
//                 const refreshResponse = await axios.post(
//                     "http://127.0.0.1:8000/api/token/refresh/",
//                     { refresh: refreshToken },
//                 );

//                 const newAccessToken = refreshResponse.data.access;
//                 const newRefreshToken = refreshResponse.data.refresh;

//                 localStorage.setItem("access", newAccessToken);

//                 if (newRefreshToken) {
//                     localStorage.setItem("refresh", newRefreshToken);
//                 }

//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 console.log("Refresh token expired or invalid.");
//                 localStorage.removeItem("access");
//                 localStorage.removeItem("refresh");
//                 window.dispatchEvent(new Event("auth:logout"));
//                 return Promise.reject(refreshError);
//             }
//         }

//         if (error.response?.status === 401) {
//             console.log("Authentication required.");
//         }

//         if (error.response?.status === 403) {
//             console.log("Permission denied.");
//         }

//         if (error.response?.status === 400) {
//             console.log("Bad request or validation error.");
//         }

//         if (error.response?.status >= 500) {
//             console.log("Server error. Please try again later.");
//         }

//         if (!error.response) {
//             console.log("Network error. Please check the backend server.");
//         }

//         return Promise.reject(error);
//     },
// );

// export default api;

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Do not retry the refresh request itself or retry twice.
        if (
            originalRequest.url?.includes("/auth/refresh/") ||
            originalRequest.url?.includes("/auth/login/") ||
            originalRequest.url?.includes("/auth/register/") ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => api(originalRequest));
        }

        isRefreshing = true;

        try {
            await api.post("/auth/refresh/");
            processQueue(null);

            // The browser automatically sends the updated HttpOnly cookie.
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);

            // Redirect only if the user is not already on an auth page.
            const isAuthPage = ["/login", "/register"].includes(
                window.location.pathname
            );

            if (!isAuthPage) {
                window.location.assign("/login");
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
