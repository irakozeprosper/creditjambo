import React from "react";
import { Card } from "antd";
import { cn } from "../../utils/cn";

import type { ReactElement } from "react";

interface BalanceCardProps {
    title: string;
    value: number;

    icon: ReactElement;
    bgColor: string;
    isCurrency?: boolean;
}

const formatValue = (value: number, isCurrency = true) => {
    if (isCurrency) {
        return new Intl.NumberFormat("en-RW", {
            style: "currency",
            currency: "RWF",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    }
    return value.toLocaleString();
};

const BalanceCard: React.FC<BalanceCardProps> = ({ title, value, icon, bgColor, isCurrency = true }) => {
    return (
        <Card className={cn("shadow-lg border-none transition-shadow duration-300 hover:shadow-xl", "bg-white dark:bg-slate-800")}>
            <div className="flex justify-between items-center p-2">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{formatValue(value, isCurrency)}</p>
                </div>

                <div className={cn("p-3 rounded-full text-white w-12 h-12 flex items-center justify-center text-2xl", bgColor)}>{icon}</div>
            </div>
        </Card>
    );
};

export default BalanceCard;
