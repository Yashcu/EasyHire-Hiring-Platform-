import axiosInstance from "../api/axiosConfig";

export interface Internship {
    id: string;
    title: string;
    description: string;
    location: string;
    stipendMin: number;
    stipendMax: number;
    type: string;
    status: string;
}

export const getInternships = async (page = 0, size = 10) => {
    const response = await axiosInstance.get(
        `/internships?page=${page}&size=${size}`
    );

    return response.data;
};