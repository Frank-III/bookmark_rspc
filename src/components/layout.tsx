import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  Link,
  RouterContext,
} from '@tanstack/react-router';
import { useIsFetching } from '@tanstack/react-query';
import { useJwtStore } from '../store';
import { useAuth } from '@clerk/clerk-react';
import { Nav } from './nav';
import React from 'react';
import './layout.css';
import { PanelLeft, Plus } from 'lucide-react';
import { CalenderView } from './calender_view';
import { SearchCMDK } from './modals/search';

export function Layout() {
  const isLoading = useIsFetching({
    predicate: (query) => query.state.status === 'loading',
  });


  const Header = () => {
    return (
      <div className='flex h-[50px] max-h-[50px] flex-row items-center justify-between space-x-4 border-b border-gray-200/50 bg-gray-50 px-4 py-2.5'>
        <div className='flex flex-row items-center justify-start'>
          <div className='hidden-toggle flex flex-row items-center justify-start space-x-1 overflow-hidden'>
            <button className='flex items-center justify-center rounded-md p-0.5 text-gray-500 transition hover:bg-gray-200/50 hover:text-gray-700'>
              <PanelLeft size={20} />
            </button>
          </div>
          <Link to='/'>
            <h1 className='whitespace-nowrap text-base font-semibold text-gray-900'>
              Bookmarks
            </h1>
          </Link>
        </div>
        <div className='flex flex-row items-center space-x-2'>
          <button className='bg-white text-gray-700 focus:outline-none ring-1 ring-black/5 shadow-small hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white focus-visible:button-focus-outline  auto shrink-0 h-8 rounded-lg px-2 text-sm min-w-[60px] relative flex flex-row items-center justify-center space-x-1 font-medium transition disabled:cursor-not-allowed inline-block sm:hidden'>
            <div className='relative flex items-center justify-center'>
              <Plus />
            </div>
            <span className='relative whitespace-nowrap'>Add</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className='flex h-screen overflow-hidden bg-gray-50'>
      <div className='overflow-hidden w-[280px] min-w-[280px]'>
        <Nav />
      </div>
      <div className='flex w-full min-w-[300px] flex-1 flex-col overflow-hidden'>
        <Header />
        <div
          id='infinite-scoll-container'
          className='relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden p-4'
        >
          <div className='pointer-events-none sticky top-0 z-10 w-full -translate-y-4 py-4'>
            <div className='pointer-events-none absolute left-0 top-0 z-0 h-full w-full bg-gradient-to-b from-gray-50 via-gray-50/50' />
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
      <div className='overflow-hidden w-[280px] min-w-[280px]'>
        {/* <C/> */}
        <CalenderView />
      </div>
    </main>
  );
}
