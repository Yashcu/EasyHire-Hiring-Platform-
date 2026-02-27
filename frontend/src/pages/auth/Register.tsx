import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, ArrowRight, Search, Users } from "lucide-react";

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["CANDIDATE", "RECRUITER"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
    const navigate = useNavigate();
    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: "CANDIDATE" }
    });

    const selectedRole = form.watch("role");

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterForm) => {
            const response = await api.post("/auth/register", data);
            return response.data;
        },
        onSuccess: () => {
            navigate("/login");
        },
        onError: (error: any) => {
            form.setError("root", {
                message: error.response?.data?.message || "Registration failed. Email might already exist."
            });
        }
    });

    const onSubmit = (data: RegisterForm) => registerMutation.mutate(data);

    return (
        <div className="flex flex-1 items-center justify-center p-4 py-10">
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
                        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1.5">Create your account</h1>
                        <p className="text-sm text-muted-foreground">Join EasyHire and start your journey today</p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Role Selector — Apple-style segmented control */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">I want to...</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => form.setValue("role", "CANDIDATE")}
                                    className={`flex items-center justify-center gap-2 h-12 rounded-xl border-2 text-sm font-medium transition-all duration-200 btn-press ${selectedRole === "CANDIDATE"
                                            ? "border-primary bg-primary/8 text-primary"
                                            : "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/50"
                                        }`}
                                >
                                    <Search className="h-4 w-4" />
                                    Find Jobs
                                </button>
                                <button
                                    type="button"
                                    onClick={() => form.setValue("role", "RECRUITER")}
                                    className={`flex items-center justify-center gap-2 h-12 rounded-xl border-2 text-sm font-medium transition-all duration-200 btn-press ${selectedRole === "RECRUITER"
                                            ? "border-primary bg-primary/8 text-primary"
                                            : "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/50"
                                        }`}
                                >
                                    <Users className="h-4 w-4" />
                                    Hire Talent
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">First Name</Label>
                                <Input
                                    className="h-11 rounded-xl bg-muted/50 border-border/60"
                                    placeholder="John"
                                    {...form.register("firstName")}
                                />
                                {form.formState.errors.firstName && (
                                    <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Last Name</Label>
                                <Input
                                    className="h-11 rounded-xl bg-muted/50 border-border/60"
                                    placeholder="Doe"
                                    {...form.register("lastName")}
                                />
                                {form.formState.errors.lastName && (
                                    <p className="text-xs text-destructive">{form.formState.errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Email</Label>
                            <Input
                                type="email"
                                className="h-11 rounded-xl bg-muted/50 border-border/60"
                                placeholder="you@example.com"
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && (
                                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Password</Label>
                            <Input
                                type="password"
                                className="h-11 rounded-xl bg-muted/50 border-border/60"
                                placeholder="••••••••"
                                {...form.register("password")}
                            />
                            {form.formState.errors.password && (
                                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
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
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create account
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}