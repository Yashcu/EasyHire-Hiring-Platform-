import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export function Login() {
    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Let's get you back to your dream job."
            variant="login"
            footerText={
                <>
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:text-primary/80 font-bold transition-colors hover:underline underline-offset-4">
                        Sign up
                    </Link>
                </>
            }
        >
            <LoginForm />
        </AuthLayout>
    );
}