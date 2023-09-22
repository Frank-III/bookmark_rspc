import * as React from 'react'
import { Link, Outlet, RootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Layout } from '../components/layout';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const route = new RootRoute({
  component: () => {
    return (
      <>
        <Layout />
        <SignedIn>
          <div className='w-full bg-base-200'></div>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <Toaster richColors position='top-center' />
        <ReactQueryDevtools position='bottom-right' initialIsOpen={false} />
        <TanStackRouterDevtools position='bottom-left' />
      </>
    );
  },
})
