import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/arrow-right";

interface CTASectionProps {
    userRole: 'candidate' | 'recruiter';
}

export function CTASection({ userRole }: CTASectionProps) {
    const navigate = useNavigate();

    return (
        <section className="py-24 px-4 relative overflow-hidden border-t border-border/50 bg-background">
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
            <div className="max-w-4xl mx-auto w-full text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Ready to get started?</h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">Join the fastest growing network of top talent and innovative companies today.</p>
                <Button
                    onClick={() => navigate('/register', { state: { defaultTab: userRole } })}
                    size="lg"
                    className="h-14 px-10 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-apple-lg btn-press font-semibold"
                >
                    {userRole === 'candidate' ? "Create an account" : "Start hiring now"}
                    <ArrowRightIcon size={18} className="ml-2" />
                </Button>
            </div>
        </section>
    );
}
