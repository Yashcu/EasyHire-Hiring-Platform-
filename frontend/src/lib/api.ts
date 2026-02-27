// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Create a configured Axios instance
export const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Maps to your Spring Boot backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept every request before it leaves the frontend
api.interceptors.request.use((config) => {
    // Grab the token directly from our Zustand store
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});