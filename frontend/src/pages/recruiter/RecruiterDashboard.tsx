
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Users, Activity } from "lucide-react";
import { api } from "@/lib/api";
import type { Internship, PaginatedResponse } from "@/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { PostJobForm } from "@/components/recruiter/PostJobForm";
import { MyPostings } from "@/components/recruiter/MyPostings";
import { CompanySettings } from "@/components/recruiter/CompanySettings";

export function RecruiterDashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    let activeTab = "postings";
    if (location.pathname === "/recruiter/new") activeTab = "new";
    if (location.pathname === "/recruiter/settings") activeTab = "settings";

    const { data } = useQuery<PaginatedResponse<Internship>>({
        queryKey: ['internships', 'recruiter'],
        queryFn: async () => {
            const response = await api.get('/internships?size=50');
            return response.data;
        }
    });

    const totalJobs = data?.content.length || 0;
    const activeJobs = data?.content.filter(job => job.status === 'OPEN').length || 0;

    const stats = [
        {
            label: "Total Postings",
            value: totalJobs,
            icon: Briefcase,
            gradient: "from-blue-500/10 to-blue-600/5",
            iconBg: "bg-blue-500/12 text-blue-600 dark:text-blue-400"
        },
        {
            label: "Active Jobs",
            value: activeJobs,
            icon: Activity,
            gradient: "from-emerald-500/10 to-emerald-600/5",
            iconBg: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
        },
        {
            label: "Team Members",
            value: 1,
            icon: Users,
            gradient: "from-purple-500/10 to-purple-600/5",
            iconBg: "bg-purple-500/12 text-purple-600 dark:text-purple-400"
        },
    ];

    return (
        <div className="container max-w-6xl mx-auto py-10 px-4">

            {/* Page Header */}
            <div className="mb-10 animate-fade-in-up">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    Recruiter Hub
                </h1>
                <p className="text-muted-foreground mt-2 text-[15px]">
                    Manage postings, review candidates, and grow your team.
                </p>
            </div>

            {/* Analytics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-fade-in-up delay-100">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`relative overflow-hidden flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-gradient-to-br ${stat.gradient} shadow-apple card-hover`}
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                {stat.label}
                            </p>
                            <h3 className="text-3xl font-bold tracking-tight text-foreground">
                                {stat.value}
                            </h3>
                        </div>
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                            <stat.icon className="h-5.5 w-5.5" strokeWidth={1.8} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs Content */}
            <div className="animate-fade-in-up delay-200">
                <Tabs value={activeTab} className="w-full">
                    <TabsContent value="postings">
                        <MyPostings />
                    </TabsContent>

                    <TabsContent value="new">
                        <PostJobForm onSuccess={() => navigate("/recruiter")} />
                    </TabsContent>

                    <TabsContent value="settings">
                        <CompanySettings />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}