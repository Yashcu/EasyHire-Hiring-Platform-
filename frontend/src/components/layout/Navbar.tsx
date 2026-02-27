import { Briefcase, LogOut, Moon, Sun, ChevronRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const { token, role, logout } = useAuthStore();
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 w-full glass-panel border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-apple transition-transform duration-300 group-hover:scale-105">
                        <Briefcase className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2} />
                    </div>
                    <span className="hidden sm:inline-block font-bold text-lg tracking-tight text-foreground">
                        EasyHire
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    {/* Dark Mode Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full h-9 w-9 hover:bg-accent btn-press"
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
                    </Button>

                    {/* Dynamic Navigation Actions */}
                    {token ? (
                        <>
                            <Link
                                to={role === "RECRUITER" ? "/recruiter" : "/candidate"}
                                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${isActive(role === "RECRUITER" ? "/recruiter" : "/candidate")
                                        ? "text-primary bg-primary/8"
                                        : "text-foreground/70 hover:text-foreground hover:bg-accent"
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/8 rounded-lg btn-press gap-1.5"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg transition-colors duration-200"
                            >
                                Sign in
                            </Link>
                            <Button
                                asChild
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 shadow-apple btn-press font-medium"
                            >
                                <Link to="/register" className="flex items-center gap-1">
                                    Get Started
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}