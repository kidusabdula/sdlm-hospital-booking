// app/patient/book/page.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Service } from '@/types';

const bookingSchema = z.object({
  serviceId: z.number().positive(),
  providerId: z.string(),
  dateTime: z.string().datetime(),
});

export default function Book() {
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState([]);
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { serviceId: 0, providerId: '', dateTime: '' },
  });

  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-primary mb-6">Book an Appointment</h2>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))}>
                  <FormControl>
                    <SelectTrigger>
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
          {/* Provider and DateTime fields to be added */}
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Book Appointment
          </Button>
        </form>
      </Form>
    </div>
  );
}