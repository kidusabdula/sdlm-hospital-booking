// app/patient/book/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { createServerSupabaseClient } from '@/lib/supabase';
import { Service, User } from '@/types';

const bookingSchema = z.object({
  serviceId: z.number().positive(),
  providerId: z.string(),
  dateTime: z.string().datetime(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function Book() {
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const router = useRouter();
  const client = createServerSupabaseClient();
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { serviceId: 0, providerId: '', dateTime: '' },
  });

  useEffect(() => {
    client.from('services').select().then(({ data }) => setServices(data || []));
    client
      .from('users')
      .select()
      .eq('role', 'staff')
      .then(({ data }) => setProviders(data || []));
  }, [client]);

  const onSubmit = async (data: BookingFormData) => {
    const res = await fetch('/api/patient/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push('/patient/appointments');
    else alert('Booking failed: ' + (await res.json()).error);
  };

  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-primary mb-6 animate-fade-in">
        Book an Appointment
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger className="border-primary/50 focus:ring-primary">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-primary/50 focus:ring-primary">
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.user_id} value={provider.user_id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    className="border-primary/50 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105"
          >
            Book Appointment
          </Button>
        </form>
      </Form>
    </div>
  );
}
