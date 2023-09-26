import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { FetchTransport, RSPCError, createClient } from '@rspc/client';
import { createReactQueryHooks } from '@rspc/react';

import type { Procedures } from '../../bindings'; // These are generated by rspc in Rust for you.
import { useJwtStore } from '../store';
import { toast } from 'sonner';

const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const token = useJwtStore.getState().jwt;
  const resp = await globalThis.fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      ...init?.headers,
      authorization: `Bearer ${token}`,
    },
  });
  return resp;
};

// You must provide the generated types as a generic and create a transport (in this example we are using HTTP Fetch) so that the client knows how to communicate with your API.
const client = createClient<Procedures>({
  // Refer to the integration your using for the correct transport.
  transport: new FetchTransport('http://localhost:9000/rspc', fetch),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof RSPCError) {
        if (err.code === 401) {
          useJwtStore.getState().setExpired(true);
        }
        return;
      }
      toast.error(
        'Query Failed: Something went wrong, please try again later.',
      );
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      if (err instanceof RSPCError) {
        if (err.code === 401) useJwtStore.getState().setExpired(true);
        return;
      }
      toast.error(
        'Mutation Failed: Something went wrong, please try again later.',
      );
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation?.meta?.message) {
        toast.success(mutation?.meta?.message as string);
      }
    },
  }),
});

const rspc = createReactQueryHooks<Procedures>();

export { rspc, client, queryClient };
