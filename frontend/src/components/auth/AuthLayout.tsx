import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    footerText: React.ReactNode;
    variant?: "login" | "register";
}

export function AuthLayout({ children, title, subtitle, footerText, variant = "login" }: AuthLayoutProps) {
    return (
        <div className="flex flex-1 items-center justify-center p-4 py-8 relative min-h-[calc(100vh-4rem)] overflow-x-hidden">
            {/* Ambient Background for form anchoring */}
            <div className="absolute inset-0 bg-primary/5 dark:bg-transparent transition-colors duration-500"></div>

            {variant === "login" ? (
                <>
                    <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none mix-blend-screen" />
                    <div className="absolute top-[60%] left-[20%] w-[250px] h-[250px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none mix-blend-screen" />
                </>
            ) : (
                <>
                    <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] rounded-full bg-primary/10 blur-[120px] pointer-events-none mix-blend-screen" />
                    <div className="absolute top-[60%] right-[20%] w-[250px] h-[250px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none mix-blend-screen" />
                </>
            )}

            <div className="animate-scale-in w-full max-w-[400px] relative z-10">
                {/* Card */}
                <div className="bg-card rounded-2xl border border-border/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] p-5 sm:p-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl pointer-events-none opacity-50"></div>
                    <div className="relative z-10 text-center mb-5">
                        <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">{title}</h1>
                        <p className="text-[13px] text-muted-foreground font-medium">{subtitle}</p>
                    </div>

                    {children}

                    <div className="mt-5 text-center text-[13px] text-muted-foreground relative z-10 font-medium pb-1">
                        {footerText}
                    </div>
                </div>
            </div>
        </div>
    );
}
