// app/api/patient/[...route]/route.ts
import { createServerSupabaseClient } from '@/lib/supabase';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Appointment, ApiResponse } from '@/types';

const bookingSchema = z.object({
  serviceId: z.number().positive(),
  providerId: z.string(),
  dateTime: z.string().datetime(),
});

const cancelSchema = z.object({
  appointmentId: z.number().positive(),
});

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json<ApiResponse<never>>(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const client = createServerSupabaseClient();
  const { pathname } = new URL(request.url);
  const body = await request.json();

  // Sync Clerk user to Supabase
  const { data: existingUser } = await client
    .from('users')
    .select()
    .eq('user_id', user.id)
    .single();

  if (!existingUser) {
    await client.from('users').insert({
      user_id: user.id,
      email: user.emailAddresses[0].emailAddress,
      role: 'patient', // Placeholder until roles configured
      name: user.firstName + ' ' + user.lastName,
    });
  }

  if (pathname.includes('book')) {
    const validated = bookingSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json<ApiResponse<never>>(
        { error: validated.error.message },
        { status: 400 }
      );
    }

    const { serviceId, providerId, dateTime } = validated.data;
    const { data: existing } = await client
      .from('appointments')
      .select()
      .eq('provider_id', providerId)
      .eq('date_time', dateTime);

    if (existing?.length) {
      return NextResponse.json<ApiResponse<never>>(
        { error: 'Slot already booked' },
        { status: 400 }
      );
    }

    const { error } = await client.from('appointments').insert({
      patient_id: user.id,
      provider_id: providerId,
      service_id: serviceId,
      date_time: dateTime,
      status: 'BOOKED',
    });

    if (error) {
      return NextResponse.json<ApiResponse<never>>(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json<ApiResponse<null>>(
      { message: 'Appointment booked' },
      { status: 200 }
    );
  }

  if (pathname.includes('cancel')) {
    const validated = cancelSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json<ApiResponse<never>>(
        { error: validated.error.message },
        { status: 400 }
      );
    }

    const { appointmentId } = validated.data;
    const { error } = await client
      .from('appointments')
      .update({ status: 'CANCELLED' })
      .eq('id', appointmentId)
      .eq('patient_id', user.id);

    if (error) {
      return NextResponse.json<ApiResponse<never>>(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json<ApiResponse<null>>(
      { message: 'Appointment cancelled' },
      { status: 200 }
    );
  }

  return NextResponse.json<ApiResponse<never>>(
    { error: 'Invalid route' },
    { status: 400 }
  );
}

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json<ApiResponse<never>>(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const client = createServerSupabaseClient();
  const { data: existingUser } = await client
    .from('users')
    .select()
    .eq('user_id', user.id)
    .single();

  if (!existingUser) {
    await client.from('users').insert({
      user_id: user.id,
      email: user.emailAddresses[0].emailAddress,
      role: 'patient', // Placeholder
      name: user.firstName + ' ' + user.lastName,
    });
  }

  const { data, error } = await client
    .from('appointments')
    .select('*, service(name), provider:user_id(name)')
    .eq('patient_id', user.id);

  if (error) {
    return NextResponse.json<ApiResponse<never>>(
      { error: error.message },
      { status: 400 }
    );
  }
  return NextResponse.json<ApiResponse<Appointment[]>>({ data });
}