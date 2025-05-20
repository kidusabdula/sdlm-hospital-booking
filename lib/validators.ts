import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.number().positive(),
  providerId: z.string(),
  dateTime: z.string().datetime(),
});

export const cancelSchema = z.object({
  appointmentId: z.number().positive(),
});
