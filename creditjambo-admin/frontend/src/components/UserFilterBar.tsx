import React, { useState } from "react";

interface Props {
  onFilterChange: (filters: { search?: string; status?: string }) => void;
}

const UserFilterBar: React.FC<Props> = ({ onFilterChange }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ search, status });
  };

  return (
    <div className="flex space-x-4 mb-4">
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={handleFilterChange}
        className="flex-1 p-2 border rounded"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        onBlur={handleFilterChange}
        className="p-2 border rounded"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>
  );
};

export default UserFilterBar;
