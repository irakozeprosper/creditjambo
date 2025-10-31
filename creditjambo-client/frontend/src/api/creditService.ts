import { message } from "antd"; // optional
import api from "./axiosInstance"; // your axios instance

interface LoanRequest {
    account_id: number;
    amount: number;
    duration: number;
    purpose: string;
    monthlyIncome: number;
}

interface CreditCheckResponse {
    hasActiveCredit: boolean;
    message?: string;
}

export class CreditService {
    // ✅ Check if the account already has active credit
    async checkActiveCredit(accountId: number): Promise<CreditCheckResponse> {
        try {
            const { data } = await api.get<CreditCheckResponse>(`/loans/account/${accountId}/active`);
            return data;
        } catch (error: any) {
            message.error(`Credit check failed: ${error.response?.data?.message || error.message}`);
            throw new Error(error.response?.data?.message || "Unable to check active credit.");
        }
    }

    // ✅ Submit a credit application
    async applyForCredit(loanData: LoanRequest) {
        try {
            const { data } = await api.post("/loan-requests", loanData);
            return data;
        } catch (error: any) {
            message.error(`Apply credit failed: ${error.response?.data?.message || error.message}`);
            throw new Error(error.response?.data?.message || "Credit request failed.");
        }
    }
}
