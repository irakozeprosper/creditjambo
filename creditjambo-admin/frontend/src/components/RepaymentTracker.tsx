import React from "react";
import { Table } from "antd";

const RepaymentTracker: React.FC = () => {
  const data = [
    {
      key: "1",
      borrower: "Alice Uwimana",
      loanAmount: 500000,
      amountPaid: 200000,
      remaining: 300000,
      nextDue: "2025-11-05",
    },
    {
      key: "2",
      borrower: "John Doe",
      loanAmount: 300000,
      amountPaid: 100000,
      remaining: 200000,
      nextDue: "2025-11-02",
    },
  ];

  const columns = [
    { title: "Borrower", dataIndex: "borrower", key: "borrower" },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      key: "loanAmount",
      render: (val: number) => `${val} RWF`,
    },
    {
      title: "Amount Paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (val: number) => `${val} RWF`,
    },
    {
      title: "Remaining Amount",
      dataIndex: "remaining",
      key: "remaining",
      render: (val: number) => `${val} RWF`,
    },
    { title: "Next Due Date", dataIndex: "nextDue", key: "nextDue" },
  ];

  return <Table dataSource={data} columns={columns} />;
};

export default RepaymentTracker;
