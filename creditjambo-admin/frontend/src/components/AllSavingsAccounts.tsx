import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { getSavingsAccounts } from "../api/getAllAccounts";

interface SavingsAccount {
  account_id: number;
  account_number: string;
  first_name: string;
  last_name: string;
  current_balance: number;
  created_at: Date;
}

const ITEMS_PER_PAGE = 10;

const AllSavingsAccounts: React.FC = () => {
  const { data: savingsAccounts = [], isLoading } = useQuery<SavingsAccount[]>({
    queryKey: ["SavingsAccounts"],
    queryFn: () => getSavingsAccounts.getAllSavingsAccount(),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 Filter by name or account number
  const filteredAccounts = useMemo(() => {
    return savingsAccounts.filter((account) => {
      const fullName =
        `${account.first_name} ${account.last_name}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        account.account_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [savingsAccounts, searchTerm]);

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Savings Accounts
        </h2>

        {/* 🔍 Search bar */}
        <input
          type="text"
          placeholder="Search by name or account number..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition"
        />
      </div>

      {paginatedAccounts.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No savings accounts found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-semibold rounded-tl-xl">
                  #
                </th>
                <th className="px-6 py-3 text-left font-semibold">
                  Account Number
                </th>
                <th className="px-6 py-3 text-left font-semibold">Owner</th>
                <th className="px-6 py-3 text-left font-semibold">Balance</th>
                <th className="px-6 py-3 text-left font-semibold rounded-tr-xl">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {paginatedAccounts.map((account, index) => (
                <tr
                  key={account.account_id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-150"
                >
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-800 dark:text-white">
                    {account.account_number}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {account.first_name} {account.last_name}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-200 font-semibold">
                    {account.current_balance.toLocaleString()} RWF
                  </td>
                  <td className="px-6 py-3 text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(account.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📄 Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-slate-600"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllSavingsAccounts;
