import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, FileText, CheckCircle, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">

            {/* ══════════════════════════════════════
               HERO SECTION
               ══════════════════════════════════════ */}
            <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24 md:py-36 overflow-hidden">
                {/* Ambient background glow */}
                <div className="absolute inset-0 bg-gradient-animated opacity-60" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* Pill badge */}
                    <div className="animate-fade-in-down inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-primary text-sm font-medium mb-8 shadow-apple">
                        <Sparkles className="h-3.5 w-3.5" />
                        The modern hiring platform
                    </div>

                    {/* Headline */}
                    <h1 className="animate-fade-in-up text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground leading-[1.05] mb-6">
                        Find talent.{" "}
                        <br className="hidden md:block" />
                        <span className="text-gradient">Get hired.</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Connect with top companies, track your applications seamlessly, and launch your career all from one beautifully simple platform.
                    </p>

                    {/* CTA buttons */}
                    <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="h-13 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-apple-lg btn-press font-semibold"
                        >
                            <Link to="/register" className="flex items-center gap-2">
                                Start for free
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-13 px-8 text-base rounded-2xl border-border/60 hover:bg-accent btn-press font-medium"
                        >
                            <Link to="/login">Post a job</Link>
                        </Button>
                    </div>

                    {/* Trust bar */}
                    <div className="animate-fade-in delay-600 mt-14 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground/70">
                        <div className="flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5" />
                            Verified companies
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5" />
                            One-click apply
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Real-time tracking
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
               HOW IT WORKS
               ══════════════════════════════════════ */}
            <section className="py-24 px-4 bg-background relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-primary tracking-wider uppercase mb-3">How it works</p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                            Three steps to your<br className="hidden md:block" /> next opportunity
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Search,
                                title: "Discover",
                                desc: "Browse hundreds of verified internships across top companies and fast-growing startups.",
                                color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                                num: "01"
                            },
                            {
                                icon: FileText,
                                title: "Apply",
                                desc: "Set up your profile and resume once, then apply to any position with a single click.",
                                color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                                num: "02"
                            },
                            {
                                icon: CheckCircle,
                                title: "Get Hired",
                                desc: "Track your application status in real-time and land your dream role faster.",
                                color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                                num: "03"
                            }
                        ].map((step) => (
                            <div
                                key={step.num}
                                className="group relative p-7 rounded-2xl border border-border/50 bg-card hover:shadow-apple-lg transition-all duration-500 card-hover"
                            >
                                <div className="flex items-center gap-4 mb-5">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${step.color} transition-transform duration-300 group-hover:scale-110`}>
                                        <step.icon className="h-5.5 w-5.5" strokeWidth={1.8} />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground/40 tracking-widest">{step.num}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-[15px]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
               FOOTER
               ══════════════════════════════════════ */}
            <footer className="border-t border-border/50 py-10 px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground tracking-tight">EasyHire</span>
                    </div>
                    <p className="text-xs text-muted-foreground/60">
                        © {new Date().getFullYear()} EasyHire. Built with passion for modern hiring.
                    </p>
                </div>
            </footer>
        </div>
    );
}