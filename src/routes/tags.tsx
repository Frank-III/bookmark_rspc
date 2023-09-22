import * as React from 'react'
import { FileRoute } from '@tanstack/react-router'
import { Layout } from '../components/layout';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { NewLink } from '../components/modals/link_modals';
import { Button } from '../components/ui/button';

export const route = new FileRoute('tags').createRoute({
  component: () => {
    return (
      <>
        <div className='w-full bg-base-200'>
          <div className='w-full max-w-7xl p-4 mx-auto'>
            <h1> Test Tags</h1>
            <NewLink>
              <Button variant='outline'>New Link</Button>
            </NewLink>
          </div>
        </div>
      </>
    );
  },
  },
})
