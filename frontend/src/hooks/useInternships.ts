import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Internship, PaginatedResponse } from "@/types";

interface UseInternshipsParams {
    keyword?: string;
    location?: string;
    minStipend?: string;
    page: number;
    status: string;
}

export function useInternships({ keyword, location, minStipend, page, status }: UseInternshipsParams) {
    return useQuery<PaginatedResponse<Internship>>({
        queryKey: ['internships', { keyword, location, minStipend }, page, status],
        queryFn: async () => {
            const params = new URLSearchParams({
                status,
                page: page.toString(),
                size: '10'
            });

            if (keyword) params.append('keyword', keyword);
            if (location) params.append('location', location);
            if (minStipend) params.append('minStipend', minStipend);

            const response = await api.get(`/internships?${params.toString()}`);
            return response.data;
        }
    });
}
