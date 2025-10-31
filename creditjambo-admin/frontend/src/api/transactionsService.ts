import api from "./axiosInstance";

export const transactionsService = {
  async getRecent(limit = 5) {
    const { data } = await api.get(`/transactions?limit=${limit}`);
    return data;
  },

  async getTotalCount() {
    const { data } = await api.get(`/transactions/count`);
    return data.count;
  },
};
