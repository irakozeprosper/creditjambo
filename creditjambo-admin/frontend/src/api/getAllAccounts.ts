import api from "./axiosInstance";

export const getSavingsAccounts = {
  async getAllSavingsAccount() {
    const { data } = await api.get(`/savings-accounts`);
    return data;
  },
};
