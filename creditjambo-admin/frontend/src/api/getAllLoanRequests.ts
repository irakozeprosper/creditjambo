import api from "./axiosInstance";

export const getLoanRequests = {
  async getAllLoanRequests() {
    const { data } = await api.get(`/loan-requests`);
    return data;
  },
};
