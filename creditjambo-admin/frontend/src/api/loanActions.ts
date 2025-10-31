// src/api/loanActions.ts
import api from "./axiosInstance";

export const loanActions = {
  updateLoanRequest: (id: number, body: { request_status: string }) =>
    api
      .patch(`/loan-requests/${id}/status`, body)
      .then((res) => res.data),
};
