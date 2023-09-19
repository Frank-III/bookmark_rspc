import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  Link,
  RouterContext,
} from '@tanstack/react-router'
import { useIsFetching } from '@tanstack/react-query';
import { useJwtStore } from '../store';
import { useAuth } from '@clerk/clerk-react';
import { Nav } from './nav';
import React from 'react';

export function Layout() {
  const isLoading = useIsFetching({
    predicate: (query) => query.state.status === 'loading',
  });

  const { getToken, isSignedIn } = useAuth();

  const setToken = useJwtStore((s) => s.setJwt);
  const isExpired = useJwtStore((s) => s.expired);

  React.useEffect(() => {
    if (isSignedIn && !isExpired) return;
    const token = async () => {
      return await getToken();
    };
    token().then((res) => setToken(res));
  }, [isSignedIn, isExpired]);

  const Header = () => {
    return (
      <div className='flex flex-row items-center justify-start' >

      </div>
    )

  }

  return (
    <main className='flex h-screen overflow-hidden bg-gray-50'>
      <div className='overflow-hidden w-[280px] min-w-[280px]'>
        <Nav />
      </div>
      <div className='flex w-full min-w-[300px] flex-1 flex-col overflow-hidden"'>
        Header
        <div id="infinite-scoll-container" className='relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden p-4' >
          <Outlet />
        </div>
      </div>
    </main>
  )
}
