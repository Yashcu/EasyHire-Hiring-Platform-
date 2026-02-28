import { useState, useEffect } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { useInternships } from "@/hooks/useInternships";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { MyApplications } from "@/components/candidate/MyApplications";
import { ProfileForm } from "@/components/candidate/ProfileForm";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import { SearchIcon } from "@/components/ui/search";
import { MapPinIcon } from "@/components/ui/map-pin";

export function CandidateDashboard() {
    const location = useLocation();

    let activeTab = "explore";
    if (location.pathname === "/candidate/applications") activeTab = "applications";
    if (location.pathname === "/candidate/profile") activeTab = "profile";

    const [filters, setFilters] = useState({
        keyword: "",
        location: "",
        minStipend: "",
    });

    const [page, setPage] = useState(0);

    const debouncedKeyword = useDebounce(filters.keyword, 300);
    const debouncedLocation = useDebounce(filters.location, 300);
    const debouncedMinStipend = useDebounce(filters.minStipend, 300);

    useEffect(() => {
        setPage(0);
    }, [debouncedKeyword, debouncedLocation, debouncedMinStipend]);

    const { data, isLoading, isError } = useInternships({
        keyword: debouncedKeyword,
        location: debouncedLocation,
        minStipend: debouncedMinStipend,
        page,
        status: 'OPEN'
    });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Tabs value={activeTab} className="w-full flex-1 flex flex-col">
                {/* Main Content Area */}
                <div className="flex-1 bg-muted/20">
                    <div className="container max-w-6xl mx-auto py-10 px-4">
                        <TabsContent value="explore" className="flex flex-col gap-6 mt-0 focus-visible:outline-none">
                            {/* Minimal Search Bar */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                                <div className="relative flex-1">
                                    <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 z-10" />
                                    <Input
                                        placeholder="Search by role or company..."
                                        className="pl-10 h-12 rounded-xl bg-card border-border/60 text-[15px] shadow-sm transition-all focus-visible:ring-primary/20"
                                        value={filters.keyword}
                                        onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                                    />
                                </div>
                                <div className="relative sm:w-64 shrink-0">
                                    <MapPinIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 z-10" />
                                    <Input
                                        placeholder="Location..."
                                        className="pl-10 h-12 rounded-xl bg-card border-border/60 text-[15px] shadow-sm transition-all focus-visible:ring-primary/20"
                                        value={filters.location}
                                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Job Listings Area */}
                            <div className="flex-1">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                        {data?.totalElements ? `${data.totalElements} Opportunities Found` : "Opportunities"}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                                    {isLoading && (
                                        <>
                                            {[...Array(6)].map((_, i) => (
                                                <Skeleton key={i} className="h-[220px] w-full rounded-2xl border border-border/40 shadow-sm" />
                                            ))}
                                        </>
                                    )}
                                    {isError && (
                                        <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-border/50 shadow-sm">
                                            <p className="text-destructive font-medium">Failed to load internships. Please try again.</p>
                                        </div>
                                    )}
                                    {data?.content.length === 0 && (
                                        <div className="col-span-full text-center py-24 bg-card rounded-2xl border border-dashed border-border flex flex-col items-center justify-center">
                                            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                                <Inbox className="h-8 w-8 text-muted-foreground/50" />
                                            </div>
                                            <p className="text-lg font-semibold text-foreground">No internships match your filters.</p>
                                            <p className="text-sm text-muted-foreground mt-1 max-w-sm">Try tweaking your search terms, changing the location, or lowering your minimum stipend expectation.</p>
                                            <Button
                                                variant="outline"
                                                className="mt-6 rounded-xl btn-press"
                                                onClick={() => setFilters({ keyword: "", location: "", minStipend: "" })}
                                            >
                                                Clear Filters
                                            </Button>
                                        </div>
                                    )}

                                    {data?.content.map((internship) => (
                                        <div key={internship.id} className="animate-fade-in-up h-full">
                                            <InternshipCard internship={internship} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {data && data.totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-10 pt-6 border-t border-border/50">
                                        <Button
                                            variant="outline"
                                            className="rounded-xl btn-press shadow-sm"
                                            disabled={data.first}
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm font-medium text-muted-foreground tabular-nums px-2">
                                            Page {data.number + 1} of {data.totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl btn-press shadow-sm"
                                            disabled={data.last}
                                            onClick={() => setPage(p => p + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="applications" className="mt-0 focus-visible:outline-none animate-fade-in-up">
                            <MyApplications />
                        </TabsContent>

                        <TabsContent value="profile" className="mt-0 focus-visible:outline-none animate-fade-in-up">
                            <ProfileForm />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}