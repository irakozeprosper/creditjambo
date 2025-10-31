import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

export const useLogoutService = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Clear local authentication state
            logout();

            // Redirect to login or home page
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return { handleLogout };
};
