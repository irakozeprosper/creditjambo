import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook-based logout service
 * This can be called in any component to log out the current user.
 */
export const useLogoutService = () => {
  const { logout } = useAuth(); // your existing auth hook
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
