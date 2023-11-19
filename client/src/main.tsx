import './app.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { rspc, client, queryClient } from './utils/rspc';
import { dark } from '@clerk/themes';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { RouterProvider, Router, RouterContext } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';
import { useJwtStore } from './store';
if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { getToken, isSignedIn } = useAuth();

  const setToken = useJwtStore((s) => s.setJwt);
  const isExpired = useJwtStore((s) => s.expired);

  React.useEffect(() => {
    if (isSignedIn && !isExpired) return;
    const token = async () => {
      return await getToken({ template: 'with_role' });
    };
    token().then((res) => setToken(res));
  }, [isSignedIn, isExpired]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <rspc.Provider client={client} queryClient={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <App />
      </ClerkProvider>
    </rspc.Provider>
  </React.StrictMode>,
);
