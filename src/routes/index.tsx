import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { Layout } from '../components/layout';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const route = new FileRoute('/').createRoute({
  component: () => {
    return <div className='p-2'>Hello</div>;
  },
});
