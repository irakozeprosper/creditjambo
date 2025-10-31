import { useState } from "react";
import { CreditService } from "../api/creditService";

const creditService = new CreditService();

export function useCreditApplication() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const applyCredit = async (loanData: any) => {
        try {
            setLoading(true);
            setError(null);

            //  Check for existing active credit
            const check = await creditService.checkActiveCredit(loanData.account_id);

            if (check.hasActiveCredit) {
                setError(check.message || "You already have an active credit. Please repay it first.");
                return { success: false, message: check.message };
            }

            //  Submit new loan request
            const result = await creditService.applyForCredit(loanData);
            return { success: true, data: result };
        } catch (err: any) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { applyCredit, loading, error };
}
