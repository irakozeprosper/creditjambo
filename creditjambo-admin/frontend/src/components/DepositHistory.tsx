import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/getTransactions";
import { format } from "date-fns";

interface Transaction {
  transaction_id: number;
  first_name: string;
  last_name: string;
  type: "deposit" | "withdrawal" | "disbursement" | "repayment";
  account_number: string;
  amount: number;
  transaction_date: string;
  source_destination_name: string;
  source_destination_account: string;
}

const tabs = [
  { key: "all", label: "All Transactions" },
  { key: "deposit", label: "Deposits" },
  { key: "withdrawal", label: "Withdrawals" },
  { key: "disbursement", label: "Disbursements" },
  { key: "repayment", label: "Repayments" },
];

const ITEMS_PER_PAGE = 8;

const TransactionHistory: React.FC = () => {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: () => getTransactions.getAllTransactions(),
  });

  const [activeTab, setActiveTab] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Filter by type + date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const type = String(t.type || "").toLowerCase();
      const matchesType = activeTab === "all" || type === activeTab;
      const date = new Date(t.transaction_date);
      const afterStart = startDate ? date >= new Date(startDate) : true;
      const beforeEnd = endDate ? date <= new Date(endDate) : true;
      return matchesType && afterStart && beforeEnd;
    });
  }, [transactions, activeTab, startDate, endDate]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Transaction History
        </h2>

        {/* Date Range Picker */}
        <div className="flex items-center gap-3">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Account #
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Names
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {paginatedTransactions.map((t) => (
              <tr
                key={t.transaction_id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3 text-gray-800 font-medium">
                  {t.account_number}
                </td>
                <td className="px-6 py-3">
                  {`${t.first_name} ${t.last_name}`}
                </td>
                <td
                  className={`px-6 py-3 capitalize ${
                    t.type === "deposit"
                      ? "text-green-600"
                      : t.type === "withdrawal"
                      ? "text-red-600"
                      : t.type === "disbursement"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {t.type}
                </td>
                <td className="px-6 py-3 font-semibold">
                  {t.amount.toLocaleString()} RWF
                </td>
                <td className="px-6 py-3 text-gray-600">
                  {format(new Date(t.transaction_date), "dd MMM yyyy, HH:mm")}
                </td>
                <td className="px-6 py-3 text-gray-500">
                  {`${t.source_destination_name} (${t.source_destination_account})`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedTransactions.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No transactions found in this range or type.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
