// src/pages/Dashboard.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import RecentTransactions from "../../components/tables/RecentTransactions";
import CreditRequests from "../../components/tables/CreditRequests";
import { getUsers } from "../../api/getAllUsers";
import { Spin } from "antd";
import { MetricCard } from "../../components/cards/MetricCards";
import { CreditCard, PiggyBank, Users, Activity } from "lucide-react";
import { getLoanRequests } from "../../api/loanRequests";
import { getSavings } from "../../api/getTotalSavings";
import { getTransactionsToday } from "../../api/getAllTransactionsToday";

const Dashboard: React.FC = () => {
  const { data: allUsers, isLoading: allUsersLoading } = useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => getUsers.getAllUsers(),
  });
  const { data: pendingLoanRequests, isLoading: pendingLoanRequestsLoading } =
    useQuery({
      queryKey: ["PendingLoanRequests"],
      queryFn: () => getLoanRequests.getAllLoanRequests(),
    });
  const { data: totalSavings, isLoading: totalSavingsLoading } = useQuery({
    queryKey: ["TotalSavings"],
    queryFn: () => getSavings.getTotalSavings(),
  });
  const { data: transactionsToday, isLoading: transactionsTodayLoading } =
    useQuery({
      queryKey: ["TransactionsToday"],
      queryFn: () => getTransactionsToday.getAllTransactionsToday(),
    });

  if (
    allUsersLoading ||
    pendingLoanRequestsLoading ||
    totalSavingsLoading ||
    transactionsTodayLoading
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Overview of system activities and performance metrics
        </p>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <MetricCard
          title="Total Users"
          value={allUsers?.length || 0}
          icon={<Users className="w-8 h-8 text-blue-500/90" />}
        />
        <MetricCard
          title="Credit Requests"
          value={pendingLoanRequests?.length || 0}
          icon={<CreditCard className="w-8 h-8 text-green-500/90" />}
        />
        <MetricCard
          title="Total Savings"
          value={totalSavings || 0}
          icon={<PiggyBank className="w-8 h-8 text-yellow-500/90" />}
        />
        <MetricCard
          title="Transactions Today"
          value={transactionsToday?.length || 0}
          icon={<Activity className="w-8 h-8 text-purple-500/90" />}
        />
      </div>
      ,{/* Main Grid Layout */}
      <div className="grid gap-6">
        {/* Left Column: Transactions + Requests */}
        <div className=" flex flex-col gap-6">
          <RecentTransactions />
          <CreditRequests />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
