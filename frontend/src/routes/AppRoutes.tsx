import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<div>Public Page</div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<div>Register Page</div>} />

            <Route
                path="/candidate/dashboard"
                element={
                    <ProtectedRoute allowedRole="CANDIDATE">
                        <div>Candidate Dashboard</div>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/dashboard"
                element={
                    <ProtectedRoute allowedRole="RECRUITER">
                        <div>Recruiter Dashboard</div>
                    </ProtectedRoute>
                }
            />

            <Route path="/403" element={<div>Access Denied</div>} />
            <Route path="*" element={<div>404</div>} />
        </Routes>
    );
}

export default AppRoutes;