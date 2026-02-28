import { useState } from "react";
import { IndianRupee, Briefcase } from "lucide-react";
import { MapPinIcon } from "@/components/ui/map-pin";
import { ClockIcon } from "@/components/ui/clock";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
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
import { getJobTypeBadgeStyle } from "@/utils/status";
import { AxiosError } from "axios";

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

    const applyMutation = useMutation({
        mutationFn: async () => {
            await api.post(`/internships/${internship.id}/apply`, { resumeUrl });
        },
        onSuccess: () => {
            toast.success("Application submitted successfully! 🎉");
            setOpen(false);
            setResumeUrl("");
        },
        onError: (error: AxiosError | any) => {
            toast.error(error.response?.data?.message || "Failed to apply. You may have already applied.");
        }
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        applyMutation.mutate();
    };

    return (
        <Card className="w-full h-full border-border/50 flex flex-col bg-card shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden relative">
            {/* Subtle Gradient Top Border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

            {/* Card Header */}
            <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border/50 shadow-sm overflow-hidden dark:bg-zinc-950">
                    {internship.companyLogoUrl ? (
                        <img src={internship.companyLogoUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${internship.companyName || internship.title}&backgroundColor=transparent`} alt="Company Logo" className="h-full w-full object-cover opacity-90 transition-transform duration-300 hover:scale-110" />
                    )}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="font-semibold text-[15px] leading-tight text-foreground truncate">{internship.title}</h3>
                    <p className="text-[13px] text-muted-foreground font-medium truncate">{internship.companyName || "Independent Recruiter"}</p>
                </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="px-4 pb-3 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-2.5">
                    <Badge variant="secondary" className="bg-muted/50 hover:bg-muted/60 text-muted-foreground text-[11px] font-medium rounded-md px-2 py-0 border-none">
                        <MapPinIcon size={12} className="mr-1 inline-flex text-muted-foreground/70" />{internship.location}
                    </Badge>
                    <Badge variant="secondary" className="bg-muted/50 hover:bg-muted/60 text-muted-foreground text-[11px] font-medium rounded-md px-2 py-0 border-none">
                        <IndianRupee className="h-3 w-3 mr-1 inline-flex text-muted-foreground/70" />{formatStipend(internship.stipendMin, internship.stipendMax)}
                    </Badge>
                </div>
                <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed flex-1">{internship.description}</p>
            </CardContent>

            <CardFooter className="flex justify-between items-center px-4 py-3 bg-muted/10 border-t border-border/40 mt-auto">
                <Badge variant="outline" className={`text-[11px] font-semibold tracking-wide rounded-md px-2 py-0.5 uppercase ${getJobTypeBadgeStyle(internship.type)}`}>
                    {internship.type.replace('_', ' ')}
                </Badge>

                {/* Apply Modal */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-foreground hover:bg-foreground/90 text-background rounded-lg px-3.5 btn-press h-7.5 text-[12px] font-medium"
                        >
                            View & Apply
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col gap-0 p-0 rounded-2xl border-border/60">
                        {/* Modal Header */}
                        <div className="p-5 sm:p-6 pb-4 border-b border-border/50 sticky top-0 bg-card z-10">
                            <DialogHeader>
                                <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">{internship.title}</DialogTitle>
                                <DialogDescription className="text-sm sm:text-base text-foreground/80 font-medium mt-0.5">
                                    {internship.companyName || "Independent Recruiter"}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {[
                                    { icon: MapPinIcon, text: internship.location },
                                    { icon: IndianRupee, text: formatStipend(internship.stipendMin, internship.stipendMax) },
                                    { icon: Briefcase, text: internship.type.replace('_', ' ') },
                                    { icon: ClockIcon, text: "Full-time" },
                                ].map((item, i) => (
                                    <span key={i} className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/40 px-2.5 py-1 sm:py-1.5 rounded-lg border border-border/30">
                                        <item.icon size={14} className="opacity-80" />{item.text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-5 sm:p-6 text-[13px] sm:text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">
                            <h4 className="font-semibold text-[15px] sm:text-base mb-2 text-foreground">About the Role</h4>
                            {internship.description}
                        </div>

                        {/* Application Form */}
                        <div className="p-5 sm:p-6 bg-muted/10 border-t border-border/40 mt-auto">
                            <h4 className="font-semibold text-[15px] sm:text-base mb-3 text-foreground">Submit Your Application</h4>
                            <form onSubmit={handleApply} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="resumeUrl" className="text-sm font-medium">Resume Link (PDF)</Label>
                                    <Input
                                        id="resumeUrl"
                                        placeholder="https://drive.google.com/..."
                                        value={resumeUrl}
                                        onChange={(e) => setResumeUrl(e.target.value)}
                                        required
                                        className="h-10 rounded-xl bg-background border-border/60 shadow-sm"
                                    />
                                    <p className="text-[11px] text-muted-foreground/80">
                                        Ensure your link permissions are set to "Anyone with the link can view".
                                    </p>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="submit"
                                        size="default"
                                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm btn-press font-semibold h-10 px-6"
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
                                                <ArrowRightIcon size={16} />
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