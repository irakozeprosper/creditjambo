// src/constants/index.ts or src/constants/sidebar.ts

import {
  HomeOutlined,
  DollarOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";

// Define the type for a single navigation link item
interface LinkItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size: number; className: string }>;
}

// Define the type for the group structure (e.g., "Main", "Financial")
interface NavbarGroup {
  title: string;
  links: LinkItem[];
}

export const navbarLinks: NavbarGroup[] = [
  {
    title: "Main",
    links: [
      {
        label: "Dashboard",
        path: "/",
        icon: HomeOutlined,
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: BellOutlined,
      },
    ],
  },
  {
    title: "Savings Management",
    links: [
      {
        label: "Savings Accounts",
        path: "/savings-management/all-accounts",
        icon: DollarOutlined,
      },
      {
        label: "Transaction History",
        path: "/savings-management/transaction-history",
        icon: DollarOutlined,
      },
    ],
  },
  {
    title: "Credit Management",
    links: [
      {
        label: "Loan Requests",
        path: "/credit-management/loan-requests",
        icon: DollarOutlined,
      },
    ],
  },
  {
    title: "User Management",
    links: [
      {
        label: "All Users",
        path: "/user-management/list-users",
        icon: UserOutlined,
      },
    ],
  },
];
