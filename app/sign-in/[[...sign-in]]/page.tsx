// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-primary mb-6">
        Welcome to SDLM Hospital
      </h2>
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
            card: 'bg-card shadow-none',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
          },
        }}
      />
      <p className="mt-4 text-sm text-gray-600">
        New to SDLM?{' '}
        <a href="/sign-up" className="text-primary hover:underline">
          Create an account
        </a>
      </p>
    </div>
  );
}