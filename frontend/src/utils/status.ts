import type { LucideIcon } from "lucide-react";
import { Clock, CheckCircle, XCircle, Star, Eye } from "lucide-react";

export const getApplicationStatusConfig = (status: string): { style: string; icon: LucideIcon; dot: string; label: string } => {
    switch (status) {
        case 'OFFERED': return {
            style: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
            icon: CheckCircle,
            dot: "bg-emerald-500",
            label: 'Offered'
        };
        case 'REJECTED': return {
            style: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50",
            icon: XCircle,
            dot: "bg-red-500",
            label: 'Rejected'
        };
        case 'SHORTLISTED': return {
            style: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50",
            icon: Star,
            dot: "bg-purple-500",
            label: 'Shortlisted'
        };
        case 'IN_REVIEW': return {
            style: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
            icon: Eye,
            dot: "bg-amber-500",
            label: 'In Review'
        };
        case 'APPLIED':
        default: return {
            style: "bg-muted text-muted-foreground border-border/50",
            icon: Clock,
            dot: "bg-muted-foreground/50",
            label: 'Applied'
        };
    }
};

export const getJobStatusBadge = (status: string): string => {
    switch (status) {
        case 'OPEN': return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50";
        case 'CLOSED': return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50";
        case 'DRAFT': return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50";
        default: return "bg-muted text-muted-foreground border-border/50";
    }
};

export const getJobTypeBadgeStyle = (type: string): string => {
    switch (type) {
        case "REMOTE": return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50";
        case "HYBRID": return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50";
        case "ONSITE": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50";
        default: return "";
    }
};
