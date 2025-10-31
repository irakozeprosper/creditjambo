import api from "./axiosInstance";

export const getUsers = {
  async getAllUsers() {
    const { data } = await api.get(`/users`);
    return data;
  },
};
