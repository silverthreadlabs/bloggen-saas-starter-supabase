"use client";
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

type Product = Tables<'products'> & { prices: Tables<'prices'>[] };
type Price = Tables<'prices'>;
type Subscription = Tables<'subscriptions'>;

type Props = {
  products: Product[];
  user: unknown | null | undefined;
  subscription: Subscription | null;
};

export default function HomePricingSection({ products, user, subscription }: Props) {
  const [priceIdLoading, setPriceIdLoading] = useState<string | undefined>();
  const router = useRouter();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);


      return router.push('/signin/signup');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);


      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  return (
    <section className="relative py-16 w-full">
      <div className="px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <span className="text-primary-text border-canvas-line mb-4 block max-w-fit rounded border border-none bg-transparent px-1 font-mono text-sm leading-normal font-normal tracking-widest whitespace-nowrap uppercase md:text-base mx-auto">
              Pricing Plans
            </span>
            <h2 className="text-canvas-text-contrast mb-6 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
              Choose Your
              <span className="from-primary-solid via-primary-text to-primary-text-contrast bg-gradient-to-r bg-clip-text text-transparent">
                <br />
                Perfect Plan
              </span>
            </h2>
            <p className="text-canvas-text mb-8 text-xl leading-relaxed font-normal tracking-normal md:text-2xl max-w-3xl mx-auto">
              Simple, transparent pricing that scales with your business needs.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="flex justify-center">
            <div className={`
              grid gap-8 w-full
              ${products.length === 1 ? 'max-w-md' : ''}
              ${products.length === 2 ? 'max-w-4xl grid-cols-1 md:grid-cols-2' : ''}
              ${products.length === 3 ? 'max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
              ${products.length >= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''}
            `}>
              {products?.map((product, index) => {
                const isPopular = index === 1 || product.name?.toLowerCase().includes('pro') || product.name?.toLowerCase().includes('popular');
                const isCurrentPlan = subscription?.price_id && product.prices?.some(p => p.id === subscription.price_id);
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`
                      relative group transition-all duration-300
                      ${isPopular ? 'lg:-translate-y-2' : ''}
                    `}
                  >
               

                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <div className="absolute -top-4 right-4 z-20">
                        <div className="bg-success-solid text-success-on-success px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          Current Plan
                        </div>
                      </div>
                    )}

                    <div className={`
                      relative h-full rounded-2xl p-8 transition-all duration-300 group-hover:shadow-xl
                      ${isPopular 
                        ? 'bg-canvas-bg-subtle border-primary-solid border-2 shadow-lg' 
                        : 'bg-canvas-bg-subtle border-canvas-border border shadow-sm hover:shadow-md'
                      }
                    `}>
                      <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="mb-8">
                          <h3 className="text-canvas-text-contrast text-2xl font-bold mb-3">
                            {product.name}
                          </h3>
                          <p className="text-canvas-text leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Pricing */}
                        <div className="mb-8 flex-1">
                          {product.prices?.map((price: Price) => {
                            const priceDisplay = price.unit_amount !== null ? `$${(price.unit_amount / 100).toFixed(0)}` : 'Free';
                            
                            return (
                              <div key={price.id} className="mb-6 last:mb-0">
                                <div className="flex items-baseline mb-3">
                                  <span className="text-canvas-text-contrast text-5xl font-bold">
                                    {priceDisplay}
                                  </span>
                                  <span className="ml-2 text-canvas-text text-lg font-normal">
                                    /{price.interval}
                                  </span>
                                </div>
                                
                                {price.interval === 'year' && price.unit_amount && (
                                  <div className="inline-flex items-center px-3 py-1 bg-success-bg border border-success-border rounded-full mb-4">
                                    <span className="text-success-text text-sm font-medium">
                                      Save 20% annually
                                    </span>
                                  </div>
                                )}
                                
                                <Button
                                  color="primary"
                                  variant="solid"
                                  size="lg"
                                  fullWidth
                                  isLoading={priceIdLoading === price.id}
                                  onClick={() => handleStripeCheckout(price)}
                                  disabled={priceIdLoading === price.id}
                                  className="!cursor-pointer"
                                >
                                  {subscription ? 'Manage Plan' : 'Get Started'}
                                </Button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Features */}
                        <div className="mt-auto pt-6 border-t border-canvas-border">
                          <div className="flex items-center text-sm text-canvas-text">
                            <svg className="w-4 h-4 mr-2 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Full access to all features</span>
                          </div>
                          <div className="flex items-center text-sm text-canvas-text mt-2">
                            <svg className="w-4 h-4 mr-2 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>24/7 Customer Support</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center justify-center space-x-8 p-6 bg-canvas-bg-subtle border border-canvas-border rounded-2xl shadow-sm">
              <div className="flex items-center space-x-2 text-canvas-text">
                <svg className="w-5 h-5 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">30-day free trial</span>
              </div>
              <div className="flex items-center space-x-2 text-canvas-text">
                <svg className="w-5 h-5 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2 text-canvas-text">
                <svg className="w-5 h-5 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">No setup fees</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}