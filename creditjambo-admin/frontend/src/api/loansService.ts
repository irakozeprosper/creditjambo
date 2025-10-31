import api from "./axiosInstance";

export const loansService = {
  async getPendingLoan(userId: number) {
    const { data } = await api.get(`/loans/user/${userId}/pending`);
    return data.pending_amount || 0;
  },
};
