import { useQuery } from "@tanstack/react-query";
import { getTransactionsToday } from "../../api/getAllTransactionsToday";
import { Spin } from "antd";
import { useState } from "react";

type Transaction = {
  transaction_id: number;
  account_id: number;
  first_name: string;
  last_name: string;
  account_number: number;
  type: "Deposit" | "Withdrawal" | "Transfer" | string;
  amount: number | string;
  transaction_date: Date;
};

export default function RecentTransactions() {
  const { data: transactions = [], isLoading: transactionsTodayLoading } =
    useQuery<Transaction[]>({
      queryKey: ["TransactionsToday"],
      queryFn: () => getTransactionsToday.getAllTransactionsToday(),
    });

  // --- Pagination state ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // transactions per page
  const totalPages = Math.ceil(transactions.length / pageSize);

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (transactionsTodayLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 font-sans">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-100 dark:border-slate-700">
        Recent Transactions
      </h2>

      {transactions.length === 0 ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No transactions found for today.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="text-xs tracking-wider">
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t) => (
                  <tr
                    key={t.transaction_id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition duration-150 text-gray-700 dark:text-gray-200"
                  >
                    <td>{t.first_name + " " + t.last_name}</td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          t.type === "Deposit"
                            ? "bg-green-100 text-green-700"
                            : t.type === "Withdrawal"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="font-semibold">RWF. {t.amount}</td>
                    <td className="text-gray-500 dark:text-gray-400">
                      {new Date(t.transaction_date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-slate-600 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "border-gray-300 dark:border-slate-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-slate-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
