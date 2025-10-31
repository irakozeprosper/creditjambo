import api from "./axiosInstance";

export const transactionHistoryService = {
    async getTransactionsByAccountId(accountId: number) {
        const { data } = await api.get(`/transactions/account/${accountId}`);
        return data;
    },
};
