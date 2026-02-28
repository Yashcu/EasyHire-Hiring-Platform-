// src/types/index.ts

export interface Internship {
    id: string;
    title: string;
    description: string;
    location: string;
    stipendMin?: number;
    stipendMax?: number;
    type: 'REMOTE' | 'ONSITE' | 'HYBRID';
    status: 'DRAFT' | 'OPEN' | 'CLOSED';
    companyId?: string;
    companyName?: string;
    companyLogoUrl?: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageable: any;
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    first: boolean;
    empty: boolean;
}

export interface Application {
    applicationId: string;
    internshipId: string;
    internshipTitle: string;
    status: 'APPLIED' | 'IN_REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'OFFERED';
    appliedAt: string;
    companyName?: string;
    resumeUrl?: string;
}

export interface CandidateProfile {
    userId: string;
    firstName: string;
    lastName: string;
    university: string;
    bio: string;
    skills: string;
    portfolioUrl: string;
    githubUrl: string;
    defaultResumeUrl: string;
}

export interface Company {
    id?: string;
    name: string;
    description: string;
    websiteUrl: string;
    logoUrl?: string;
}