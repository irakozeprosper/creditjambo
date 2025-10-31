import React from "react";
import { Table, Tag, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Transaction {
    id: string;
    date: string;
    type: "Deposit" | "Withdrawal" | "Loan Request" | "Loan Repayment";
    amount: number;
    status: "Completed" | "Pending" | "Failed" | "Approved" | "Repaid";
    description: string;
}

interface TransactionsTableProps {
    data: Transaction[];
}

const getStatusColor = (status: Transaction["status"]): string => {
    switch (status) {
        case "Completed":
        case "Approved":
        case "Repaid":
            return "success";
        case "Pending":
            return "warning";
        case "Failed":
            return "error";
        default:
            return "default";
    }
};

const TransactionsTable: React.FC<TransactionsTableProps> = ({ data }) => {
    const columns: ColumnsType<Transaction> = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            responsive: ["sm"],
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            filters: [
                { text: "Deposit", value: "Deposit" },
                { text: "Withdrawal", value: "Withdrawal" },
                { text: "Loan", value: "Loan" },
            ],
            onFilter: (value, record) => record.type.indexOf(value as string) === 0,
        },
        {
            title: "Amount (RWF)",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number, record) => (
                <span
                    className={
                        record.type === "Deposit" || record.type === "Loan Repayment" ? "text-green-600 font-medium" : "text-red-600 font-medium"
                    }
                >
                    {amount.toLocaleString("en-US", { signDisplay: "always" })}
                </span>
            ),
            sorter: (a, b) => a.amount - b.amount,
            responsive: ["md"],
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (status: Transaction["status"]) => (
                <Tag
                    color={getStatusColor(status)}
                    key={status}
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            responsive: ["lg"],
        },
        {
            title: "Action",
            key: "action",
            render: (_) => (
                <Space size="middle">
                    <a className="text-indigo-600 hover:text-indigo-800">View Details</a>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Table
                columns={columns}
                dataSource={data.map((item) => ({ ...item, key: item.id }))}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
            />
        </div>
    );
};

export default TransactionsTable;

export const MockTransactionData: Transaction[] = [
    {
        id: "1001",
        date: "2025-10-20",
        type: "Deposit",
        amount: 50000,
        status: "Completed",
        description: "Monthly savings contribution",
    },
    {
        id: "1002",
        date: "2025-10-18",
        type: "Withdrawal",
        amount: -15000,
        status: "Completed",
        description: "ATM withdrawal for utilities",
    },
    {
        id: "1003",
        date: "2025-10-15",
        type: "Loan Request",
        amount: 250000,
        status: "Pending",
        description: "Application for small business loan",
    },
    {
        id: "1004",
        date: "2025-10-01",
        type: "Loan Repayment",
        amount: 75000,
        status: "Repaid",
        description: "Installment 3 of 12",
    },
    {
        id: "1005",
        date: "2025-09-28",
        type: "Deposit",
        amount: 100000,
        status: "Completed",
        description: "Salary deposit",
    },
];
