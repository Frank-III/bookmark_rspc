import * as React from 'react';
import { FileRoute, Outlet } from '@tanstack/react-router';
import { Layout } from '../components/layout';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { NewLink } from '../components/modals/link_modals';
import { Button } from '../components/ui/button';
import { NewTag } from '../components/modals/tag_modals';
import { Badge } from '../components/ui/badge';
export const route = new FileRoute('/tags').createRoute({
  component: () => {
    return (
      <>
        <Outlet />
      </>
    );
  },
});
