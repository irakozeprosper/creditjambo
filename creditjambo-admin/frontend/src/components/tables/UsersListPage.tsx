import { useState } from "react";
import { Plus } from "lucide-react";
import { UsersTable } from "./UsersTable";
import { getUsers } from "../../api/getAllUsers";
import { useQuery } from "@tanstack/react-query";

export default function UsersListPage() {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers.getAllUsers(),
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <button
          onClick={() => (window.location.href = "/users/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      {/* Card Container */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 space-y-4">
        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            className="w-64 p-2 border rounded-md dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* User Table */}
        <UsersTable data={users} loading={isLoading} />
      </div>
    </div>
  );
}
