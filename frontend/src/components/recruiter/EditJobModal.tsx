import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Internship } from "@/types";

interface EditJobModalProps {
    job: Internship | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditJobModal({ job, open, onOpenChange }: EditJobModalProps) {
    const queryClient = useQueryClient();

    const updateJobMutation = useMutation({
        mutationFn: async ({ jobId, data }: { jobId: string; data: any }) => {
            await api.put(`/internships/${jobId}`, data);
        },
        onSuccess: () => {
            toast.success("Job details updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['internships', 'recruiter'] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to update job details.");
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-border/60">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">Edit Internship Details</DialogTitle>
                </DialogHeader>
                {job && (
                    <div className="pt-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const updatedData = {
                                    title: formData.get("title"),
                                    description: formData.get("description"),
                                    location: formData.get("location"),
                                    type: formData.get("type"),
                                    stipendMin: Number(formData.get("stipendMin")) || undefined,
                                    stipendMax: Number(formData.get("stipendMax")) || undefined,
                                };
                                updateJobMutation.mutate({ jobId: job.id, data: updatedData });
                            }}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Internship Title</Label>
                                <Input name="title" defaultValue={job.title} required className="h-11 rounded-xl bg-muted/50 border-border/60" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Description</Label>
                                <Textarea name="description" defaultValue={job.description} rows={5} required className="rounded-xl bg-muted/50 border-border/60" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Location</Label>
                                    <Input name="location" defaultValue={job.location} required className="h-11 rounded-xl bg-muted/50 border-border/60" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Type</Label>
                                    <select
                                        name="type"
                                        defaultValue={job.type}
                                        className="flex h-11 w-full rounded-xl border border-border/60 bg-muted/50 text-foreground px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                                    >
                                        <option value="REMOTE">Remote</option>
                                        <option value="HYBRID">Hybrid</option>
                                        <option value="ONSITE">On-site</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Min Stipend (₹/mo)</Label>
                                    <Input name="stipendMin" type="number" defaultValue={job.stipendMin} className="h-11 rounded-xl bg-muted/50 border-border/60" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Max Stipend (₹/mo)</Label>
                                    <Input name="stipendMax" type="number" defaultValue={job.stipendMax} className="h-11 rounded-xl bg-muted/50 border-border/60" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                                <Button type="button" variant="outline" className="rounded-xl btn-press" onClick={() => onOpenChange(false)}>Cancel</Button>
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-apple btn-press font-semibold"
                                    disabled={updateJobMutation.isPending}
                                >
                                    {updateJobMutation.isPending ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                            Saving...
                                        </span>
                                    ) : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
