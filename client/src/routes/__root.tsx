import * as React from 'react';
import { Link, Outlet, RootRoute, RouterMeta } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Layout } from '../components/layout';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../utils/rspc';

const routerContext = new RouterMeta<{
  queryClient: typeof queryClient;
}>();

export const route = routerContext.createRootRoute({
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
        {/* <TanStackRouterDevtools position='bottom-left' /> */}
      </>
    );
  },
});
