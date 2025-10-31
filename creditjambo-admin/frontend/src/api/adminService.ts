import api from "./axiosInstance";

export const getAdminProfile = async (user_id: number) => {
    const response = await api.get(`/users/${user_id}`);
    return response.data;
};
