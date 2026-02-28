import { useState } from "react";
import { HeroSection } from "../../components/public/HeroSection";
import { HowItWorksSection } from "../../components/public/HowItWorksSection";
import { TestimonialsSection } from "../../components/public/TestimonialsSection";
import { CTASection } from "../../components/public/CTASection";
import { HomeFooter } from "../../components/public/HomeFooter";

export type UserRole = 'candidate' | 'recruiter';

export function Home() {
    const [userRole, setUserRole] = useState<UserRole>('candidate');

    const handleRoleSwitch = (role: UserRole) => {
        setUserRole(role);
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <HeroSection userRole={userRole} onRoleSwitch={handleRoleSwitch} />
            <HowItWorksSection userRole={userRole} />
            <TestimonialsSection />
            <CTASection userRole={userRole} />
            <HomeFooter />
        </div>
    );
}