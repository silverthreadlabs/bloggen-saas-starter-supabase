'use client';

import Button from '@/components/authui/Button';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: unknown | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  console.log('Products received by client Pricing component:', products);
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
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

  if (!products.length) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-br from-canvas-bg via-canvas-bg-subtle to-canvas-bg relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-solid/10 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-solid to-primary-solid/80 rounded-2xl mb-8 shadow-2xl">
              <svg className="w-10 h-10 text-primary-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-canvas-text-contrast mb-6 tracking-tight">
              No Plans Found
            </h1>
            <p className="text-xl sm:text-2xl text-canvas-text mb-8 leading-relaxed max-w-3xl mx-auto">
              Ready to get started? Create your subscription pricing plans in your{' '}
              <a
                className="text-primary-solid hover:text-primary-solid/80 underline decoration-2 underline-offset-4 transition-colors duration-200 font-semibold"
                href="https://dashboard.stripe.com/products"
                rel="noopener noreferrer"
                target="_blank"
              >
                Stripe Dashboard
              </a>
              {' '}and watch the magic happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="px-6 py-3 bg-canvas-bg-subtle border border-canvas-border rounded-xl text-canvas-text text-sm">
                💡 Tip: Set up your products first
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className="min-h-screen w-full bg-gradient-to-br from-canvas-bg via-canvas-bg-subtle to-canvas-bg relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-solid/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-solid/15 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_70%)]"></div>
        </div>

        <div className="relative z-10 py-8 sm:py-12">
          {/* Header Section */}
          <div className="text-center px-6 sm:px-8 lg:px-12 mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-solid/10 to-primary-solid/5 border border-primary-solid/20 rounded-full text-primary-solid font-medium text-sm mb-6 backdrop-blur-sm">
              ✨ Choose Your Perfect Plan
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-canvas-text-contrast mb-4 tracking-tight leading-tight">
              Pricing That
              <span className="block bg-gradient-to-r from-primary-solid to-primary-solid/70 bg-clip-text text-transparent">
                Scales With You
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-canvas-text leading-relaxed mb-8">
              Start building for free, then add a site plan to go live. Account plans unlock additional features and premium support.
            </p>

            {/* Billing Toggle */}
            {/* <div className="inline-flex items-center bg-canvas-bg-subtle/80 backdrop-blur-sm border border-canvas-border/50 rounded-2xl p-2 shadow-xl">
              {intervals.includes('month') && (
                <button
                  onClick={() => setBillingInterval('month')}
                  type="button"
                  className={cn(
                    'relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform',
                    billingInterval === 'month'
                      ? 'bg-gradient-to-r from-primary-solid to-primary-solid/90 text-primary-on-primary shadow-lg scale-105'
                      : 'text-canvas-text hover:text-canvas-text-contrast hover:bg-canvas-bg/50'
                  )}
                >
                  Monthly
                </button>
              )}
              {intervals.includes('year') && (
                <button
                  onClick={() => setBillingInterval('year')}
                  type="button"
                  className={cn(
                    'relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform',
                    billingInterval === 'year'
                      ? 'bg-gradient-to-r from-primary-solid to-primary-solid/90 text-primary-on-primary shadow-lg scale-105'
                      : 'text-canvas-text hover:text-canvas-text-contrast hover:bg-canvas-bg/50'
                  )}
                >
                  <span>Yearly</span>
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md">Save 20%</span>
                </button>
              )}
            </div> */}
          </div>

          {/* Pricing Cards */}
          <div className="px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-none">
              {products.map((product, index) => {
                const price = product?.prices?.find(
                  (price) => price.interval === billingInterval
                );
                if (!price) return null;
                
                const priceString = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: price.currency!,
                  minimumFractionDigits: 0
                }).format((price?.unit_amount || 0) / 100);
                
                const isPopular = product.name === 'Freelancer';
                const isCurrentPlan = subscription?.prices?.products?.name === product.name;

                return (
                  <div
                    key={product.id}
                    className={cn(
                      'relative group flex flex-col bg-gradient-to-br from-canvas-bg-subtle/80 to-canvas-bg-subtle/40 backdrop-blur-sm rounded-3xl p-6 transition-all duration-300 transform   hover:shadow-2xl border',
                      {
                        'border-primary-solid bg-gradient-to-br from-primary-solid/5 to-primary-solid/10 shadow-xl shadow-primary-solid/20': isPopular || isCurrentPlan,
                        'border-canvas-border/50 hover:border-canvas-border': !isPopular && !isCurrentPlan
                      }
                    )}
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-primary-solid to-primary-solid/80 text-primary-on-primary px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <div className="absolute -top-4 right-4">
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                          Current Plan
                        </div>
                      </div>
                    )}

                    <div className="flex-1">
                      {/* Plan Header */}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-canvas-text-contrast mb-2">
                          {product.name}
                        </h3>
                        <p className="text-canvas-text leading-relaxed text-sm">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-black text-canvas-text-contrast">
                            {priceString}
                          </span>
                          <span className="ml-2 text-base text-canvas-text font-medium">
                            /{billingInterval}
                          </span>
                        </div>
                        {billingInterval === 'year' && (
                          <p className="text-xs text-green-400 mt-1">
                            Save {Math.round(((12 * (price?.unit_amount || 0)) - (price?.unit_amount || 0)) / (12 * (price?.unit_amount || 0)) * 100)}% annually
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto">
                      <Button
                        variant="slim"
                        type="button"
                        loading={priceIdLoading === price.id}
                        onClick={() => handleStripeCheckout(price)}
                        className={cn(
                          'w-full py-3 text-sm font-semibold rounded-2xl cursor-pointer transition-all duration-200 transform   shadow-lg',
                          isPopular || isCurrentPlan
                            ? 'bg-gradient-to-r from-primary-solid to-primary-solid/90 text-primary-on-primary hover:shadow-xl hover:shadow-primary-solid/30'
                            : 'bg-canvas-bg-subtle border-2 border-canvas-border text-canvas-text-contrast hover:bg-canvas-bg hover:border-primary-solid/50'
                        )}
                      >
                        {subscription ? 'Manage Plan' : 'Get Started'}
                      </Button>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-solid/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 text-center px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-canvas-text-contrast mb-3">
                Need a custom solution?
              </h2>
              <p className="text-lg text-canvas-text mb-6">
                Contact our team for enterprise pricing and custom features tailored to your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-canvas-text text-sm">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 Priority Support
                </div>
                <div className="flex items-center gap-2 text-canvas-text text-sm">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom Integrations
                </div>
                <div className="flex items-center gap-2 text-canvas-text text-sm">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dedicated Account Manager
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}