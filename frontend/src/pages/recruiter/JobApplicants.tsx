import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Inbox } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function JobApplicants() {
    const { jobId } = useParams();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['applicants', jobId],
        queryFn: async () => {
            const response = await api.get(`/internships/${jobId}/applications?size=50`);
            return response.data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ applicationId, status }: { applicationId: string, status: string }) => {
            await api.patch(`/applications/${applicationId}/status`, { status });
        },
        onMutate: async (newStatusUpdate) => {
            await queryClient.cancelQueries({ queryKey: ['applicants', jobId] });
            const previousApplicants = queryClient.getQueryData(['applicants', jobId]);

            queryClient.setQueryData(['applicants', jobId], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    content: old.content.map((app: any) =>
                        app.applicationId === newStatusUpdate.applicationId
                            ? { ...app, status: newStatusUpdate.status }
                            : app
                    )
                };
            });

            return { previousApplicants };
        },
        onError: (error: any, _, context) => {
            queryClient.setQueryData(['applicants', jobId], context?.previousApplicants);
            toast.error(error.response?.data?.message || "Invalid status transition");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['applicants', jobId] });
        },
        onSuccess: () => {
            toast.success("Applicant status updated!");
        }
    });

    const handleStatusChange = (applicationId: string, newStatus: string) => {
        updateStatusMutation.mutate({ applicationId, status: newStatus });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'OFFERED': return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50";
            case 'REJECTED': return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50";
            case 'SHORTLISTED': return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50";
            case 'IN_REVIEW': return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50";
            default: return "bg-muted text-muted-foreground border-border/50";
        }
    };

    if (isLoading) {
        return (
            <div className="container max-w-6xl mx-auto py-10 px-4">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto py-10 px-4">
            <div className="mb-8 animate-fade-in-up">
                <Link to="/recruiter" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Applicant Review</h1>
                <p className="text-muted-foreground mt-1.5 text-[15px]">Reviewing candidates for your internship.</p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl shadow-apple overflow-hidden animate-fade-in-up delay-100">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 border-b border-border/50 hover:bg-muted/40">
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5">Candidate</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5">Applied On</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5">Resume</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5">Status</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-16">
                                    <Inbox className="h-10 w-10 text-muted-foreground/25 mx-auto mb-3" />
                                    <p className="text-base font-medium text-muted-foreground">No applicants yet</p>
                                    <p className="text-sm text-muted-foreground/60 mt-1">Applicants will appear here once they apply.</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.content.map((app: any) => (
                                <TableRow key={app.applicationId} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                                {(app.candidateName || "C")[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-foreground">{app.candidateName || "Candidate"}</p>
                                                <p className="text-xs text-muted-foreground">{app.candidateEmail || "Hidden Email"}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(app.appliedAt), 'MMM dd, yyyy')}
                                    </TableCell>

                                    <TableCell>
                                        {app.resumeUrl ? (
                                            <a
                                                href={app.resumeUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                                            >
                                                View Resume <ExternalLink className="h-3 w-3" />
                                            </a>
                                        ) : (
                                            <span className="text-sm text-muted-foreground/50">No resume</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="outline" className={`text-xs font-medium rounded-lg px-2.5 py-0.5 border ${getStatusStyle(app.status)}`}>
                                            {app.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Select
                                            defaultValue={app.status}
                                            onValueChange={(val) => handleStatusChange(app.applicationId, val)}
                                            disabled={app.status === 'OFFERED' || app.status === 'REJECTED'}
                                        >
                                            <SelectTrigger className="w-[140px] h-8 text-xs rounded-lg border-border/60">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl shadow-apple-lg border-border/60">
                                                <SelectItem value="APPLIED" className="rounded-lg text-xs">Applied</SelectItem>
                                                <SelectItem value="IN_REVIEW" className="rounded-lg text-xs">In Review</SelectItem>
                                                <SelectItem value="SHORTLISTED" className="rounded-lg text-xs">Shortlisted</SelectItem>
                                                <SelectItem value="OFFERED" className="rounded-lg text-xs">Offered</SelectItem>
                                                <SelectItem value="REJECTED" className="rounded-lg text-xs">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}