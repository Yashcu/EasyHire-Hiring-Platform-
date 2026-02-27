import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Internship, PaginatedResponse } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Users, MoreVertical, Edit, XCircle, Archive, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function MyPostings() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [view, setView] = useState("ACTIVE");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Internship | null>(null);

    const handleEditClick = (job: Internship) => {
        setSelectedJob(job);
        setEditModalOpen(true);
    };

    const { data, isLoading } = useQuery<PaginatedResponse<Internship>>({
        queryKey: ['internships', 'recruiter', page, view],
        queryFn: async () => {
            const statusFilter = view === "ACTIVE" ? "OPEN,DRAFT" : "CLOSED";
            const response = await api.get(`/internships?page=${page}&size=10&status=${statusFilter}`);
            return response.data;
        }
    });

    const closeJobMutation = useMutation({
        mutationFn: async (jobId: string) => {
            await api.patch(`/internships/${jobId}/status`, { status: "CLOSED" });
        },
        onSuccess: () => {
            toast.success("Job moved to archive.");
            queryClient.invalidateQueries({ queryKey: ['internships', 'recruiter'] });
        },
        onError: () => {
            toast.error("Failed to close job. Please try again.");
        }
    });

    const updateJobMutation = useMutation({
        mutationFn: async ({ jobId, data }: { jobId: string; data: any }) => {
            await api.put(`/internships/${jobId}`, data);
        },
        onSuccess: () => {
            toast.success("Job details updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['internships', 'recruiter'] });
            setEditModalOpen(false);
        },
        onError: () => {
            toast.error("Failed to update job details.");
        }
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN': return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50";
            case 'CLOSED': return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50";
            default: return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50";
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-44 rounded-2xl bg-muted/50 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Sub-Navigation */}
            <Tabs value={view} onValueChange={(val) => { setView(val); setPage(0); }} className="w-full">
                <TabsList className="inline-flex h-10 p-1 bg-muted/50 border border-border/40 rounded-xl">
                    <TabsTrigger value="ACTIVE" className="rounded-lg px-5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-apple">
                        Active
                    </TabsTrigger>
                    <TabsTrigger value="ARCHIVE" className="rounded-lg px-5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-apple">
                        <Archive className="h-3.5 w-3.5 mr-1.5" />
                        Archived
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.content.length === 0 ? (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-border/50 rounded-2xl">
                        <Inbox className="h-10 w-10 text-muted-foreground/25 mx-auto mb-3" />
                        <p className="text-base font-medium text-muted-foreground">
                            No {view === "ACTIVE" ? "active" : "archived"} postings found.
                        </p>
                        <p className="text-sm text-muted-foreground/60 mt-1">
                            {view === "ACTIVE" ? "Create your first job posting to get started." : "Archived jobs will appear here."}
                        </p>
                    </div>
                ) : (
                    data?.content.map((job) => (
                        <Card
                            key={job.id}
                            className={`border-border/50 rounded-2xl shadow-apple transition-all duration-300 ${view === 'ARCHIVE' ? 'opacity-60 grayscale-[0.3]' : 'card-hover'
                                }`}
                        >
                            <CardHeader className="p-5 pb-3">
                                <div className="flex justify-between items-start gap-3">
                                    <h3 className={`font-semibold text-base leading-tight flex-1 tracking-tight ${view === 'ARCHIVE' ? 'text-muted-foreground' : 'text-foreground'
                                        }`}>
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge variant="outline" className={`text-xs font-medium rounded-lg px-2.5 py-0.5 ${getStatusBadge(job.status)}`}>
                                            {job.status}
                                        </Badge>
                                        {job.status !== 'CLOSED' && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted/80 -mr-1">
                                                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-apple-lg border-border/60">
                                                    <DropdownMenuItem onClick={() => handleEditClick(job)} className="rounded-lg">
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive focus:bg-destructive/8 rounded-lg cursor-pointer"
                                                        onClick={() => closeJobMutation.mutate(job.id)}
                                                        disabled={closeJobMutation.isPending}
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" /> Close & Archive
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1.5">
                                    <MapPin className="h-3.5 w-3.5" /> {job.location} • {job.type}
                                </div>
                            </CardHeader>
                            <CardContent className="px-5 pt-3 pb-5 flex justify-between items-center border-t border-border/40">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5" />
                                    {view === 'ARCHIVE' ? 'View Past Applicants' : 'Manage Applicants'}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl text-xs font-medium hover:bg-muted/80 btn-press h-8"
                                    onClick={() => navigate(`/recruiter/internships/${job.id}/applicants`)}
                                >
                                    View Candidates
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4 border-t border-border/50">
                    <Button variant="outline" className="rounded-xl btn-press" disabled={data.first} onClick={() => setPage(p => Math.max(0, p - 1))}>Previous</Button>
                    <span className="text-sm font-medium text-muted-foreground tabular-nums">
                        Page {data.number + 1} of {data.totalPages}
                    </span>
                    <Button variant="outline" className="rounded-xl btn-press" disabled={data.last} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
            )}

            {/* Edit Job Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-border/60">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Edit Internship Details</DialogTitle>
                    </DialogHeader>
                    {selectedJob && (
                        <div className="pt-4">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const updatedData = {
                                        title: formData.get("title"),
                                        description: formData.get("description"),
                                        location: formData.get("location"),
                                        type: formData.get("type"),
                                        stipendMin: Number(formData.get("stipendMin")) || undefined,
                                        stipendMax: Number(formData.get("stipendMax")) || undefined,
                                    };
                                    updateJobMutation.mutate({ jobId: selectedJob.id, data: updatedData });
                                }}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Internship Title</Label>
                                    <Input name="title" defaultValue={selectedJob.title} required className="h-11 rounded-xl bg-muted/50 border-border/60" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Description</Label>
                                    <Textarea name="description" defaultValue={selectedJob.description} rows={5} required className="rounded-xl bg-muted/50 border-border/60" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Location</Label>
                                        <Input name="location" defaultValue={selectedJob.location} required className="h-11 rounded-xl bg-muted/50 border-border/60" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Type</Label>
                                        <select
                                            name="type"
                                            defaultValue={selectedJob.type}
                                            className="flex h-11 w-full rounded-xl border border-border/60 bg-muted/50 text-foreground px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                                        >
                                            <option value="REMOTE">Remote</option>
                                            <option value="HYBRID">Hybrid</option>
                                            <option value="ONSITE">On-site</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Min Stipend (₹/mo)</Label>
                                        <Input name="stipendMin" type="number" defaultValue={selectedJob.stipendMin} className="h-11 rounded-xl bg-muted/50 border-border/60" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Max Stipend (₹/mo)</Label>
                                        <Input name="stipendMax" type="number" defaultValue={selectedJob.stipendMax} className="h-11 rounded-xl bg-muted/50 border-border/60" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                                    <Button type="button" variant="outline" className="rounded-xl btn-press" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-apple btn-press font-semibold"
                                        disabled={updateJobMutation.isPending}
                                    >
                                        {updateJobMutation.isPending ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                                Saving...
                                            </span>
                                        ) : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}