
import api from "../api/axiosInstance";

export const getAccountAndLoan = async (userId: number) => {
    if (!userId) throw new Error("User not logged in");

   
    const accRes = await api.get(`/savings-accounts/account/${userId}`);
    const account = accRes.data;

   
    const loanRes = await api.get(`/loans/account/${Number(account.account_id)}/active`);
    const loan = loanRes.data;

    return { account, loan };
};
