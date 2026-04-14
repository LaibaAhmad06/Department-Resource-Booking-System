
import axios from 'axios'; 
import { User, Resource, Booking, UserRole, BookingStatus } from '../../types';

// server.ts is running on this port  PORT 5000
// const API_BASE = 'http://localhost:3001/api'; 
const API_BASE = 'http://3.213.38.136:5000/api';    // in aws we use flexible api so this IP address will not be changed when ever the server start again

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('itu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const apiService = {
  login: async (email: string, pass: string) => {
    const { data } = await api.post('/auth/login', { email, password: pass });
    localStorage.setItem('itu_token', data.token);
    localStorage.setItem('itu_user', JSON.stringify(data.user));
    return data.user;
  },
  signup: async (name: string, email: string, role: UserRole, pass: string) => {
    const { data } = await api.post('/auth/signup', { name, email, role, password: pass });
    return data;
  },
  logout: () => {
    localStorage.removeItem('itu_token');
    localStorage.removeItem('itu_user');
  },
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('itu_user');
    return user ? JSON.parse(user) : null;
  },
  getResources: async (): Promise<Resource[]> => {
    const { data } = await api.get('/resources');
    return data;
  },
  getResourceById: async (id: string): Promise<Resource> => {
    const { data } = await api.get(`/resources/${id}`);
    return data;
  },
  addResource: async (res: Omit<Resource, 'id'>) => {
    const { data } = await api.post('/resources', res);
    return data;
  },
  deleteResource: async (id: string) => {
    await api.delete(`/resources/${id}`);
  },
  getBookings: async (): Promise<Booking[]> => {
    const { data } = await api.get('/bookings');
    return data;
  },
  createBooking: async (resourceId: string, resourceName: string, date: string, slot: string) => {
    const { data } = await api.post('/bookings', { resourceId, resourceName, date, slot });
    return data;
  },
  updateBookingStatus: async (id: string, status: BookingStatus) => {
    await api.patch(`/bookings/${id}/status`, { status });
  },
  getStats: async () => {
    const [res, books] = await Promise.all([
      api.get('/resources'),
      api.get('/bookings')
    ]);
    return {
      totalResources: res.data.length,
      activeBookings: books.data.filter((b: any) => b.status === 'APPROVED').length,
      pendingRequests: books.data.filter((b: any) => b.status === 'PENDING').length,
      totalUsers: 0 // Placeholder or separate endpoint needed
    };
  }
};
