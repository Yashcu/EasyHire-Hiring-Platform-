import { Moon, Sun, ChevronRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { LogoutIcon, type LogoutIconHandle } from "@/components/ui/logout";
import { SearchIcon, type SearchIconHandle } from "@/components/ui/search";
import { useRef } from "react";

export function Navbar() {
    const { token, role, logout } = useAuthStore();
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const logoutIconRef = useRef<LogoutIconHandle>(null);
    const searchIconRef = useRef<SearchIconHandle>(null);

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 w-full glass-panel border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 relative">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2.5 group"
                    onMouseEnter={() => searchIconRef.current?.startAnimation()}
                    onMouseLeave={() => searchIconRef.current?.stopAnimation()}
                >
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-apple transition-transform duration-300 group-hover:scale-105">
                        <SearchIcon ref={searchIconRef} size={20} className="text-primary-foreground" />
                    </div>
                    <span className="hidden sm:inline-block font-extrabold text-xl tracking-tight text-foreground">
                        Easy<span className="text-primary">Hire</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                {token && role === 'CANDIDATE' && (
                    <div className="hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link to="/candidate" className={`text-[15px] font-medium px-4 py-2 hover:text-foreground transition-colors ${isActive('/candidate') ? 'text-foreground' : 'text-muted-foreground'}`}>Find Jobs</Link>
                        <span className="text-border/60">|</span>
                        <Link to="/candidate/applications" className={`text-[15px] font-medium px-4 py-2 hover:text-foreground transition-colors ${isActive('/candidate/applications') ? 'text-foreground' : 'text-muted-foreground'}`}>My Applications</Link>
                        <span className="text-border/60">|</span>
                        <Link to="/candidate/profile" className={`text-[15px] font-medium px-4 py-2 hover:text-foreground transition-colors ${isActive('/candidate/profile') ? 'text-foreground' : 'text-muted-foreground'}`}>Profile</Link>
                    </div>
                )}

                {token && role === 'RECRUITER' && (
                    <div className="hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link to="/recruiter" className={`text-[15px] font-medium px-4 py-2 hover:text-foreground transition-colors ${isActive('/recruiter') ? 'text-foreground' : 'text-muted-foreground'}`}>My Postings</Link>
                        <span className="text-border/60">|</span>
                        <Link to="/recruiter/new" className={`text-[15px] font-medium px-4 py-2 hover:text-foreground transition-colors ${isActive('/recruiter/new') ? 'text-foreground' : 'text-muted-foreground'}`}>Post a Job</Link>
                        <span className="text-border/60">|</span>
                        <Link to="/recruiter/settings" className={`text-[15px] font-medium px-4 py-2 hover:text-foreground transition-colors ${isActive('/recruiter/settings') ? 'text-foreground' : 'text-muted-foreground'}`}>Company</Link>
                    </div>
                )}

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
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                onMouseEnter={() => logoutIconRef.current?.startAnimation()}
                                onMouseLeave={() => logoutIconRef.current?.stopAnimation()}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/8 rounded-lg btn-press gap-1.5"
                            >
                                <LogoutIcon ref={logoutIconRef} size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors duration-200"
                            >
                                Sign in
                            </Link>
                            <Button
                                asChild
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-7 shadow-apple btn-press font-medium"
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

            {/* Mobile Navigation Links */}
            {token && role === 'CANDIDATE' && (
                <div className="md:hidden flex overflow-x-auto items-center justify-center border-t border-border/50 px-4 py-2 scrollbar-none gap-2 w-full">
                    <Link to="/candidate" className={`text-[13px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${isActive('/candidate') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted/50 hover:text-foreground'}`}>Find Jobs</Link>
                    <Link to="/candidate/applications" className={`text-[13px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${isActive('/candidate/applications') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted/50 hover:text-foreground'}`}>My Applications</Link>
                    <Link to="/candidate/profile" className={`text-[13px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${isActive('/candidate/profile') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted/50 hover:text-foreground'}`}>Profile Settings</Link>
                </div>
            )}

            {token && role === 'RECRUITER' && (
                <div className="md:hidden flex overflow-x-auto items-center justify-center border-t border-border/50 px-4 py-2 scrollbar-none gap-2 w-full">
                    <Link to="/recruiter" className={`text-[13px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${isActive('/recruiter') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted/50 hover:text-foreground'}`}>My Postings</Link>
                    <Link to="/recruiter/new" className={`text-[13px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${isActive('/recruiter/new') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted/50 hover:text-foreground'}`}>Post a Job</Link>
                    <Link to="/recruiter/settings" className={`text-[13px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${isActive('/recruiter/settings') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted/50 hover:text-foreground'}`}>Company Details</Link>
                </div>
            )}
        </nav>
    );
}