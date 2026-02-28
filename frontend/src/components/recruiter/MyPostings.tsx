import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Internship, PaginatedResponse } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditJobModal } from "./EditJobModal";
import { getJobStatusBadge } from "@/utils/status";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    const [dialogJobToClose, setDialogJobToClose] = useState<string | null>(null);

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
                                        <Badge variant="outline" className={`text-xs font-medium rounded-lg px-2.5 py-0.5 ${getJobStatusBadge(job.status)}`}>
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
                                                        onClick={() => setDialogJobToClose(job.id)}
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
            <EditJobModal
                job={selectedJob}
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
            />

            {/* Alert Dialog for Close action */}
            <AlertDialog open={!!dialogJobToClose} onOpenChange={(open) => {
                if (!open) setDialogJobToClose(null);
            }}>
                <AlertDialogContent className="rounded-2xl border-border/60">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will close the internship posting and move it to your archive. You will no longer receive new applications for this title.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="rounded-xl btn-press">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-apple btn-press"
                            onClick={() => {
                                if (dialogJobToClose) {
                                    closeJobMutation.mutate(dialogJobToClose);
                                }
                                setDialogJobToClose(null);
                            }}
                        >
                            Close & Archive
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}