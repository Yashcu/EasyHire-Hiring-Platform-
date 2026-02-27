import { useState } from "react";
import { Building2, MapPin, IndianRupee, Briefcase, Clock, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Internship } from "@/types";

interface InternshipCardProps {
    internship: Internship;
}

export function InternshipCard({ internship }: InternshipCardProps) {
    const [open, setOpen] = useState(false);
    const [resumeUrl, setResumeUrl] = useState("");

    const formatStipend = (min?: number, max?: number) => {
        if (!min && !max) return "Unpaid";
        if (min && !max) return `₹${min.toLocaleString()}/mo`;
        return `₹${min?.toLocaleString()} – ₹${max?.toLocaleString()}/mo`;
    };

    const getTypeBadgeStyle = (type: string) => {
        switch (type) {
            case "REMOTE": return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50";
            case "HYBRID": return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50";
            case "ONSITE": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50";
            default: return "";
        }
    };

    const applyMutation = useMutation({
        mutationFn: async () => {
            await api.post(`/internships/${internship.id}/apply`, { resumeUrl });
        },
        onSuccess: () => {
            toast.success("Application submitted successfully! 🎉");
            setOpen(false);
            setResumeUrl("");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to apply. You may have already applied.");
        }
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        applyMutation.mutate();
    };

    return (
        <Card className="w-full border-border/50 flex flex-col bg-card shadow-apple card-hover rounded-2xl overflow-hidden">
            {/* Card Header */}
            <CardHeader className="flex flex-row items-start gap-4 p-5 pb-3">
                <div className="h-11 w-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                    {internship.companyLogoUrl ? (
                        <img src={internship.companyLogoUrl} alt="" className="h-7 w-7 rounded-md object-cover" />
                    ) : (
                        <Building2 className="h-5 w-5 text-primary/70" strokeWidth={1.8} />
                    )}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="font-semibold text-base leading-tight text-foreground truncate">{internship.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium truncate">{internship.companyName || "Independent Recruiter"}</p>
                </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="px-5 pb-4 flex-1">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-lg">
                        <MapPin className="h-3 w-3" />{internship.location}
                    </span>
                    <span className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-lg">
                        <IndianRupee className="h-3 w-3" />{formatStipend(internship.stipendMin, internship.stipendMax)}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{internship.description}</p>
            </CardContent>

            <CardFooter className="flex justify-between items-center px-5 py-4 border-t border-border/40 mt-auto">
                <Badge variant="outline" className={`text-xs font-medium rounded-lg px-2.5 py-0.5 ${getTypeBadgeStyle(internship.type)}`}>
                    {internship.type}
                </Badge>

                {/* Apply Modal */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 btn-press shadow-apple text-xs font-semibold h-8"
                        >
                            View & Apply
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col gap-0 p-0 rounded-2xl border-border/60">
                        {/* Modal Header */}
                        <div className="p-6 pb-5 border-b border-border/50 sticky top-0 bg-card z-10">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold tracking-tight">{internship.title}</DialogTitle>
                                <DialogDescription className="text-base text-foreground/80 font-medium mt-1">
                                    {internship.companyName || "Independent Recruiter"}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {[
                                    { icon: MapPin, text: internship.location },
                                    { icon: IndianRupee, text: formatStipend(internship.stipendMin, internship.stipendMax) },
                                    { icon: Briefcase, text: internship.type },
                                    { icon: Clock, text: "Full-time" },
                                ].map((item, i) => (
                                    <span key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl">
                                        <item.icon className="h-3.5 w-3.5" />{item.text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-6 text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">
                            <h4 className="font-semibold text-base mb-3 text-foreground">About the Role</h4>
                            {internship.description}
                        </div>

                        {/* Application Form */}
                        <div className="p-6 bg-muted/30 border-t border-border/50 mt-auto">
                            <h4 className="font-semibold text-base mb-4 text-foreground">Submit Your Application</h4>
                            <form onSubmit={handleApply} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="resumeUrl" className="text-sm font-medium">Resume Link (PDF)</Label>
                                    <Input
                                        id="resumeUrl"
                                        placeholder="https://drive.google.com/..."
                                        value={resumeUrl}
                                        onChange={(e) => setResumeUrl(e.target.value)}
                                        required
                                        className="h-11 rounded-xl bg-background border-border/60"
                                    />
                                    <p className="text-xs text-muted-foreground/70">
                                        Ensure your link is set to "Anyone with the link can view".
                                    </p>
                                </div>
                                <div className="flex justify-end pt-1">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-apple btn-press font-semibold"
                                        disabled={applyMutation.isPending}
                                    >
                                        {applyMutation.isPending ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                                Submitting...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Submit Application
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}