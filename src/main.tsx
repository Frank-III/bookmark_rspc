import './app.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { rspc, client, queryClient } from './utils/rspc';
import { dark } from '@clerk/themes';
import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider, Router, RouterContext } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';
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
  const clerkappearance = {};
  return (
    <rspc.Provider client={client} queryClient={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <RouterProvider router={router} />
      </ClerkProvider>
    </rspc.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
