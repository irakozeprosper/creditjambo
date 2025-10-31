import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Card } from "antd";
import { cn } from "../../utils/cn";

// Import the specific module components
import UsersListPage from "../../components/tables/UsersListPage";
import UserProfilePage from "../../components/UserProfilePage";

// Define allowed module paths
type UsersModule = "list-users" | "kyc-approvals" | "profile" | "new-user";

const UsersManagementPage: React.FC = () => {
  // Get the dynamic part of the URL (e.g., 'list', 'kyc-approvals', 'profile')
  const { module } = useParams<{ module: UsersModule }>();

  // --- Module Mapping ---

  let CurrentComponent: React.FC<any> | null = null;

  let titleText = "";

  switch (module) {
    case "list-users":
      CurrentComponent = UsersListPage;
      titleText = "All Users";
      break;
      break;
    case "profile":
      CurrentComponent = UserProfilePage;
      titleText = "User Profile";
      break;
    default:
      // Fallback: redirect to Users List if URL doesn't match any module
      return <Navigate to="/users/list" replace />;
  }

  return (
    <div className="p-2 md:p-4 min-h-full transition-colors">
      <Card
        className={cn(
          "shadow-xl border-none p-2",
          "bg-white dark:bg-slate-800 dark:border-slate-700"
        )}
      >
        {CurrentComponent && <CurrentComponent />}
      </Card>
    </div>
  );
};

export default UsersManagementPage;
