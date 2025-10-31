import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Card } from "antd";
// Import your credit-related components
import LoanRequests from "../../components/LoanRequests";

// Define allowed module paths
type CreditModule = "loan-requests" | "approved-loans" | "repayment-tracker";

const CreditManagementPage: React.FC = () => {
  const { module } = useParams<{ module: CreditModule }>();

  // --- Module Mapping ---
  let CurrentComponent: React.FC | null = null;
  let titleText = "";

  switch (module) {
    case "loan-requests":
      CurrentComponent = LoanRequests;
      titleText = "Loan Requests";
      break;
    default:
      return <Navigate to="/credit-management/loan-requests" replace />;
  }

  return (
    <div className="p-2 md:p-4 min-h-full transition-colors">
      <Card>{CurrentComponent && <CurrentComponent />}</Card>
    </div>
  );
};

export default CreditManagementPage;
