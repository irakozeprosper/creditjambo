import React from "react";
import { DollarOutlined, SwapOutlined, CreditCardOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";

type IconType = "deposit" | "withdraw" | "credit" | "repay";

interface TransactionCardProps {
    title: string;
    link: string;
    iconType: IconType;
}

const getIcon = (type: IconType) => {
    switch (type) {
        case "deposit":
            return <ArrowUpOutlined className="text-3xl text-green-500" />;
        case "withdraw":
            return <ArrowDownOutlined className="text-3xl text-red-500" />;
        case "credit":
            return <CreditCardOutlined className="text-3xl text-indigo-500" />;
        case "repay":
            return <SwapOutlined className="text-3xl text-blue-500" />;
        default:
            return <DollarOutlined className="text-3xl text-gray-400" />;
    }
};

const TransactionCard: React.FC<TransactionCardProps> = ({ title, link, iconType }) => {
    return (
        <Link to={link}>
            <div
                className={cn(
                    "p-4 rounded-lg shadow-md border-b-4 border-transparent hover:shadow-xl transition-all duration-200 cursor-pointer",
                    "bg-white dark:bg-slate-800 dark:hover:bg-slate-700",
                    iconType === "repay" && "border-blue-500 hover:border-blue-700"
                )}
            >
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-50">{title}</p>
                    {getIcon(iconType)}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Go to Module</p>
            </div>
        </Link>
    );
};

export default TransactionCard;
