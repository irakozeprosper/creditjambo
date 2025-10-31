import React from "react";
import { useParams, Navigate } from "react-router-dom";
import ApplyCredit from "../../components/forms/ApplyCredit";
import RepayCredit from "../../components/forms/RepayCredit";

type CreditsModule = "apply-credit" | "repay-credit";

const CreditsPage: React.FC = () => {
    const { module } = useParams<{ module: CreditsModule }>();

    const moduleMap = {
        "apply-credit": {
            Component: ApplyCredit,
            title: "Apply for Credit",
        },
        "repay-credit": {
            Component: RepayCredit,
            title: "Repay Credit",
        },
    };

    const current = moduleMap[module as CreditsModule];
    if (!current)
        return (
            <Navigate
                to="/credits/apply-credit"
                replace
            />
        );

    const { Component } = current;

    return (
        <div className="p-2 md:p-2 bg-slate-50 dark:bg-slate-900 min-h-full transition-colors">
            <Component />
        </div>
    );
};

export default CreditsPage;
