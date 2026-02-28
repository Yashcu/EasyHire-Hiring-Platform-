import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield } from "lucide-react";
import { SearchIcon } from "@/components/ui/search";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
import { ZapIcon } from "@/components/ui/zap";

interface HeroSectionProps {
    userRole: 'candidate' | 'recruiter';
    onRoleSwitch: (role: 'candidate' | 'recruiter') => void;
}

export function HeroSection({ userRole, onRoleSwitch }: HeroSectionProps) {
    const navigate = useNavigate();

    return (
        <section className="relative flex-1 flex flex-col items-center justify-start text-center px-4 pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-gradient-animated opacity-60" />
            <div className="absolute top-[20%] left-[30%] -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute top-[20%] right-[30%] translate-x-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[120px] mix-blend-screen pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto w-full">
                {/* Role switcher toggle */}
                <div className="flex justify-center mb-5 animate-fade-in-down">
                    <div className="inline-flex items-center p-1 bg-muted/20 border border-border/40 rounded-full text-[13px] sm:text-sm font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-foreground/5 backdrop-blur-md relative">
                        <button
                            onClick={() => onRoleSwitch('candidate')}
                            className={`relative z-10 px-4 py-1.5 rounded-full transition-colors ${userRole === 'candidate' ? 'text-foreground shadow-sm' : 'text-muted-foreground/80 hover:text-foreground'}`}
                        >
                            I'm a Candidate
                        </button>
                        <button
                            onClick={() => onRoleSwitch('recruiter')}
                            className={`relative z-10 px-4 py-1.5 rounded-full transition-colors ${userRole === 'recruiter' ? 'text-foreground shadow-sm' : 'text-muted-foreground/80 hover:text-foreground'}`}
                        >
                            I'm a Recruiter
                        </button>
                        {/* Animated Background Pill */}
                        <div
                            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background rounded-full transition-all duration-300 ease-in-out shadow-sm"
                            style={{
                                left: userRole === 'candidate' ? '4px' : 'calc(50%)',
                                right: userRole === 'candidate' ? 'calc(50%)' : '4px'
                            }}
                        />
                    </div>
                </div>

                {/* Headline */}
                <h1 className="animate-fade-in-up text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground leading-[1.05] mb-6 min-h-[140px] md:min-h-[160px] flex flex-col justify-end transition-all duration-300">
                    {userRole === 'candidate' ? (
                        <>
                            Find talent.{" "}
                            <br className="hidden md:block" />
                            <span className="text-gradient">Get hired.</span>
                        </>
                    ) : (
                        <>
                            Post jobs.{" "}
                            <br className="hidden md:block" />
                            <span className="text-gradient">Hire faster.</span>
                        </>
                    )}
                </h1>

                {/* Subtitle */}
                <p className="animate-fade-in-up delay-200 text-base md:text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed font-light min-h-[80px] transition-all duration-300">
                    {userRole === 'candidate'
                        ? "Connect with top companies, track your applications seamlessly, and launch your career all from one beautifully simple platform."
                        : "Easily post jobs, manage thousands of candidates, and streamline your hiring process on the most modern recruiting platform."}
                </p>

                {/* CTA buttons */}
                <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => navigate('/register', { state: { defaultTab: userRole } })}
                        size="lg"
                        className="h-13 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-apple-lg btn-press font-semibold w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        {userRole === 'candidate' ? "Start for free" : "Create recruiter account"}
                        <ArrowRightIcon size={16} />
                    </Button>
                    <Button
                        onClick={() => navigate('/login', { state: { defaultTab: userRole } })}
                        size="lg"
                        variant="outline"
                        className="h-13 px-8 text-base rounded-2xl border-primary/20 hover:border-primary/40 focus:ring-primary/20 hover:bg-primary/5 bg-transparent shadow-sm btn-press font-medium transition-all w-full sm:w-auto"
                    >
                        {userRole === 'candidate' ? "Explore jobs" : "Find candidates"}
                    </Button>
                </div>

                {/* Fake Search Bar Mockup */}
                <div className="animate-fade-in-up delay-[600ms] w-full max-w-2xl mx-auto mt-8 relative group cursor-text">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 to-purple-500/30 blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                    <div className="relative flex items-center bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl h-14 sm:h-16 px-4 sm:px-6 shadow-apple">
                        <SearchIcon size={20} className="text-muted-foreground mr-3 shrink-0" />
                        <div className="flex-1 bg-transparent border-none outline-none text-[15px] sm:text-base text-muted-foreground/70 text-left line-clamp-1 transition-all duration-300">
                            {userRole === 'candidate'
                                ? 'Search for "Software Engineer" or "Remote"...'
                                : 'Search for "React Developer" or paste resume...'}
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-3">
                            <span className="text-[11px] font-semibold text-muted-foreground border border-border/80 rounded px-1.5 py-0.5 bg-muted/50 shadow-sm">Ctrl</span>
                            <span className="text-[11px] font-semibold text-muted-foreground border border-border/80 rounded px-1.5 py-0.5 bg-muted/50 shadow-sm">K</span>
                        </div>
                    </div>
                </div>

                {/* Trust bar */}
                <div className="animate-fade-in delay-[800ms] mt-8 flex flex-wrap justify-center gap-6 sm:gap-10 text-[13px] sm:text-sm text-muted-foreground/90 font-medium">
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Verified companies
                    </div>
                    <div className="flex items-center gap-2">
                        <ZapIcon size={16} className="text-primary" />
                        One-click apply
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Real-time tracking
                    </div>
                </div>
            </div>
        </section>
    );
}
