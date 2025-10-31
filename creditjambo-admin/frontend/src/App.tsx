import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import Dashboard from "./pages/dashboard/page";
import PageNotFound from "./pages/page-not-found/page";
import UsersManagementPage from "./pages/user-management/page";
import SavingsManagementPage from "./pages/savings-management/page";
import CreditManagementPage from "./pages/credit-management/page";
import LoginPage from "./pages/auth/login/page";
import { AuthProvider } from "./contexts/authContext";
import ProtectedRoute from "./pages/protectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          {/* Protected / Layout routes */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
              path="/user-management/:module"
              element={<UsersManagementPage />}
            />
            <Route
              path="/savings-management/:module"
              element={<SavingsManagementPage />}
            />
            <Route
              path="/credit-management/:module"
              element={<CreditManagementPage />}
            />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
