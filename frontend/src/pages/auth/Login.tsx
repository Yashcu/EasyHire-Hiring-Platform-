import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, ArrowRight } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: async (data: LoginForm) => {
            const response = await api.post("/auth/login", data);
            return response.data;
        },
        onSuccess: (data) => {
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const userRole = payload.role;
            setAuth(data.token, userRole);
            if (userRole === "RECRUITER") navigate("/recruiter");
            else navigate("/candidate");
        },
        onError: () => {
            form.setError("root", { message: "Invalid email or password" });
        }
    });

    const onSubmit = (data: LoginForm) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="flex flex-1 items-center justify-center p-4">
            <div className="animate-scale-in w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-apple-lg">
                        <Briefcase className="h-7 w-7 text-primary-foreground" strokeWidth={1.8} />
                    </div>
                </div>

                {/* Card */}
                <div className="bg-card rounded-2xl border border-border/60 shadow-apple-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1.5">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Sign in to continue to your dashboard</p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="h-11 rounded-xl bg-muted/50 border-border/60 focus-visible:ring-primary/25 transition-colors"
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && (
                                <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-11 rounded-xl bg-muted/50 border-border/60 focus-visible:ring-primary/25 transition-colors"
                                {...form.register("password")}
                            />
                            {form.formState.errors.password && (
                                <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        {form.formState.errors.root && (
                            <div className="text-sm text-destructive text-center font-medium bg-destructive/8 rounded-xl py-2.5 px-4">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-apple btn-press font-semibold text-sm"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign in
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}