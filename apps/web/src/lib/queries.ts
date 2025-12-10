import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export interface DashboardStats {
    totalStudents: number;
    totalFaculty: number;
    pendingAdmissions: number;
    activeStudents: number;
}

export interface RecentAdmission {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
    course: {
        id: number;
        name: string;
    };
}

export const useDashboardStats = () => {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/stats');
            return data;
        },
    });
};

export const useRecentAdmissions = () => {
    return useQuery<RecentAdmission[]>({
        queryKey: ['dashboard', 'recent-admissions'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/recent-admissions');
            return data;
        },
    });
};
