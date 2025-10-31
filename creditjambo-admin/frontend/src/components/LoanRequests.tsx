import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getLoanRequests } from "../api/loanRequests";
import api from "../api/axiosInstance";

interface LoanRequest {
  request_id: number;
  account_number: number;
  first_name: string;
  last_name: string;
  requested_amount: number;
  duration: number;
  request_status: "Pending" | "Approved" | "Rejected";
  purpose: string;
  requested_at: string;
  income: number;
}

const tabs = [
  { key: "all", label: "All Requests" },
  { key: "Pending", label: "Pending" },
  { key: "Approved", label: "Approved" },
  { key: "Rejected", label: "Rejected" },
];

const ITEMS_PER_PAGE = 10;

const LoanRequestsTable: React.FC = () => {
  const queryClient = useQueryClient();

  // 🧠 Fetch all loan requests
  const { data: loanRequests = [], isLoading } = useQuery<LoanRequest[]>({
    queryKey: ["loanRequests"],
    queryFn: () => getLoanRequests.getAllLoanRequests(),
  });

  const [activeTab, setActiveTab] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  // 🧩 Filter by status and date range
  const filteredRequests = useMemo(() => {
    return loanRequests.filter((r) => {
      const matchesStatus =
        activeTab === "all" ||
        r.request_status.toLowerCase() === activeTab.toLowerCase();

      const date = new Date(r.requested_at);
      const afterStart = startDate
        ? date.getTime() >= new Date(startDate).getTime()
        : true;
      const beforeEnd = endDate
        ? date.getTime() <= new Date(endDate).getTime()
        : true;

      return matchesStatus && afterStart && beforeEnd;
    });
  }, [loanRequests, activeTab, startDate, endDate]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 🧭 Mutations (Approve / Reject)
  const approveMutation = useMutation({
    mutationFn: async (request_id: number) => {
      const res = await api.patch(`/loan-requests/${request_id}/status`, {
        request_status: "Approved",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loanRequests"] });
      setSelectedRequest(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (request_id: number) => {
      const res = await api.patch(`/loan-requests/${request_id}/status`, {
        request_status: "Rejected",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loanRequests"] });

      setSelectedRequest(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner text-blue-500"></span>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Loan Requests</h2>

        {/* Date Range */}
        <div className="flex items-center gap-3">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400"
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
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Amount (RWF)
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Date
              </th>
              {activeTab === "Pending" && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {paginatedRequests.map((r) => (
              <tr
                key={r.request_id}
                onClick={() => setSelectedRequest(r)}
                className="hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="px-6 py-3 text-gray-800 font-medium">
                  {r.first_name} {r.last_name}
                </td>
                <td className="px-6 py-3">{r.account_number}</td>
                <td className="px-6 py-3 font-semibold">
                  {r.requested_amount.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-gray-800 font-medium">
                  {r.duration} Months
                </td>
                <td
                  className={`px-6 py-3 capitalize font-medium ${
                    r.request_status === "Pending"
                      ? "text-yellow-600"
                      : r.request_status === "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {r.request_status}
                </td>
                <td className="px-6 py-3 text-gray-600">
                  {r.requested_at
                    ? format(new Date(r.requested_at), "dd MMM yyyy")
                    : "—"}
                </td>
                {activeTab === "Pending" && (
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          approveMutation.mutate(r.request_id);
                        }}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rejectMutation.mutate(r.request_id);
                        }}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No loan requests found in this range or category.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedRequest(null)}
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Loan Request Details
            </h3>

            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>Applicant:</strong> {selectedRequest.first_name}{" "}
                {selectedRequest.last_name}
              </p>
              <p>
                <strong>account:</strong> {selectedRequest.account_number}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                {selectedRequest.requested_amount.toLocaleString()} RWF
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">
                  {selectedRequest.request_status}
                </span>
              </p>
              <p>
                <strong>Reason:</strong> {selectedRequest.purpose || "N/A"}
              </p>
              <p>
                <p>
                  <strong>Monthly Income:</strong>{" "}
                  <span className="capitalize">{selectedRequest.income}</span>
                </p>
                <strong>Date:</strong>{" "}
                {selectedRequest.requested_at
                  ? format(
                      new Date(selectedRequest.requested_at),
                      "dd MMM yyyy, HH:mm"
                    )
                  : "—"}
              </p>
            </div>

            {selectedRequest.request_status === "Pending" && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() =>
                    approveMutation.mutate(selectedRequest.request_id)
                  }
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    rejectMutation.mutate(selectedRequest.request_id)
                  }
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanRequestsTable;
