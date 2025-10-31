import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login/page";
import ForgotPassword from "./pages/auth/forgot-password/page";
import PageNotFound from "./pages/page-not-found/page";
import { ThemeProvider } from "./contexts/theme-context";
import Layout from "./pages/layout";
import Dashboard from "./pages/dashboard/page";
import SavingsPage from "./pages/savings/page";
import CreditsPage from "./pages/credits/page";
import ClientProfile from "./pages/profile/page";
import { AuthProvider } from "./contexts/authContext";
import ProtectedRoute from "./pages/protectedRoute";

function App() {
    return (
        <ThemeProvider storageKey="theme">
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route
                            path="/login"
                            element={<Login />}
                        />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />

                        {/* Protected / Layout routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                index
                                element={<Dashboard />}
                            />
                            <Route
                                path="savings/:module"
                                element={<SavingsPage />}
                            />
                            <Route
                                path="credit/:module"
                                element={<CreditsPage />}
                            />
                            <Route
                                path="/profile"
                                element={<ClientProfile />}
                            />
                        </Route>

                        {/* 404 fallback */}
                        <Route
                            path="*"
                            element={<PageNotFound />}
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
