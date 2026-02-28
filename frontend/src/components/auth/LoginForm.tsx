import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormValues) => {
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

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] font-semibold text-foreground/80">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-[42px] rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 transition-all text-sm"
                    {...form.register("email")}
                />
                {form.formState.errors.email && (
                    <p className="text-[12px] text-destructive mt-1 font-medium">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px] font-semibold text-foreground/80">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder=""
                        className="h-[42px] rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 transition-all text-sm pr-9"
                        {...form.register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-[2px]"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {form.formState.errors.password && (
                    <p className="text-[12px] text-destructive mt-1 font-medium">{form.formState.errors.password.message}</p>
                )}
            </div>

            {form.formState.errors.root && (
                <div className="text-[13px] text-destructive text-center font-medium bg-destructive/8 rounded-xl py-2 px-4 shadow-sm">
                    {form.formState.errors.root.message}
                </div>
            )}

            <div className="pt-1.5">
                <Button
                    type="submit"
                    className="w-full h-[42px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-apple btn-press font-bold text-sm"
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-[1.5px] border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Signing in...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Sign in
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
