import api from "./axiosInstance";

export const getSavings = {
  async getTotalSavings() {
    const { data } = await api.get(`/savings-accounts/total-savings`);
    return data.sum;
  },
};
