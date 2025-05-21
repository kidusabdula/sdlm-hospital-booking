// app/admin/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@clerk/nextjs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Appointment, ApiResponse } from '@/types';

const serviceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useUser();
  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: '', description: '' },
  });


  useEffect(() => {
    if (user) {
      fetch('/api/admin')
        .then((res) => res.json())
        .then((res: ApiResponse<Appointment[]>) => setAppointments(res.data || []));
    }
  }, [user]);

  const onSubmit = async (data: ServiceFormData) => {
    const res = await fetch('/api/admin/service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) form.reset();
    else alert('Failed to add service: ' + (await res.json()).error);
  };

  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-primary mb-6 animate-fade-in">
        Admin Dashboard
      </h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">Add New Service</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Dental Checkup"
                      className="border-primary/50 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Routine dental exam"
                      className="border-primary/50 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 transition-transform hover:scale-105"
            >
              Add Service
            </Button>
          </form>
        </Form>
      </div>
      <h3 className="text-xl font-semibold text-primary mb-4">All Bookings</h3>
      <Table className="border border-primary/10 rounded-lg">
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No bookings found
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((a) => (
              <TableRow key={a.id} className="hover:bg-secondary/50 transition-colors">
                <TableCell>{a.patient?.name}</TableCell>
                <TableCell>{a.provider?.name}</TableCell>
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
