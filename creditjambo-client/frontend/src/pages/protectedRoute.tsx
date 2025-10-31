// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Spin } from "antd";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );

    if (!user)
        return (
            <Navigate
                to="/login"
                replace
            />
        );

    return <>{children}</>;
};

export default ProtectedRoute;
