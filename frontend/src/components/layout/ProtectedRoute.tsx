import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
    allowedRole?: "CANDIDATE" | "RECRUITER" | "ADMIN";
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
    const { token, role } = useAuthStore();

    // Not logged in? Kick to login page.
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Logged in, but wrong role? Kick to their specific dashboard or home.
    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    // If everything is good, render the child routes!
    return <Outlet />;
}