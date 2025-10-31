import React from "react";
import { Table } from "antd";

const ApprovedLoans: React.FC = () => {
  const data = [
    {
      key: "1",
      borrower: "Alice Uwimana",
      amount: 500000,
      approvedDate: "2025-10-26",
      repaymentStatus: "Ongoing",
    },
    {
      key: "2",
      borrower: "John Doe",
      amount: 300000,
      approvedDate: "2025-10-24",
      repaymentStatus: "Ongoing",
    },
  ];

  const columns = [
    { title: "Borrower", dataIndex: "borrower", key: "borrower" },
    {
      title: "Approved Amount",
      dataIndex: "amount",
      key: "amount",
      render: (val: number) => `${val} RWF`,
    },
    { title: "Approved Date", dataIndex: "approvedDate", key: "approvedDate" },
    {
      title: "Repayment Status",
      dataIndex: "repaymentStatus",
      key: "repaymentStatus",
    },
  ];

  return <Table dataSource={data} columns={columns} />;
};

export default ApprovedLoans;
