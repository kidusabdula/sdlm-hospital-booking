// components/NavBar.tsx
'use client';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NavBar() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          SDLM Hospital
        </Link>
        <div className="space-x-4">
          <Button asChild variant="ghost" className="text-primary-foreground hover:bg-secondary">
            <Link href="/patient/book">Book Appointment</Link>
          </Button>
          <Button asChild variant="ghost" className="text-primary-foreground hover:bg-secondary">
            <Link href="/patient/appointments">My Appointments</Link>
          </Button>
          <SignOutButton>
            <Button variant="outline" className="border-primary-foreground hover:bg-secondary">
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </nav>
  );
}
