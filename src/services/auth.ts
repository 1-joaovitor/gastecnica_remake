
import api from "./api";
export const login = async (body: { email: string, password: string }) => {
    try {
        const response = await api.post(`users/login`, body);
      
        return response?.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

export const getProfile = async (token: string) => {
    try {
        const response = await api.get("users/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response?.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
};