// app/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { Role } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    const role = data?.role as Role;

    if (role === 'patient') redirect('/patient/book');
    if (role === 'staff') redirect('/staff/appointments');
    if (role === 'admin') redirect('/admin/dashboard');
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary text-center">
            Welcome to SDLM Hospital
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <p className="text-gray-600 text-center">
            Book appointments with ease and manage your healthcare needs.
          </p>
          <div className="flex gap-4">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary hover:bg-secondary transition-transform hover:scale-105"
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
