import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Company } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ArrowRight } from "lucide-react";

export function CompanySettings() {
    const queryClient = useQueryClient();
    const form = useForm<Company>();

    const { data: company, isLoading } = useQuery<Company>({
        queryKey: ['my-company'],
        queryFn: async () => {
            const response = await api.get('/companies/me');
            return response.data;
        }
    });

    useEffect(() => {
        if (company) form.reset(company);
    }, [company, form]);

    const updateMutation = useMutation({
        mutationFn: async (data: Company) => {
            if (company?.id) {
                await api.put(`/companies/${company.id}`, data);
            } else {
                await api.post('/companies', data);
            }
        },
        onSuccess: () => {
            toast.success("Company profile updated!");
            queryClient.invalidateQueries({ queryKey: ['my-company'] });
            queryClient.invalidateQueries({ queryKey: ['internships'] });
        },
        onError: () => toast.error("Failed to save company details.")
    });

    if (isLoading) {
        return (
            <div className="max-w-3xl space-y-4">
                {[...Array(4)].map((_, i) => (
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
                        <Building2 className="h-5 w-5 text-primary/70" strokeWidth={1.8} />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight">Company Branding</CardTitle>
                        <CardDescription className="text-[13px]">This info appears on all your job listings.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Company Name</Label>
                        <Input {...form.register("name")} placeholder="e.g. TechFlow Systems" required className="h-11 rounded-xl bg-muted/50 border-border/60" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Website URL</Label>
                        <Input type="url" {...form.register("websiteUrl")} placeholder="https://techflow.com" className="h-11 rounded-xl bg-muted/50 border-border/60" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Company Description</Label>
                        <Textarea {...form.register("description")} rows={4} placeholder="Tell candidates about your company culture..." className="rounded-xl bg-muted/50 border-border/60" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Logo URL</Label>
                        <Input {...form.register("logoUrl")} placeholder="https://..." className="h-11 rounded-xl bg-muted/50 border-border/60" />
                        <p className="text-xs text-muted-foreground/60">Paste a direct link to your company logo image.</p>
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
                                Save Company Profile
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}