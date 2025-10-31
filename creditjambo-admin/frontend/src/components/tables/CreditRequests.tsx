import { useQuery } from "@tanstack/react-query";
import { getLoanRequests } from "../../api/loanRequests";
import { Spin } from "antd";
import { useState } from "react";

interface LoanRequests {
  request_id: number;
  account_number: number;
  first_name: string;
  last_name: string;
  requested_amount: number;
  request_status: string;
}

export default function CreditRequests() {
  const { data: loanRequests = [], isLoading: loanRequestsLoading } = useQuery<
    LoanRequests[]
  >({
    queryKey: ["LoanRequests"],
    queryFn: () => getLoanRequests.getAllLoanRequests(),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // requests per page
  const totalPages = Math.ceil(loanRequests.length / pageSize);

  const paginatedRequests = loanRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loanRequestsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Credit Requests
      </h2>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 dark:border-slate-700">
          <tr>
            <th>User</th>
            <th>Account</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequests.map((r) => (
            <tr
              key={r.request_id}
              className="border-b border-gray-100 dark:border-slate-700"
            >
              <td>{r.first_name + " " + r.last_name}</td>
              <td>{r.account_number}</td>
              <td>{r.requested_amount}</td>
              <td>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    r.request_status === "Approved"
                      ? "bg-green-100 text-green-600"
                      : r.request_status === "Rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {r.request_status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
}
