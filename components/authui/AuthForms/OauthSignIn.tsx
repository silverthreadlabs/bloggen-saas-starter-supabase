'use client';

import { Button } from '@/components/ui/button';
import { signInWithOAuth } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { Provider } from '@supabase/supabase-js';

type SocialAuthButtonProps = {
  provider: Provider;
  icon: React.ReactElement;
  label: string;
  redirectMethod: string;
};

function SocialAuthButton({
  provider,
  icon,
  label,
  redirectMethod
}: SocialAuthButtonProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    await signInWithOAuth(e);
    setIsSubmitting(false);
  };

  return (
    <form
      noValidate={true}
      onSubmit={(e) => handleSubmit(e)}
      className="w-full"
    >
      <Button
        variant="outline"
        color="neutral"
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-canvas-border bg-canvas-bg-subtle text-canvas-text hover:bg-canvas-bg-hover hover:border-canvas-border-hover transition-colors duration-200 cursor-pointer"
        isLoading={isSubmitting}
        fullWidth={true}
        leadingIcon={icon}
      >
        {label}
      </Button>
    </form>
  );
}

interface OauthSignInProps {
  redirectMethod?: string;
}

export default function OauthSignIn({ redirectMethod = 'client' }: OauthSignInProps) {
  return (
    <div className="flex flex-col gap-3">
      <SocialAuthButton
        provider="google"
        icon={
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.7-6.7C35.7 2.5 30.1 0 24 0 14.8 0 6.9 5.4 2.8 13.3l7.8 6.1C12.5 12.2 17.8 9.5 24 9.5z"/>
              <path fill="#34A853" d="M10.6 28.8c-1-3-1-6.3 0-9.2l-7.8-6.1c-2.7 5.4-2.7 11.8 0 17.2l7.8-6.1z"/>
              <path fill="#FBBC05" d="M46.5 24c0-1.5-.1-3-.4-4.5H24v9h12.7c-.6 3-2.4 5.5-5 7.2l7.8 6.1c4.5-4.1 7-10.2 7-17.8z"/>
              <path fill="#EA4335" d="M24 48c6.5 0 12-2.1 16-5.7l-7.8-6.1c-2.2 1.5-5 2.4-8.2 2.4-6.2 0-11.5-4.2-13.4-9.8l-7.8 6.1C6.9 42.6 14.8 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
        }
        label="Continue with Google"
        redirectMethod={redirectMethod}
      />
    </div>
  );
}
