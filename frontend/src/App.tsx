import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Home } from "@/pages/public/Home";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { CandidateDashboard } from "@/pages/candidate/CandidateDashboard";
import { RecruiterDashboard } from "./pages/recruiter/RecruiterDashboard";
import { JobApplicants } from "@/pages/recruiter/JobApplicants";
import { NotFound } from "@/pages/public/NotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔒 Protected Candidate Routes */}
            <Route element={<ProtectedRoute allowedRole="CANDIDATE" />}>
              <Route path="/candidate" element={<CandidateDashboard />} />
              <Route path="/candidate/applications" element={<CandidateDashboard />} />
              <Route path="/candidate/profile" element={<CandidateDashboard />} />
            </Route>

            {/* 🔒 Protected Recruiter Routes */}
            <Route element={<ProtectedRoute allowedRole="RECRUITER" />}>
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/recruiter/new" element={<RecruiterDashboard />} />
              <Route path="/recruiter/settings" element={<RecruiterDashboard />} />
              <Route path="/recruiter/internships/:jobId/applicants" element={<JobApplicants />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;