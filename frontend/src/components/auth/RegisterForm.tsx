import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Search, Users, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["CANDIDATE", "RECRUITER"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: "CANDIDATE" }
    });

    const selectedRole = form.watch("role");

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterFormValues) => {
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

    const onSubmit = (data: RegisterFormValues) => registerMutation.mutate(data);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Role Selector */}
            <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-foreground/80">I want to...</Label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => form.setValue("role", "CANDIDATE")}
                        className={`relative flex items-center justify-center gap-1.5 h-[42px] rounded-xl border-[2px] text-[13px] font-bold transition-all duration-300 btn-press overflow-hidden ${selectedRole === "CANDIDATE"
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/30 opacity-70 hover:opacity-100"
                            }`}
                    >
                        {selectedRole === "CANDIDATE" && (
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-purple-500"></div>
                        )}
                        <Search className="h-4 w-4" />
                        Find Jobs
                    </button>
                    <button
                        type="button"
                        onClick={() => form.setValue("role", "RECRUITER")}
                        className={`relative flex items-center justify-center gap-1.5 h-[42px] rounded-xl border-[2px] text-[13px] font-bold transition-all duration-300 btn-press overflow-hidden ${selectedRole === "RECRUITER"
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/30 opacity-70 hover:opacity-100"
                            }`}
                    >
                        {selectedRole === "RECRUITER" && (
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-purple-500"></div>
                        )}
                        <Users className="h-4 w-4" />
                        Hire Talent
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-foreground/80">First Name</Label>
                    <Input
                        className="h-[42px] rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 transition-all text-sm"
                        placeholder="e.g., John"
                        {...form.register("firstName")}
                    />
                    {form.formState.errors.firstName && (
                        <p className="text-[12px] text-destructive mt-1 font-medium">{form.formState.errors.firstName.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-foreground/80">Last Name</Label>
                    <Input
                        className="h-[42px] rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 transition-all text-sm"
                        placeholder="e.g., Doe"
                        {...form.register("lastName")}
                    />
                    {form.formState.errors.lastName && (
                        <p className="text-[12px] text-destructive mt-1 font-medium">{form.formState.errors.lastName.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-foreground/80">Email</Label>
                <Input
                    type="email"
                    className="h-[42px] rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 transition-all text-sm"
                    placeholder="candidate@gmail.com"
                    {...form.register("email")}
                />
                {form.formState.errors.email && (
                    <p className="text-[12px] text-destructive mt-1 font-medium">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-foreground/80">Password</Label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        className="h-[42px] rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 transition-all text-sm pr-9"
                        placeholder="********"
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
                    disabled={registerMutation.isPending}
                >
                    {registerMutation.isPending ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-[1.5px] border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Please wait...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {selectedRole === "CANDIDATE" ? "Join as Candidate" : "Start Recruiting"}
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
