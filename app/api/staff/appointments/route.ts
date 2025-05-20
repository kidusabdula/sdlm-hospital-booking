// app/api/staff/appointments/route.ts
import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Appointment, ApiResponse } from '@/types';

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
      role: 'staff', // Placeholder
      name: user.firstName + ' ' + user.lastName,
    });
  }

  const { data, error } = await client
    .from('appointments')
    .select('*, service(name), patient:user_id(name)')
    .eq('provider_id', user.id);

  if (error) {
    return NextResponse.json<ApiResponse<never>>(
      { error: error.message },
      { status: 400 }
    );
  }
  return NextResponse.json<ApiResponse<Appointment[]>>({ data });
}