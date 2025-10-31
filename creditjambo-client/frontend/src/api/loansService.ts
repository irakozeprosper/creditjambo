import api from "./axiosInstance";

export const loansService = {
    async getPendingLoan(account_id: number) {
        const { data } = await api.get(`/loans/account/${account_id}/active`);
        return data;
    },
};
