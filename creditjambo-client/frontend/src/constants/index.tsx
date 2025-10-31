// src/constants/index.ts or src/constants/sidebar.ts

import { ArrowRightLeft, BanknoteArrowDown, BanknoteArrowUp, HandCoins, House, LogOut, User, WalletCards } from "lucide-react";
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
                icon: House,
            },
        ],
    },
    {
        title: "My Savings",
        links: [
            {
                label: "Make a Deposit",
                path: "/savings/deposit",
                icon: BanknoteArrowUp,
            },
            {
                label: "Withdraw Funds",
                path: "/savings/withdraw",
                icon: BanknoteArrowDown,
            },
            {
                label: "Transactions History",
                path: "/savings/history",
                icon: ArrowRightLeft,
            },
        ],
    },
    {
        title: "Credit Services",
        links: [
            {
                label: "Apply for Credit",
                path: "/credit/apply-credit",
                icon: HandCoins,
            },
            {
                label: "Repay Credit",
                path: "/credit/repay-credit",
                icon: WalletCards,
            },
        ],
    },
    {
        title: "Account",
        links: [
            {
                label: "Profile Settings",
                path: "/profile",
                icon: User,
            },
            {
                label: "Logout",
                path: "/logout", // Use this path to trigger logout logic
                icon: LogOut,
            },
        ],
    },
];
