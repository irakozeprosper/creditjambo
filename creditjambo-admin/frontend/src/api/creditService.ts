import { message } from "antd";
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
  private baseUrl = "http://localhost:5001/api";

  async checkActiveCredit(accountId: number): Promise<CreditCheckResponse> {
    try {
      const res = await fetch(
        `${this.baseUrl}/loans/account/${accountId}/active`
      );
      if (!res.ok) throw new Error("Failed to check credit status");
      const data = await res.json();
      return data;
    } catch (error: any) {
      message.error("Credit check failed:", error);
      throw new Error(error.message || "Unable to check active credit.");
    }
  }

  async applyForCredit(loanData: LoanRequest) {
    try {
      const res = await fetch(`${this.baseUrl}/loan-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loanData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to apply for credit");
      }

      const data = await res.json();
      return data;
    } catch (error: any) {
      message.error("Apply credit failed:", error);
      throw new Error(error.message || "Credit request failed.");
    }
  }
}
