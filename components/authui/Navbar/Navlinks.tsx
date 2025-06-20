'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/logo/logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface NavlinksProps {
  user?: any;
}

const NAV_ITEMS = [
    { href: '/about', label: 'About' },
    { href: '/products', label: 'Products' },
    { href: '/blog', label: 'Blog' }
];

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen((open) => !open);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 xl:px-0">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Logo">
            <Logo />
          </Link>

          <nav aria-label='Primary navigation' className='space-x-2 hidden xl:flex items-center'>
            <ul className="flex space-x-3 items-center">
              <li key="pricing">
                <Link
                  href="/pricing"
                  className="text-canvas-text hover:text-canvas-text-contrast rounded-sm px-3 py-2 text-base font-medium transition-colors"
                >
                  Pricing
                </Link>
              </li>
              {NAV_ITEMS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-canvas-text hover:text-canvas-text-contrast rounded-sm px-3 py-2 text-base font-medium transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {user && (
                <li key="account">
                  <Link
                    href="/account"
                    className="text-canvas-text hover:text-canvas-text-contrast rounded-sm px-3 py-2 text-base font-medium transition-colors"
                  >
                    Account
                  </Link>
                </li>
              )}
              <li key="contact">
                <Link
                  href='/contact'
                  className='text-canvas-text hover:text-canvas-text-contrast rounded-sm px-3 py-2 text-base font-medium transition-colors'
                >
                  Contact
                </Link>
              </li>
              {user ? (
                <li key="signout">
                  <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
                    <input type="hidden" name="pathName" value={usePathname()} />
                    <Button type="submit" variant="solid" color="primary">
                      Sign out
                    </Button>
                  </form>
                </li>
              ) : (
                <li key="signin">
                  <Link href="/signin">
                    <Button variant="solid" color="primary">
                      Sign In
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <Button
            onClick={toggleMobile}
            aria-label='Toggle menu'
            name='Toggle menu'
            aria-controls='mobile-menu'
            aria-expanded={mobileOpen}
            className='block xl:hidden'
            color='neutral'
            variant='ghost'
            iconOnly
            leadingIcon={
                mobileOpen ? (
                    <FaTimes className='text-canvas-text h-5 w-5' />
                ) : (
                    <FaBars className='text-canvas-text h-5 w-5' />
                )
            }
          />
        </div>
      </div>

      {mobileOpen && (
        <nav
          id='mobile-menu'
          aria-label='Mobile navigation'
          aria-labelledby='mobile-menu-label'
          aria-describedby='mobile-menu-description'
          role='dialog'
          aria-modal='true'
          className='bg-canvas-base/95 sticky inset-0 top-[100px] z-50 h-screen backdrop-blur-sm xl:hidden transition-all duration-300 ease-in-out'>
          <ul className='border-canvas-border space-y-3 border-t p-4'>
            <li>
              <Link
                href="/pricing"
                onClick={toggleMobile}
                className="text-canvas-text hover:bg-canvas-bg hover:text-primary-text block rounded-sm px-4 py-2 text-base font-medium transition-colors"
              >
                Pricing
              </Link>
            </li>
            {NAV_ITEMS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={toggleMobile}
                  className="text-canvas-text hover:bg-canvas-bg hover:text-primary-text block rounded-sm px-4 py-2 text-base font-medium transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link
                  href="/account"
                  onClick={toggleMobile}
                  className="text-canvas-text hover:bg-canvas-bg hover:text-primary-text block rounded-sm px-4 py-2 text-base font-medium transition-colors"
                >
                  Account
                </Link>
              </li>
            )}
            <li>
              <div className='flex flex-col gap-3'>
                <Link
                  href='/contact'
                  onClick={toggleMobile}
                  className='text-canvas-text hover:bg-canvas-bg hover:text-primary-text block rounded-sm px-4 py-2 text-base font-medium transition-colors'
                >
                  Contact
                </Link>
                {user ? (
                  <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
                    <input type="hidden" name="pathName" value={usePathname()} />
                    <Button type="submit" variant="solid" color="primary" className="w-full">
                      Sign out
                    </Button>
                  </form>
                ) : (
                  <Link
                    href="/signin"
                    onClick={toggleMobile}
                  >
                    <Button variant="solid" color="primary" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
