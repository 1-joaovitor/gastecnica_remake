import axios from "axios";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_DEV,
});

api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("access-token");
        if (accessToken) {
            config.headers["Authorization"] = "Bearer " + accessToken;
        }

        if (!config.headers["Content-Type"] && config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        }

        config.headers["X-Requested-With"] = "XMLHttpRequest";
        config.headers["Accept-Language"] = "en";

        return config;
    },
    (error) => {

        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => {

        return response;
    },
    (error) => {

        if (error.response && error.response.status === 401) {

            localStorage.removeItem("userData");
            localStorage.removeItem("access-token");

            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
export default api;