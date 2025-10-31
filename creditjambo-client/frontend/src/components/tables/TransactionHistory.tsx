import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Spin, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { transactionHistoryService } from "../../api/transctionHistoryService";
import { useAuth } from "../../contexts/authContext";

const { Text } = Typography;

interface Transaction {
    transaction_id: number;
    account_id: number;
    type: "Deposit" | "Withdrawal" | "Interest";
    amount: number;
    status: "Completed" | "Pending" | "Failed";
    reference_number: string;
    transaction_date: string;
    source_destination_name: string;
    source_destination_account: string;
}

const getStatusTag = (status: Transaction["status"]) => {
    switch (status) {
        case "Completed":
            return <Tag color="success">{status}</Tag>;
        case "Pending":
            return <Tag color="processing">{status}</Tag>;
        case "Failed":
            return <Tag color="error">{status}</Tag>;
        default:
            return <Tag>{status}</Tag>;
    }
};

const columns: ColumnsType<Transaction> = [
    {
        title: "Date",
        dataIndex: "transaction_date",
        key: "transaction_date",
        sorter: (a, b) => a.transaction_date.localeCompare(b.transaction_date),
        render: (date: string) => new Date(date).toLocaleDateString(),
        className: "dark:bg-slate-700 dark:text-slate-50",
    },
    {
        title: "Type",
        dataIndex: "type",
        key: "type",
        render: (type: Transaction["type"]) => (
            <Tag color={type === "Deposit" ? "blue" : type === "Withdrawal" ? "volcano" : "gold"}>{type.toUpperCase()}</Tag>
        ),
        className: "dark:bg-slate-700 dark:text-slate-50",
    },
    {
        title: "Amount (RWF)",
        dataIndex: "amount",
        key: "amount",
        sorter: (a, b) => a.amount - b.amount,
        render: (amount: number, record) => {
            const color = record.type === "Withdrawal" ? "text-red-600" : "text-green-600";
            const sign = record.type === "Withdrawal" ? "-" : "+";
            return (
                <Text
                    strong
                    className={color}
                >
                    {sign} {amount.toLocaleString()}
                </Text>
            );
        },
        className: "dark:bg-slate-700 dark:text-slate-50",
    },
    {
        title: "Source/Destination",
        dataIndex: "source_destination_name",
        key: "source_destination_name",
        render: (name: string, record) => <Text>{`${name} (${record.source_destination_account})`}</Text>,
        className: "dark:bg-slate-700 dark:text-slate-50",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: getStatusTag,
        className: "dark:bg-slate-700 dark:text-slate-50",
    },
];

export const TransactionHistory: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = useAuth().user?.user_id;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // First get the user's account ID
                const accountRes = await fetch(`http://localhost:5000/api/savings-accounts/account/${userId}`);
                if (!accountRes.ok) throw new Error("Failed to fetch account");
                const account = await accountRes.json();
                const accountId = account.account_id;

                // Fetch transaction history by account ID
                const data = await transactionHistoryService.getTransactionsByAccountId(accountId);
                setTransactions(data);
            } catch (error: any) {
                notification.error({
                    message: "Error fetching transactions",
                    description: error.message || "Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchTransactions();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spin tip="Loading transaction history..." />
            </div>
        );
    }

    return (
        <div className="py-4">
            <Table
                columns={columns}
                dataSource={transactions.map((t) => ({
                    key: t.transaction_id,
                    ...t,
                }))}
                pagination={{ pageSize: 8 }}
                scroll={{ x: "max-content" }}
                className="dark:bg-slate-800 dark:border-slate-600 ant-table-dark-mode"
            />
        </div>
    );
};
