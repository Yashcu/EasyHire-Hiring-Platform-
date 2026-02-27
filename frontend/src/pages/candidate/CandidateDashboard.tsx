import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Internship, PaginatedResponse } from "@/types";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyApplications } from "@/components/candidate/MyApplications";
import { ProfileForm } from "@/components/candidate/ProfileForm";
import { Button } from "@/components/ui/button";
import { Search, MapPin, IndianRupee, Inbox } from "lucide-react";

export function CandidateDashboard() {
    const [filters, setFilters] = useState({
        keyword: "",
        location: "",
        minStipend: "",
    });

    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [filters]);

    const { data, isLoading, isError } = useQuery<PaginatedResponse<Internship>>({
        queryKey: ['internships', filters, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                status: 'OPEN',
                page: page.toString(),
                size: '10'
            });

            if (filters.keyword) params.append('keyword', filters.keyword);
            if (filters.location) params.append('location', filters.location);
            if (filters.minStipend) params.append('minStipend', filters.minStipend);

            const response = await api.get(`/internships?${params.toString()}`);
            return response.data;
        }
    });

    return (
        <div className="container max-w-6xl mx-auto py-10 px-4">
            <Tabs defaultValue="explore" className="w-full">
                <div className="animate-fade-in-up">
                    <TabsList className="inline-flex h-11 p-1 bg-muted/60 border border-border/40 rounded-xl mb-8">
                        <TabsTrigger value="explore" className="rounded-lg px-5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-apple">
                            Find Jobs
                        </TabsTrigger>
                        <TabsTrigger value="applications" className="rounded-lg px-5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-apple">
                            My Applications
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="rounded-lg px-5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-apple">
                            Profile
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="explore" className="flex flex-col md:flex-row gap-6 animate-fade-in-up delay-100">
                    {/* Filters Sidebar */}
                    <div className="w-full md:w-64 shrink-0 space-y-5 bg-card p-5 rounded-2xl border border-border/50 shadow-apple h-fit">
                        <h2 className="font-semibold text-base text-foreground tracking-tight">Filters</h2>

                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                <Input
                                    placeholder="e.g. React Developer"
                                    className="pl-9 h-10 rounded-xl bg-muted/50 border-border/60 text-sm"
                                    value={filters.keyword}
                                    onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                <Input
                                    placeholder="e.g. Bangalore"
                                    className="pl-9 h-10 rounded-xl bg-muted/50 border-border/60 text-sm"
                                    value={filters.location}
                                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Min Stipend</Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                <Input
                                    type="number"
                                    placeholder="e.g. 10000"
                                    className="pl-9 h-10 rounded-xl bg-muted/50 border-border/60 text-sm"
                                    value={filters.minStipend}
                                    onChange={(e) => setFilters(prev => ({ ...prev, minStipend: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Find your next opportunity
                            </h1>
                            <p className="text-muted-foreground mt-1.5 text-[15px]">
                                Discover {data?.totalElements || 0} open internships waiting for you.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {isLoading && (
                                <>
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-52 w-full rounded-2xl" />
                                    ))}
                                </>
                            )}
                            {isError && (
                                <div className="col-span-full text-center py-16 bg-card rounded-2xl border border-border/50 shadow-apple">
                                    <p className="text-destructive font-medium">Failed to load internships. Please try again.</p>
                                </div>
                            )}
                            {data?.content.length === 0 && (
                                <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                                    <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-base font-medium text-muted-foreground">No internships match your filters.</p>
                                    <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search criteria.</p>
                                </div>
                            )}

                            {data?.content.map((internship) => (
                                <InternshipCard key={internship.id} internship={internship} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {data && data.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-border/50">
                                <Button
                                    variant="outline"
                                    className="rounded-xl btn-press"
                                    disabled={data.first}
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm font-medium text-muted-foreground tabular-nums">
                                    Page {data.number + 1} of {data.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    className="rounded-xl btn-press"
                                    disabled={data.last}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="applications" className="animate-fade-in-up">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Applications</h1>
                        <p className="text-muted-foreground mt-1.5 text-[15px]">Track the status of your internship applications.</p>
                    </div>
                    <MyApplications />
                </TabsContent>

                <TabsContent value="profile" className="animate-fade-in-up">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
                        <p className="text-muted-foreground mt-1.5 text-[15px]">Keep your profile up to date for faster applications.</p>
                    </div>
                    <ProfileForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}