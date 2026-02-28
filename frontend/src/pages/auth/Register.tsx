import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export function Register() {
    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join EasyHire and start your journey today"
            variant="register"
            footerText={
                <>
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:text-primary/80 font-bold transition-colors hover:underline underline-offset-4">
                        Sign in
                    </Link>
                </>
            }
        >
            <RegisterForm />
        </AuthLayout>
    );
}