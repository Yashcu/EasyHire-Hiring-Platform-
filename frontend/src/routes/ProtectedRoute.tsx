import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
    children: React.ReactNode;
    allowedRole: "CANDIDATE" | "RECRUITER";
}

function ProtectedRoute({ children, allowedRole }: Props) {
    const { isAuthenticated, role, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role !== allowedRole) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;