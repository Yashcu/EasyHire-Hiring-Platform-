import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { api } from "@/lib/api";
import type { Application, PaginatedResponse } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox, Clock, CheckCircle, XCircle, Star, Eye } from "lucide-react";

export function MyApplications() {
    const { data, isLoading, isError } = useQuery<PaginatedResponse<Application>>({
        queryKey: ['my-applications'],
        queryFn: async () => {
            const response = await api.get('/applications/me?page=0&size=50');
            return response.data;
        }
    });

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'OFFERED': return {
                style: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
                icon: CheckCircle,
                dot: "bg-emerald-500"
            };
            case 'REJECTED': return {
                style: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50",
                icon: XCircle,
                dot: "bg-red-500"
            };
            case 'SHORTLISTED': return {
                style: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50",
                icon: Star,
                dot: "bg-purple-500"
            };
            case 'IN_REVIEW': return {
                style: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
                icon: Eye,
                dot: "bg-amber-500"
            };
            default: return {
                style: "bg-muted text-muted-foreground border-border/50",
                icon: Clock,
                dot: "bg-muted-foreground/50"
            };
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-16 bg-card rounded-2xl border border-border/50 shadow-apple">
                <p className="text-destructive font-medium">Failed to load applications. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {data?.content.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                    <Inbox className="h-10 w-10 text-muted-foreground/25 mx-auto mb-3" />
                    <p className="text-base font-medium text-muted-foreground">You haven't applied to any internships yet.</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Start exploring to find your next opportunity.</p>
                </div>
            ) : (
                data?.content.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    return (
                        <Card
                            key={app.applicationId}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-border/50 rounded-2xl shadow-apple card-hover"
                        >
                            <div className="flex items-center gap-4">
                                {/* Status dot */}
                                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${statusConfig.dot}`} />
                                <div className="space-y-0.5">
                                    <h3 className="font-semibold text-base text-foreground tracking-tight">{app.internshipTitle}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Applied on {format(new Date(app.appliedAt), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 sm:mt-0 ml-6 sm:ml-0">
                                <Badge variant="outline" className={`text-xs font-medium rounded-lg px-2.5 py-0.5 ${statusConfig.style}`}>
                                    {app.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </Card>
                    );
                })
            )}
        </div>
    );
}