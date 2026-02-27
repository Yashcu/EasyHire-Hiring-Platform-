import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { CandidateProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, ArrowRight } from "lucide-react";

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
            <div className="max-w-3xl space-y-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-14 rounded-xl bg-muted/50 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <Card className="max-w-3xl border-border/50 shadow-apple rounded-2xl">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-1">
                    <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary/70" strokeWidth={1.8} />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight">Professional Profile</CardTitle>
                        <CardDescription className="text-[13px]">Keep your details updated for faster applications.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">First Name</Label>
                            <Input {...form.register("firstName")} required className="h-11 rounded-xl bg-muted/50 border-border/60" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Last Name</Label>
                            <Input {...form.register("lastName")} required className="h-11 rounded-xl bg-muted/50 border-border/60" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">University</Label>
                        <Input {...form.register("university")} placeholder="e.g. IIT Bombay" className="h-11 rounded-xl bg-muted/50 border-border/60" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Bio</Label>
                        <Textarea {...form.register("bio")} rows={3} placeholder="Tell recruiters about yourself..." className="rounded-xl bg-muted/50 border-border/60" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Skills</Label>
                        <Input {...form.register("skills")} placeholder="React, Java, Spring Boot" className="h-11 rounded-xl bg-muted/50 border-border/60" />
                        <p className="text-xs text-muted-foreground/60">Separate skills with commas.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">GitHub URL</Label>
                            <Input type="url" {...form.register("githubUrl")} placeholder="https://github.com/..." className="h-11 rounded-xl bg-muted/50 border-border/60" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Portfolio URL</Label>
                            <Input type="url" {...form.register("portfolioUrl")} placeholder="https://..." className="h-11 rounded-xl bg-muted/50 border-border/60" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Default Resume URL</Label>
                        <Input type="url" {...form.register("defaultResumeUrl")} placeholder="Google Drive / PDF link" className="h-11 rounded-xl bg-muted/50 border-border/60" />
                        <p className="text-xs text-muted-foreground/60">This will be auto-filled when you apply to jobs.</p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-apple btn-press font-semibold"
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Save Profile
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}