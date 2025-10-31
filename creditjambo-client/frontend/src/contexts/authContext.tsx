import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    phone_number?: string;
    date_of_birth?: Date;
    created_at?: Date;
}

export interface AuthUser extends User {
    token: string;
    expiryTime: number;
}

interface AuthContextType {
    token: string | null;
    user: AuthUser | null;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    login: (token: string, userData: User, sessionDurationMinutes?: number) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Restore user session on mount
    useEffect(() => {
        const restoreSession = () => {
            const storedAuth = localStorage.getItem("authUser");
            if (storedAuth) {
                const parsed: AuthUser = JSON.parse(storedAuth);
                if (parsed.expiryTime > Date.now()) {
                    setUser(parsed);
                    setToken(parsed.token);
                    setIsAuthenticated(true);

                    // Auto logout when expiry time reached
                    const remaining = parsed.expiryTime - Date.now();
                    setAutoLogout(remaining);
                } else {
                    // Expired token
                    localStorage.removeItem("authUser");
                }
            }
            setLoading(false);
        };

        restoreSession();
    }, []);

    // Automatically log out after session duration
    const setAutoLogout = (duration: number) => {
        setTimeout(() => logout(), duration);
    };

    // Login and persist user info
    const login = (token: string, userData: User, sessionDurationMinutes = 120) => {
        const expiryTime = Date.now() + sessionDurationMinutes * 60 * 1000;
        const authUser: AuthUser = { ...userData, token, expiryTime };

        localStorage.setItem("authUser", JSON.stringify(authUser));

        setUser(authUser);
        setToken(token);
        setIsAuthenticated(true);
        setAutoLogout(sessionDurationMinutes * 60 * 1000);
    };

    // Logout and clear storage
    const logout = () => {
        localStorage.removeItem("authUser");
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, user, setUser, setToken, login, logout, isAuthenticated, loading }}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
