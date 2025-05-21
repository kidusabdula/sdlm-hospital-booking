// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-primary mb-6">
        Join SDLM Hospital
      </h2>
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105",
            card: "bg-card shadow-none",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
      />
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
