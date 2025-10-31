import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { authService, type LoginDTO } from "../api/authService";

export type UserType = {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    token: string;
    expiryTime: number;
};

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (credentials: LoginDTO) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(credentials);
            const { user, token } = response;

            // Normalize and restrict to clients only
            const role = user.role?.toLowerCase();
            if (role !== "client") {
                throw new Error("Access denied. Only clients can log in from this page.");
            }

            // Store user & token in context
            login(token, user);

            // Redirect to client dashboard
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
};

export default useLogin;
