import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.warn("Unauthorized - Token invalid or expired");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }

            if (status === 403) {
                console.warn("Forbidden - Access denied");
                window.location.href = "/403";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;