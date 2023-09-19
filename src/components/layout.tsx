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
import './layout.css'

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
      <div className='flex h-[50px] max-h-[50px] flex-row items-center justify-between space-x-4 border-b border-gray-200/50 bg-gray-50 px-4 py-2.5' >
        <Link to='/'>
          <div className='flex flex-row items-center justify-start' >
            <h1 className='whitespace-nowrap text-base font-semibold text-gray-900'>Bookmarks</h1>
          </div>
        </Link>
      </div>
    )

  }

  return (
    <main className='flex h-screen overflow-hidden bg-gray-50'>
      <div className='overflow-hidden w-[280px] min-w-[280px]'>
        <Nav />
      </div>
      <div className='flex w-full min-w-[300px] flex-1 flex-col overflow-hidden"'>
        <Header />
        <div id="infinite-scoll-container" className='relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden p-4' >
          <div className='pointer-events-none sticky top-0 z-10 w-full -translate-y-4 py-4'>
            <div className='pointer-events-none absolute left-0 top-0 z-0 h-full w-full bg-gradient-to-b from-gray-50 via-gray-50/50'/>
            <div className='gradient-blur pointer-events-none absolute left-0 top-0 -ml-4 -mt-3 h-[140%] w-[150%] rotate-180'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </main>
  )
}
