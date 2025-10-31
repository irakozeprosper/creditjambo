import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Card, Typography } from "antd";
import { cn } from "../../utils/cn";

// Import the specific module components
import { DepositForm } from "../../components/forms/DepositForm";
import { WithdrawForm } from "../../components/forms/WithdrawForm";
import { TransactionHistory } from "../../components/tables/TransactionHistory";

const { Title } = Typography;

// Define allowed module paths
type SavingsModule = "deposit" | "withdraw" | "history";

const SavingsPage: React.FC = () => {
    // Get the dynamic part of the URL (e.g., 'deposit', 'withdraw')
    const { module } = useParams<{ module: SavingsModule }>();

    // --- Module Mapping ---
    let CurrentComponent: React.FC | null = null;
    let titleText = "";

    switch (module) {
        case "deposit":
            CurrentComponent = DepositForm;
            titleText = "Deposit Funds into Savings";
            break;
        case "withdraw":
            CurrentComponent = WithdrawForm;
            titleText = "Withdraw Funds from Savings";
            break;
        case "history":
            CurrentComponent = TransactionHistory;
            titleText = "Savings Transaction History";
            break;
        default:
            // Fallback: If URL doesn't match any module, redirect to History
            return (
                <Navigate
                    to="/savings/history"
                    replace
                />
            );
    }

    return (
        <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-full transition-colors">
            <Title
                level={2}
                className="text-slate-800 dark:text-slate-50 mb-6 font-bold"
            >
                {titleText}
            </Title>

            <Card className={cn("shadow-xl border-none p-4", "bg-white dark:bg-slate-800 dark:border-slate-700")}>
                {/* Render the specific component based on the URL parameter */}
                {CurrentComponent && <CurrentComponent />}
            </Card>
        </div>
    );
};

export default SavingsPage;
