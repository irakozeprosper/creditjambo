import api from "./axiosInstance";

export const getTransactions = {
  async getAllTransactions() {
    try {
      const { data } = await api.get("/transactions");

      if (Array.isArray(data)) return data;
      if (Array.isArray(data.transactions)) return data.transactions;

      return [];
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return [];
    }
  },
};
