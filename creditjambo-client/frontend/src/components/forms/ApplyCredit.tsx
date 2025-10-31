import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../../hooks/useAccount";
import { useCreditApplication } from "../../hooks/useCreditApplication";

interface LoanData {
    amount: number;
    duration: number;
    purpose: string;
    monthlyIncome: number;
    acceptedTerms: boolean;
}

const calculateRepayment = (amount: number, duration: number): number => {
    const annualInterestRate = 0.25;
    const monthlyRate = annualInterestRate / 12;

    return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));
};

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "RWF",
        minimumFractionDigits: 0,
    }).format(value);

const ApplyCredit: React.FC = () => {
    const { account } = useAccount();
    const { applyCredit } = useCreditApplication();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [loanData, setLoanData] = useState<LoanData>({
        amount: 0,
        duration: 0,
        purpose: "",
        monthlyIncome: 0,
        acceptedTerms: false,
    });
    const [repaymentEstimate, setRepaymentEstimate] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStep1Continue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!loanData.amount || !loanData.duration || !loanData.purpose) {
            console.error("Please fill all fields in Step 1.");
            return;
        }

        const estimate = calculateRepayment(loanData.amount, loanData.duration);
        setRepaymentEstimate(estimate);
        setCurrentStep(1);
    };
    const handleStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!loanData.monthlyIncome || !loanData.acceptedTerms) {
            console.error("Please complete all required fields and accept terms in Step 2.");
            return;
        }

        if (!account) {
            console.error("Account not found. Please try again.");
            return;
        }

        const loanRequest = {
            account_id: account.account_id,
            requested_amount: loanData.amount,
            duration: loanData.duration,
            purpose: loanData.purpose,
            income: loanData.monthlyIncome,
        };

        const result = await applyCredit(loanRequest);

        if (result.success) {
            setCurrentStep(2);
        } else {
            alert(result.message || "Unable to submit credit request.");
        }
    };

    const steps = [
        <form
            onSubmit={handleStep1Continue}
            key="step1"
            className="space-y-6"
        >
            <div className="relative">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Loan Amount Requested (RWF)</label>
                <input
                    type="number"
                    min={50000}
                    step={1000}
                    value={loanData.amount || ""}
                    onChange={(e) => setLoanData({ ...loanData, amount: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                    placeholder="Enter minimum RWF50,000"
                    required
                />
            </div>

            <div className="relative">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Repayment Duration (Months)</label>
                <input
                    type="number"
                    min={3}
                    max={24}
                    value={loanData.duration || ""}
                    onChange={(e) => setLoanData({ ...loanData, duration: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                    required
                />
            </div>

            <div className="relative">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Purpose of Credit</label>
                <select
                    value={loanData.purpose}
                    onChange={(e) => setLoanData({ ...loanData, purpose: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                    required
                >
                    <option
                        value=""
                        disabled
                    >
                        Select purpose
                    </option>
                    <option value="Business">Business Capital</option>
                    <option value="Education">Education Fees</option>
                    <option value="Home">Home Improvement</option>
                    <option value="Personal">Personal / Other</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full py-3 mt-8 text-lg font-semibold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/50 transition duration-300 ease-in-out hover:bg-indigo-700 transform hover:scale-[1.01] dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
                Continue to Review
            </button>
        </form>,

        <form
            onSubmit={handleStep2Submit}
            key="step2"
            className="space-y-6"
        >
            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-50 border-b pb-3 border-gray-200 dark:border-slate-700">
                Final Details & Confirmation
            </h2>

            <div className="p-5 border border-indigo-200 rounded-xl bg-indigo-50 dark:bg-slate-700 dark:border-indigo-800 shadow-md">
                <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-3 uppercase tracking-wider">Estimated Repayment</h3>
                <p className="flex justify-between items-center mb-2 text-gray-700 dark:text-gray-300">
                    <span className="text-base">Amount Requested:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-slate-50">{formatCurrency(loanData.amount)}</span>
                </p>
                <p className="flex justify-between items-center mb-4 text-gray-700 dark:text-gray-300">
                    <span className="text-base">Term:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-slate-50">{loanData.duration} Months</span>
                </p>
                <div className="pt-4 border-t border-indigo-200 dark:border-indigo-800">
                    <p className="flex justify-between items-center font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">
                        <span>Monthly Payment:</span>
                        <span>{formatCurrency(repaymentEstimate)}</span>
                    </p>
                </div>
            </div>

            <div className="relative">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Current Monthly Income (Gross)</label>
                <input
                    type="number"
                    min={50000}
                    step={1000}
                    value={loanData.monthlyIncome || ""}
                    onChange={(e) => setLoanData({ ...loanData, monthlyIncome: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                    placeholder="Enter your verifiable gross income"
                    required
                />
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-slate-600 border border-amber-200 dark:border-slate-500">
                <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="font-medium">Disclaimer:</span> This repayment is an **estimate** based on an annual 10% interest rate. Final
                    terms may vary after credit assessment.
                </p>
            </div>

            <div className="flex items-start space-x-3 pt-2">
                <input
                    id="acceptedTerms"
                    type="checkbox"
                    checked={loanData.acceptedTerms}
                    onChange={(e) => setLoanData({ ...loanData, acceptedTerms: e.target.checked })}
                    className="mt-1 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                    required
                />
                <label
                    htmlFor="acceptedTerms"
                    className="text-gray-700 dark:text-slate-300 text-sm cursor-pointer"
                >
                    I confirm my income details are accurate and I accept the{" "}
                    <a
                        href="#"
                        className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition duration-150"
                    >
                        Terms & Conditions
                    </a>
                    .
                </label>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 dark:text-slate-300 dark:border-slate-600 rounded-xl transition duration-150 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                    Back
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 font-semibold rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30 transition duration-300 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        "Submit Application"
                    )}
                </button>
            </div>
        </form>,

        <div
            key="step3"
            className="text-center space-y-6 py-8"
        >
            <div className="flex justify-center mb-4">
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
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-slate-50"> Application Submitted!</h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you for your application. Your credit request is now under **review**. You’ll receive an official response regarding the final
                terms within 24 hours.
            </p>
            <div className="space-x-3 pt-6">
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 border border-gray-300 text-gray-700 dark:text-slate-300 dark:border-slate-600 rounded-xl transition duration-150 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                    Go to Home
                </button>
            </div>
        </div>,
    ];

    const stepTitles = ["Loan Details", "Review & Income", "Confirmation"];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-500">
            <div className="w-full max-w-lg lg:max-w-xl">
                <div className="flex justify-between items-center mb-10 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700 mx-10 -z-10 transform -translate-y-1/2"></div>

                    {stepTitles.map((title, index) => (
                        <div
                            key={title}
                            className={`flex flex-col items-center text-center w-1/3 transition-colors duration-300 z-10 ${
                                index <= currentStep ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full border-4 font-bold text-lg transition-all duration-300 ${
                                    index < currentStep
                                        ? "border-green-500 bg-green-500 text-white"
                                        : index === currentStep
                                        ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/50"
                                        : "border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-600 text-gray-600 dark:text-gray-300"
                                }`}
                            >
                                {index < currentStep ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className="mt-3 text-sm font-medium hidden sm:block">{title}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 transition-colors duration-500">
                    {steps[currentStep]}
                </div>
            </div>
        </div>
    );
};

export default ApplyCredit;
