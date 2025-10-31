import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Row, Col, Typography, Divider, Spin } from "antd";
import { CreditCardOutlined, DollarOutlined, SwapOutlined } from "@ant-design/icons";
import { cn } from "../../utils/cn";
import BalanceCard from "../../components/cards/BalanceCard";
import TransactionCard from "../../components/cards/TransactionCard";
import { savingsService } from "../../api/savingsService";
import { transactionsService } from "../../api/transactionsService";
import { loansService } from "../../api/loansService";
import { useAuth } from "../../contexts/authContext";
import { getAccountAndLoan } from "../../api/repaymentService";

const { Title } = Typography;

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const userId = user?.user_id || 0;

    const { data, isLoading } = useQuery<{ account: any; loan: any }, Error>({
        queryKey: ["accountAndLoan", userId],
        queryFn: () => {
            if (!userId) throw new Error("User not loaded yet");
            return getAccountAndLoan(userId);
        },
        enabled: !!userId,
    });

    const { data: currentBalance, isLoading: balanceLoading } = useQuery({
        queryKey: ["savingsBalance", userId],
        queryFn: () => savingsService.getAccountBalance(userId),
        enabled: !!userId,
    });

    const { data: activeLoan, isLoading: loanLoading } = useQuery({
        queryKey: ["activeLoan", data?.account?.account_id],
        queryFn: () => (data?.account?.account_id ? loansService.getPendingLoan(data.account.account_id) : null),
        enabled: !!data?.account?.account_id,
    });

    const { data: totalTransactions, isLoading: txLoading } = useQuery({
        queryKey: ["totalTransactions"],
        queryFn: () => transactionsService.getTotalCount(),
    });

    if (balanceLoading || loanLoading || txLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    // ✅ Safely calculate pending repayment (avoid accessing null)
    const pendingRepayment = activeLoan ? (activeLoan.total_repayable || 0) - (activeLoan.paid_amount || 0) : 0;

    return (
        <div className="px-4 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors">
            <Title
                level={4}
                className="text-slate-800 dark:text-slate-50 mb-2 font-bold"
            >
                Welcome Back, {user ? `${user.first_name} ${user.last_name}` : "User"}!
            </Title>

            {/* Summary Cards */}
            <Row
                gutter={[24, 24]}
                className="mb-8"
            >
                <Col
                    xs={24}
                    sm={12}
                    lg={8}
                >
                    <BalanceCard
                        title="Total Savings Balance"
                        value={currentBalance || 0}
                        icon={<DollarOutlined />}
                        bgColor="bg-green-600"
                    />
                </Col>

                <Col
                    xs={24}
                    sm={12}
                    lg={8}
                >
                    <BalanceCard
                        title="Pending Credit Repayment"
                        value={pendingRepayment}
                        icon={<CreditCardOutlined />}
                        bgColor="bg-red-600"
                    />
                </Col>

                <Col
                    xs={24}
                    sm={12}
                    lg={8}
                >
                    <BalanceCard
                        title="Total Transactions (YTD)"
                        value={totalTransactions?.length || 0}
                        icon={<SwapOutlined />}
                        bgColor="bg-indigo-600"
                        isCurrency={false}
                    />
                </Col>
            </Row>

            <Divider className="!border-slate-300 dark:!border-slate-700" />

            <Title
                level={3}
                className="text-slate-800 dark:text-slate-50 mb-6 font-semibold"
            >
                Quick Actions
            </Title>

            <Row
                gutter={[24, 24]}
                className="mb-10"
            >
                <Col
                    xs={12}
                    md={6}
                >
                    <TransactionCard
                        title="Deposit Savings"
                        link="/savings/deposit"
                        iconType="deposit"
                    />
                </Col>
                <Col
                    xs={12}
                    md={6}
                >
                    <TransactionCard
                        title="Withdraw Funds"
                        link="/savings/withdraw"
                        iconType="withdraw"
                    />
                </Col>
                <Col
                    xs={12}
                    md={6}
                >
                    <TransactionCard
                        title="Apply for Credit"
                        link="/credit/apply-credit"
                        iconType="credit"
                    />
                </Col>
                <Col
                    xs={12}
                    md={6}
                >
                    <TransactionCard
                        title="Make Repayment"
                        link="/credit/repay-credit"
                        iconType="repay"
                    />
                </Col>
            </Row>

            <Divider className="!border-slate-300 dark:!border-slate-700" />

            <Title
                level={3}
                className="text-slate-800 dark:text-slate-50 mb-6 font-semibold"
            >
                Recent Transactions
            </Title>

            <Card className={cn("shadow-xl border-none", "bg-white dark:bg-slate-800 dark:border-slate-700")}>
                <div className="text-slate-700 dark:text-slate-200">
                    <p className="font-medium text-lg mb-2">Transaction History Placeholder</p>
                    <p>Transaction table will be displayed here soon.</p>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
