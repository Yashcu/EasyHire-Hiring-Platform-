import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { api } from "@/lib/api";
import type { Application, PaginatedResponse } from "@/types";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Inbox, ExternalLink } from "lucide-react";
import { CalendarDaysIcon } from "@/components/ui/calendar-days";
import { SearchIcon } from "@/components/ui/search";
import { getApplicationStatusConfig } from "@/utils/status";
import { Input } from "@/components/ui/input";

export function MyApplications() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data, isLoading, isError } = useQuery<PaginatedResponse<Application>>({
        queryKey: ['my-applications'],
        queryFn: async () => {
            const response = await api.get('/applications/me?page=0&size=50');
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="h-28 w-full rounded-2xl border-border/40 bg-muted/20 animate-pulse" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-20 bg-card rounded-2xl border border-border/50 shadow-sm">
                <p className="text-destructive font-medium">Failed to load your applications. Please try tracking them again later.</p>
            </div>
        );
    }

    const applications = data?.content || [];
    const filteredApplications = applications.filter(app => {
        const titleMatch = app.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const companyMatch = app.companyName && app.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || companyMatch;
    });

    return (
        <div className="space-y-6 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">My Applications</h2>
                    <p className="text-muted-foreground mt-1 text-[15px]">Monitor the status and progress of the internships you've pursued.</p>
                </div>
                {/* Search Bar for Applications */}
                <div className="relative w-full sm:w-72 mt-2 sm:mt-0">
                    <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                    <Input
                        placeholder="Search applications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-card border-border/50 h-10 shadow-sm rounded-xl focus-visible:ring-primary/20 transition-all text-[14px]"
                    />
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border shadow-sm flex flex-col items-center">
                    <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-5">
                        <Inbox className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">No applications found.</p>
                    <p className="text-base text-muted-foreground mt-1.5 max-w-md">Your application history is currently empty. Head over to the 'Find Internships' tab to start applying!</p>
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col items-center">
                    <SearchIcon size={48} className="text-muted-foreground/40 mb-4" />
                    <p className="text-lg font-semibold text-foreground">No matching applications</p>
                    <p className="text-[15px] text-muted-foreground mt-1">Try adjusting your search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredApplications.map((app) => {
                        const statusConfig = getApplicationStatusConfig(app.status);
                        return (
                            <Card
                                key={app.applicationId}
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 sm:px-5 border-border/50 hover:border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-card w-full relative overflow-hidden"
                            >
                                {/* Left Side Branding & Title */}
                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto overflow-hidden">
                                    <div className="h-10 w-10 rounded-xl bg-white border border-border/50 shadow-sm flex items-center justify-center shrink-0 overflow-hidden dark:bg-zinc-950">
                                        <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${app.companyName || app.internshipTitle}&backgroundColor=transparent`} alt="Default Company Logo" className="h-full w-full object-cover opacity-90 transition-transform duration-300 hover:scale-110" />
                                    </div>
                                    <div className="space-y-0.5 min-w-0 pr-4">
                                        <h3 className="font-semibold text-[14px] sm:text-[15px] text-foreground tracking-tight group-hover:text-primary transition-colors truncate w-full">
                                            {app.internshipTitle}
                                        </h3>
                                        <div className="flex items-center gap-x-2 sm:gap-x-3 gap-y-1 text-[12px] sm:text-[13px] text-muted-foreground font-medium truncate w-full min-w-0">
                                            <span className="truncate max-w-[100px] sm:max-w-[120px] shrink-0">
                                                {app.companyName || "Independent"}
                                            </span>
                                            <span className="text-border/60 shrink-0">&bull;</span>
                                            <span className="flex items-center gap-1 opacity-80 shrink-0">
                                                <CalendarDaysIcon size={14} />
                                                {format(new Date(app.appliedAt), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Info & Status */}
                                <div className="mt-3.5 sm:mt-0 flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto sm:pl-6 border-t sm:border-t-0 sm:border-l border-border/30 pt-3.5 sm:pt-0 shrink-0">
                                    <div className="flex items-center gap-4 flex-1 justify-between sm:justify-end">
                                        <div className="flex flex-col items-start sm:items-end gap-0.5">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Current Status</span>
                                            <div className="flex items-center">
                                                <span className={`h-2 h-2 rounded-full mr-1.5 ${statusConfig.dot}`} />
                                                <span className={`text-[12px] sm:text-[13px] font-semibold ${statusConfig.style.split(' ')[1]}`}>
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                        </div>
                                        {app.resumeUrl && (
                                            <a
                                                href={app.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 rounded-lg h-8 sm:h-9 px-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors ml-2 border border-primary/20"
                                            >
                                                <span className="hidden sm:inline-block">Resume</span>
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}