import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

const postJobSchema = z.object({
    title: z.string().min(3, "Job title is required"),
    description: z.string().min(10, "Please provide a detailed description"),
    location: z.string().min(2, "Location is required"),
    stipendMin: z.number().optional(),
    stipendMax: z.number().optional(),
    type: z.enum(["REMOTE", "ONSITE", "HYBRID"]),
});

type PostJobFormValues = z.infer<typeof postJobSchema>;

export function PostJobForm({ onSuccess }: { onSuccess: () => void }) {
    const queryClient = useQueryClient();

    const form = useForm<PostJobFormValues>({
        resolver: zodResolver(postJobSchema),
        defaultValues: { type: "REMOTE" }
    });

    const postMutation = useMutation({
        mutationFn: async (data: PostJobFormValues) => {
            const response = await api.post('/internships', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Job posted successfully! It is currently in DRAFT status.");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['internships'] });
            onSuccess();
        },
        onError: () => toast.error("Failed to post job. Please try again.")
    });

    return (
        <Card className="max-w-3xl border-border/50 shadow-apple rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold tracking-tight">Post a New Internship</CardTitle>
                <CardDescription className="text-[15px]">Create a listing to start accepting applications.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <form onSubmit={form.handleSubmit((data) => postMutation.mutate(data))} className="space-y-5">

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Internship Title</Label>
                        <Input
                            {...form.register("title")}
                            placeholder="e.g. Frontend Developer Intern"
                            className="h-11 rounded-xl bg-muted/50 border-border/60"
                        />
                        {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Description</Label>
                        <Textarea
                            {...form.register("description")}
                            rows={4}
                            placeholder="What will the intern do? Share responsibilities, skills needed..."
                            className="rounded-xl bg-muted/50 border-border/60"
                        />
                        {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Location</Label>
                            <Input
                                {...form.register("location")}
                                placeholder="e.g. Bangalore or Remote"
                                className="h-11 rounded-xl bg-muted/50 border-border/60"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Work Type</Label>
                            <Select onValueChange={(val) => form.setValue("type", val as any)} defaultValue="REMOTE">
                                <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/60">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-apple-lg border-border/60">
                                    <SelectItem value="REMOTE" className="rounded-lg">Remote</SelectItem>
                                    <SelectItem value="HYBRID" className="rounded-lg">Hybrid</SelectItem>
                                    <SelectItem value="ONSITE" className="rounded-lg">On-site</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Min Stipend (₹/mo)</Label>
                            <Input
                                type="number"
                                {...form.register("stipendMin", { setValueAs: v => v === "" ? undefined : Number(v) })}
                                placeholder="10000"
                                className="h-11 rounded-xl bg-muted/50 border-border/60"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Max Stipend (₹/mo)</Label>
                            <Input
                                type="number"
                                {...form.register("stipendMax", { setValueAs: v => v === "" ? undefined : Number(v) })}
                                placeholder="20000"
                                className="h-11 rounded-xl bg-muted/50 border-border/60"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-apple btn-press font-semibold"
                        disabled={postMutation.isPending}
                    >
                        {postMutation.isPending ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Create Internship
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}