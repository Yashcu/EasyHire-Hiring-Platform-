import { ZapIcon } from "@/components/ui/zap";

interface HowItWorksSectionProps {
    userRole: 'candidate' | 'recruiter';
}

export function HowItWorksSection({ userRole }: HowItWorksSectionProps) {
    return (
        <section className="py-24 px-4 bg-background relative">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">How it works</p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                        Three steps to your<br className="hidden md:block" /> next opportunity
                    </h2>
                </div>

                <div className="relative mt-16">
                    {/* Connecting line */}
                    <div className="hidden md:block absolute top-[23px] left-[16.66%] w-[66.66%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative z-10">
                        {(userRole === 'candidate' ? [
                            {
                                title: "Discover",
                                desc: "Browse hundreds of verified internships across top companies and fast-growing startups.",
                            },
                            {
                                title: "Apply",
                                desc: "Set up your profile and resume once, then apply to any position with a single click.",
                            },
                            {
                                title: "Get Hired",
                                desc: "Track your application status in real-time and land your dream role faster.",
                            }
                        ] : [
                            {
                                title: "Post Jobs",
                                desc: "Create detailed job listings in seconds with our streamlined intuitive posting flow.",
                            },
                            {
                                title: "Review",
                                desc: "Quickly scan through applicants, review resumes, and shortlist the best talent.",
                            },
                            {
                                title: "Hire",
                                desc: "Update application statuses and hire the perfect candidate directly on the platform.",
                            }
                        ]).map((step, i) => (
                            <div
                                key={step.title}
                                className="group relative flex flex-col items-center text-center"
                            >
                                {/* Number Circle */}
                                <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-extrabold bg-background border-[3px] border-border shadow-sm ring-8 ring-background group-hover:border-primary group-hover:text-primary transition-all duration-300 text-muted-foreground z-10 mb-8">
                                    {i + 1}
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-[15px] max-w-[280px]">{step.desc}</p>

                                {/* Visual payload for Get Hired / Hire */}
                                {i === 2 && (
                                    <div className="mt-8 transition-all duration-500 scale-95 group-hover:scale-100">
                                        {userRole === 'candidate' ? (
                                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase shadow-sm border border-emerald-500/20 backdrop-blur-md">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                Status: Offer Accepted
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase shadow-sm border border-primary/20 backdrop-blur-md">
                                                <ZapIcon size={14} />
                                                Candidate Hired
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
