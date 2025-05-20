// /types/index.ts
export type Role = 'patient' | 'staff' | 'admin';

export interface User {
  user_id: string; // Clerk's sub (JWT subject)
  email: string;
  role: Role;
  name: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
}

export interface Appointment {
  id: number;
  patient_id: string; // References User.user_id
  provider_id: string; // References User.user_id
  service_id: number; // References Service.id
  date_time: string; // ISO 8601 (e.g., "2025-05-21T10:00:00Z")
  status: 'BOOKED' | 'CANCELLED';
  service?: { name: string }; // Joined data
  patient?: { name: string }; // Joined data
  provider?: { name: string }; // Joined data
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}