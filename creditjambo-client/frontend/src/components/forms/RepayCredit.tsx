import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useQuery } from "@tanstack/react-query";
import { getAccountAndLoan } from "../../api/repaymentService";
import { format } from "date-fns";
import api from "../../api/axiosInstance";

// --- Utility ---
const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-RW", {
        style: "currency",
        currency: "RWF",
        minimumFractionDigits: 0,
    }).format(value);

// --- Types ---
interface Loan {
    loan_id: number;
    account_id: number;
    total_repayable: number;
    remaining_balance: number;
    paid_amount: number;
    due_date: string;
    status: string;
}

interface Account {
    account_id: number;
    account_number: string;
    current_balance: number;
}

// --- Component ---
const RepayCredit: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [repaymentAmount, setRepaymentAmount] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const userId = user?.user_id;

    const { data, isLoading } = useQuery<{ account: Account; loan: Loan }, Error>({
        queryKey: ["accountAndLoan", userId],
        queryFn: () => {
            if (!userId) throw new Error("User not loaded yet");
            return getAccountAndLoan(userId);
        },
        enabled: !!userId,
    });

    const account = data?.account ?? null;
    const loan = data?.loan;

    const handleRepayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loan || !account) return;

        if (repaymentAmount <= 1000 || repaymentAmount > loan.total_repayable - loan.paid_amount) {
            setMessage("Please enter a valid repayment amount.");
            return;
        }

        if (account.current_balance < repaymentAmount) {
            setMessage("Insufficient balance to complete repayment.");
            return;
        }

        try {
            setIsSubmitting(true);
            setMessage(null);

            const repaymentPayload = {
                account_id: account.account_id,
                loan_id: loan.loan_id,
                amount: repaymentAmount,
            };

            const { data: result } = await api.post("/repayments", repaymentPayload);

            console.log("Repayment success:", result);
            setSuccess(true);
        } catch (err: any) {
            console.error("Repayment error:", err);

            const errorMsg = err.response?.data?.message || err.message || "Repayment failed. Try again.";

            setMessage(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">Loading account and loan details...</div>
        );
    }

    if (success) {
        return (
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-500">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center transition-colors duration-500">
                    <div className="flex justify-center mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-green-500 dark:text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-slate-50 mb-3">Repayment Successful!</h2>
                    <p className="text-lg text-gray-600 dark:text-slate-300 mb-6">
                        {formatCurrency(repaymentAmount)} has been deducted from your account for this loan.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-3 font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/40 transition duration-300"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-500">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-extrabold text-center mb-4 text-gray-900 dark:text-slate-50">Loan Repayment</h1>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
                    {message && <div className="mb-4 text-center text-red-500 bg-red-100 dark:bg-red-900/40 py-2 rounded-md">{message}</div>}

                    {!loan ? (
                        <></>
                    ) : (
                        <form
                            onSubmit={handleRepayment}
                            className="space-y-6"
                        >
                            <div className="p-5 border border-indigo-200 rounded-xl bg-indigo-50 dark:bg-slate-700 dark:border-indigo-800 shadow-md">
                                <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-3 uppercase tracking-wider">
                                    Loan Details
                                </h3>
                                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                    <p className="flex justify-between">
                                        <span>Loan Left to Pay:</span>
                                        <span className="font-semibold text-gray-900 dark:text-slate-50">
                                            {loan.total_repayable - loan.paid_amount}
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Loan Paid Amount:</span>
                                        <span className="font-semibold text-gray-900 dark:text-slate-50">{formatCurrency(loan.paid_amount)}</span>
                                    </p>
                                    <p className="flex justify-between border-t pt-2 border-indigo-200 dark:border-indigo-800">
                                        <span>Loan Due Date:</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                            {format(new Date(loan.due_date), "dd MMM yyyy")}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount to Repay (RWF)</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={repaymentAmount || ""}
                                    onChange={(e) => setRepaymentAmount(Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="Enter repayment amount"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-xl shadow-lg transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            >
                                {isSubmitting ? "Processing..." : `Repay ${formatCurrency(repaymentAmount || 0)}`}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepayCredit;
