import api from "./axiosInstance";

export const savingsService = {
    async getAccountBalance(userId: number) {
        const { data } = await api.get(`/savings-accounts/account/${userId}`);
        return data.current_balance;
    },
};
