import React from "react";
import { useParams, Navigate } from "react-router-dom";

// Import your savings-related components
import AllSavingsAccounts from "../../components/AllSavingsAccounts";
import TransactionHistory from "../../components/DepositHistory";

// Define allowed module paths
type SavingsModule =
  | "all-accounts"
  | "transaction-history"
  | "withdrawal-history";

const SavingsManagementPage: React.FC = () => {
  const { module } = useParams<{ module: SavingsModule }>();

  // --- Module Mapping ---
  let CurrentComponent: React.FC | null = null;
  let titleText = "";

  switch (module) {
    case "all-accounts":
      CurrentComponent = AllSavingsAccounts;
      titleText = "All Savings Accounts";
      break;
    case "transaction-history":
      CurrentComponent = TransactionHistory;
      titleText = "Transaction History";
      break;
    default:
      return <Navigate to="/savings-management/all-accounts" replace />;
  }

  return (
    <div className="p-2 md:p-4 min-h-full transition-colors">
      {CurrentComponent && <CurrentComponent />}
    </div>
  );
};

export default SavingsManagementPage;
