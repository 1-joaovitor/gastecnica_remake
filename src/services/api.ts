import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_DEV || 'http://localhost:3001',
});

api.interceptors.request.use(
    async (config) => {
        const accessToken = typeof window !== 'undefined' ? Cookies.get("access-token") : null;


        if (accessToken) {
            config.headers["Authorization"] = "Bearer " + accessToken;

        } else {
            console.log('Nenhum token encontrado nos cookies');
        }

        if (!config.headers["Content-Type"] && config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        }

        config.headers["X-Requested-With"] = "XMLHttpRequest";
        config.headers["Accept-Language"] = "en";


        return config;
    },
    (error) => {
        console.error('Erro no interceptor de request:', error);
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => {

        return response;
    },
    (error) => {

        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                Cookies.remove("userData");
                Cookies.remove("access-token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
export default api;