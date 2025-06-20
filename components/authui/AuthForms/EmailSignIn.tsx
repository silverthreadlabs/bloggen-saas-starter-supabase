'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signInWithEmail } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Define prop type with allowPassword boolean
interface EmailSignInProps {
  allowPassword?: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export default function EmailSignIn({
  allowPassword,
  redirectMethod,
  disableButton
}: EmailSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithEmail, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email" className="text-canvas-text">Email</label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md bg-canvas-bg-subtle text-canvas-text-contrast border border-canvas-border focus:outline-none focus:ring-2 focus:ring-primary-solid focus:border-transparent transition-colors duration-200"
            />
          </div>
          <Button
            variant="solid"
            color="primary"
            type="submit"
            className="mt-1 cursor-pointer"
            isLoading={isSubmitting}
            disabled={disableButton}
            fullWidth={true}
          >
            Sign in
          </Button>
        </div>
      </form>
      {allowPassword && (
        <>
          <p className="text-canvas-text">
            <Link href="/signin/password_signin" className="font-light text-sm text-primary-text hover:text-primary-text-contrast transition-colors duration-200">
              Sign in with email and password
            </Link>
          </p>
          <p className="text-canvas-text">
            <Link href="/signin/signup" className="font-light text-sm text-primary-text hover:text-primary-text-contrast transition-colors duration-200">
              Don't have an account? Sign up
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
