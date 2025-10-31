import { useEffect, useState, useCallback } from "react";
import type { User } from "../types/user.types";

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Uwimana",
    email: "alice@creditjambo.com",
    phone: "+250788111222",
    role: "Customer",
    kycStatus: "Approved",
    balance: 125000,
    status: "Active",
  },
  {
    id: "2",
    name: "Jean Bosco",
    email: "jean@creditjambo.com",
    phone: "+250788333444",
    role: "Customer",
    kycStatus: "Pending",
    balance: 56000,
    status: "Pending",
  },
  {
    id: "3",
    name: "Grace Mukamana",
    email: "grace@creditjambo.com",
    phone: "+250788555666",
    role: "Loan Officer",
    kycStatus: "Approved",
    balance: 0,
    status: "Active",
  },
];

interface UseUsersOptions {
  status?: string;
  search?: string;
  kycStatus?: string;
}

export function useUsers(options?: UseUsersOptions) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      let filtered = [...mockUsers];

      if (options?.status && options.status !== "all") {
        filtered = filtered.filter(
          (u) => u.status.toLowerCase() === options.status?.toLowerCase()
        );
      }

      if (options?.kycStatus) {
        filtered = filtered.filter(
          (u) => u.kycStatus.toLowerCase() === options.kycStatus?.toLowerCase()
        );
      }

      if (options?.search?.trim()) {
        const q = options.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.includes(q)
        );
      }

      setUsers(filtered);
      setLoading(false);
    }, 300);
  }, [options?.status, options?.search, options?.kycStatus]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ✅ Add this helper function:
  const getUserById = (id: string) => {
    return mockUsers.find((u) => u.id === id);
  };

  return { users, loading, refresh: loadUsers, getUserById };
}
