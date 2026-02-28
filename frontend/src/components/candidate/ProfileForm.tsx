import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { CandidateProfile } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Github, Briefcase, FileText, User } from "lucide-react";

export function ProfileForm() {
    const queryClient = useQueryClient();
    const form = useForm<CandidateProfile>();

    const { data: profile, isLoading } = useQuery<CandidateProfile>({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await api.get('/profile/me');
            return response.data;
        }
    });

    useEffect(() => {
        if (profile) form.reset(profile);
    }, [profile, form]);

    const updateMutation = useMutation({
        mutationFn: async (data: CandidateProfile) => {
            await api.put('/profile/me', data);
        },
        onSuccess: () => {
            toast.success("Profile updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: () => toast.error("Failed to update profile.")
    });

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse pb-16">
                <Card className="h-[600px] w-full bg-muted/20 border-border/40 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-16">
            <div className="mb-6 md:mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Profile Settings</h2>
                <p className="text-muted-foreground mt-1 text-[15px]">Manage your public professional profile to stand out to recruiters.</p>
            </div>

            <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))}>
                <Card className="shadow-sm border-border/50 rounded-2xl overflow-hidden bg-card">
                    <CardContent className="p-6 md:p-8 space-y-10">
                        {/* Personal Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-primary" strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground tracking-tight">Personal Details</h3>
                                    <p className="text-sm text-muted-foreground">This info will be visible to recruiters when you apply.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label className="text-[13px] font-semibold text-foreground/80">First Name</Label>
                                    <Input {...form.register("firstName")} required className="h-12 rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 shadow-sm text-sm" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-[13px] font-semibold text-foreground/80">Last Name</Label>
                                    <Input {...form.register("lastName")} required className="h-12 rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 shadow-sm text-sm" />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-[13px] font-semibold text-foreground/80">University / College</Label>
                                <Input {...form.register("university")} placeholder="e.g. IIT Bombay" className="h-12 rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 shadow-sm text-sm" />
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-[13px] font-semibold text-foreground/80">Bio</Label>
                                <Textarea {...form.register("bio")} rows={4} placeholder="Tell recruiters about yourself..." className="rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 shadow-sm resize-y text-sm" />
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-[13px] font-semibold text-foreground/80">Skills</Label>
                                <Input {...form.register("skills")} placeholder="e.g. React, Java, Spring Boot, Figma" className="h-12 rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 shadow-sm text-sm" />
                                <p className="text-[12px] text-muted-foreground/80 font-medium">Separate skills with commas.</p>
                            </div>
                        </div>

                        {/* Professional Links Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground tracking-tight">Professional Links</h3>
                                    <p className="text-sm text-muted-foreground">Showcase your work and attach a unified resume.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label className="text-[13px] font-semibold text-foreground/80 flex items-center gap-2">
                                        <Github className="h-4 w-4 text-muted-foreground" />
                                        GitHub URL
                                    </Label>
                                    <Input type="url" {...form.register("githubUrl")} placeholder="https://github.com/..." className="h-12 rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 shadow-sm text-sm" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-[13px] font-semibold text-foreground/80 flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        Portfolio URL
                                    </Label>
                                    <Input type="url" {...form.register("portfolioUrl")} placeholder="https://..." className="h-12 rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 shadow-sm text-sm" />
                                </div>
                            </div>

                            <div className="space-y-2.5 pt-2">
                                <Label className="text-[13px] font-semibold text-foreground/80 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Default Resume URL
                                </Label>
                                <Input type="url" {...form.register("defaultResumeUrl")} placeholder="Google Drive / PDF link" className="h-12 rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/25 shadow-sm text-sm" />
                                <p className="text-[12px] text-muted-foreground/80 font-medium">Ensure your link permissions are set to "Anyone with the link can view".</p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-muted/30 border-t border-border/50 p-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[13px] text-muted-foreground font-medium hidden sm:block">
                            Review your details before saving.
                        </p>
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full sm:w-auto h-11 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl shadow-apple btn-press font-semibold text-[14px]"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-[1.5px] border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Save Changes
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}