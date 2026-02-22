import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../types/auth.types";

interface AuthContextType {
    isAuthenticated: boolean;
    role: "CANDIDATE" | "RECRUITER" | null;
    userId: string | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<"CANDIDATE" | "RECRUITER" | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);

                if (decoded.exp * 1000 > Date.now()) {
                    setIsAuthenticated(true);
                    setRole(decoded.role);
                    setUserId(decoded.sub);
                } else {
                    localStorage.removeItem("token");
                }
            } catch {
                localStorage.removeItem("token");
            }
        }

        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);

        const decoded = jwtDecode<DecodedToken>(token);

        setIsAuthenticated(true);
        setRole(decoded.role);
        setUserId(decoded.sub);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, role, userId, isLoading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}