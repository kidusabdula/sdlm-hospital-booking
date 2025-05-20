// app/api/admin/[...route]/route.ts
import { createServerSupabaseClient } from '@/lib/supabase';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { currentUser} from '@clerk/nextjs/server';
import { Appointment, ApiResponse } from '@/types';

const serviceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().optional(),
});

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
      role: 'admin', // Placeholder
      name: user.firstName + ' ' + user.lastName,
    });
  }

  const { data, error } = await client
    .from('appointments')
    .select('*, service(name), patient:user_id(name), provider:user_id(name)');

  if (error) {
    return NextResponse.json<ApiResponse<never>>(
      { error: error.message },
      { status: 400 }
    );
  }
  return NextResponse.json<ApiResponse<Appointment[]>>({ data });
}

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

  if (pathname.includes('service')) {
    const validated = serviceSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json<ApiResponse<never>>(
        { error: validated.error.message },
        { status: 400 }
      );
    }

    const { name, description } = validated.data;
    const { data: existingUser } = await client
      .from('users')
      .select()
      .eq('user_id', user.id)
      .single();

    if (!existingUser) {
      await client.from('users').insert({
        user_id: user.id,
        email: user.emailAddresses[0].emailAddress,
        role: 'admin', // Placeholder
        name: user.firstName + ' ' + user.lastName,
      });
    }

    const { error } = await client.from('services').insert({ name, description });

    if (error) {
      return NextResponse.json<ApiResponse<never>>(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json<ApiResponse<null>>(
      { message: 'Service added' },
      { status: 200 }
    );
  }

  return NextResponse.json<ApiResponse<never>>(
    { error: 'Invalid route' },
    { status: 400 }
  );
}