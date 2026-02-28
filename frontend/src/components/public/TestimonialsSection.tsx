export function TestimonialsSection() {
    return (
        <section className="py-24 px-4 border-t border-border/50 relative overflow-hidden bg-background">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="max-w-6xl mx-auto w-full relative z-10">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">Testimonials</p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                        Loved by thousands
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Placeholder Testimonials */}
                    {[
                        { name: "Sarah J.", role: "Software Engineer", company: "TechNova", text: "I applied to 5 companies and got 3 interviews within a week. The one-click apply is a game changer." },
                        { name: "Michael R.", role: "Recruiter", company: "InnoSoft", text: "We streamlined our entire hiring pipeline. Reviewing applicants has never been this visually simple." },
                        { name: "Elena T.", role: "Product Manager", company: "GlobalWeb", text: "Finding the right remote role was tough until I found EasyHire. Tracked everywhere right from my dashboard." }
                    ].map((t, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm flex flex-col h-full hover:shadow-apple transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center font-bold text-foreground ring-1 ring-primary/20">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.role} at <span className="text-foreground/80 font-medium">{t.company}</span></p>
                                </div>
                            </div>
                            <p className="text-[15px] text-muted-foreground leading-relaxed italic flex-grow">"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
