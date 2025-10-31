import api from "./axiosInstance";

export const getTransactionsToday = {
  async getAllTransactionsToday() {
    const { data } = await api.get(`/transactions/today`);
    return data;
  },
};
