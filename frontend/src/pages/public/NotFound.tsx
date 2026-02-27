import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center bg-background">
            <div className="animate-scale-in">
                {/* Large 404 text */}
                <h1 className="text-[120px] md:text-[160px] font-black tracking-tighter leading-none text-gradient mb-2">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
                    Page not found
                </h2>

                <p className="text-base text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-apple btn-press font-semibold"
                    >
                        <Link to="/" className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="h-12 px-6 rounded-2xl btn-press"
                    >
                        <Link to="/login" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Sign in
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}