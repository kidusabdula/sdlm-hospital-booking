// app/patient/appointments/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Appointment, ApiResponse } from '@/types';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetch('/api/patient')
        .then((res) => res.json())
        .then((res: ApiResponse<Appointment[]>) => setAppointments(res.data || []));
    }
  }, [user]);

  const handleCancel = async (id: number) => {
    const res = await fetch('/api/patient/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentId: id }),
    });
    if (res.ok) {
      setAppointments(appointments.filter((a) => a.id !== id));
    } else {
      alert('Cancellation failed: ' + (await res.json()).error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-primary mb-6 animate-fade-in">
        My Appointments
      </h2>
      <Table className="border border-primary/10 rounded-lg">
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead>Service</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No appointments found
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((a) => (
              <TableRow key={a.id} className="hover:bg-secondary/50 transition-colors">
                <TableCell>{a.service?.name}</TableCell>
                <TableCell>{a.provider?.name}</TableCell>
                <TableCell>{new Date(a.date_time).toLocaleString()}</TableCell>
                <TableCell>{a.status}</TableCell>
                <TableCell>
                  {a.status === 'BOOKED' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(a.id)}
                      className="hover:scale-105 transition-transform"
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
