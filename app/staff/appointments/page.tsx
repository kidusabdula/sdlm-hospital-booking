// app/staff/appointments/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Appointment, ApiResponse } from '@/types';

export default function StaffAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetch('/api/staff/appointments')
        .then((res) => res.json())
        .then((res: ApiResponse<Appointment[]>) => setAppointments(res.data || []));
    }
  }, [user]);

  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-primary mb-6 animate-fade-in">
        My Schedule
      </h2>
      <Table className="border border-primary/10 rounded-lg">
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead>Patient</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No appointments scheduled
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((a) => (
              <TableRow key={a.id} className="hover:bg-secondary/50 transition-colors">
                <TableCell>{a.patient?.name}</TableCell>
                <TableCell>{a.service?.name}</TableCell>
                <TableCell>{new Date(a.date_time).toLocaleString()}</TableCell>
                <TableCell>{a.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
