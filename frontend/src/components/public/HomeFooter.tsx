import { useRef } from "react";
import type { SearchIconHandle } from "@/components/ui/search";
import { SearchIcon } from "@/components/ui/search";

export function HomeFooter() {
    const searchIconRef = useRef<SearchIconHandle>(null);

    return (
        <footer className="border-t border-border/50 py-10 px-4 bg-background">
            <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div
                    className="flex items-center gap-2 cursor-default group"
                    onMouseEnter={() => searchIconRef.current?.startAnimation()}
                    onMouseLeave={() => searchIconRef.current?.stopAnimation()}
                >
                    <SearchIcon ref={searchIconRef} size={20} className="text-primary transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-bold text-sm text-foreground tracking-tight">Easy<span className="text-primary">Hire</span></span>
                </div>
                <p className="text-xs text-muted-foreground/60">
                    © {new Date().getFullYear()} EasyHire. Built with passion for modern hiring.
                </p>
            </div>
        </footer>
    );
}
