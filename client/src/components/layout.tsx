import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  Link,
  useMatches,
  useRouterState,
} from '@tanstack/react-router';
import { useIsFetching } from '@tanstack/react-query';
import { useJwtStore, useUrlStore } from '../store';
import { useAuth } from '@clerk/clerk-react';
import { Nav } from './nav';
import React, { useState } from 'react';
import './layout.css';
import { PanelLeft, PanelRightClose, PanelRightOpen, Plus } from 'lucide-react';
import { CalenderView } from './calender_view';
import { SearchCMDK } from './modals/search';
import { cn } from '../utils';
import { useWindowSize } from 'usehooks-ts';

// export function RenderHeader({url}: {url: string[]}) {
//   const lenUrl = url.length;
//   console.log(useMatches())
//   return (
//   <div className="inline-flex flex-row font-bold text-lg items-center transition ease-in-out">
//     <Link to="/">
//       <div className="whitespace-nowrap text-gray-900">
//         Bookmark /&nbsp;
//       </div>
//     </Link>
//       {lenUrl >1 &&
//       <Link to={`/${url[1]}`}>
//       <div className="text-[#FFC53D]">
//         {url[1].toLocaleUpperCase()} / &nbsp;
//       </div>
//       </Link>
//       }
//       {lenUrl >2 &&
//       <div className="bg-[#0090FF] text-[white] rounded-md px-1 py-0">
//         {url[2]}
//       </div>}
//     </div>
//   )
// }

export function Layout() {
  const isLoading = useIsFetching({
    predicate: (query) => query.state.status === 'loading',
  });
  const url = useUrlStore.getState().url;
  const { width } = useWindowSize();
  const [isSidebarOpen, toggleSidebar] = React.useState<boolean>(true);
  const [isCalenderOpen, toggleCalender] = React.useState<boolean>(true);

  const toggleLeft = () => toggleSidebar(!isSidebarOpen);
  const toggleRight = () => toggleCalender(!isCalenderOpen);

  const Header = () => {
    return (
      <div className='flex h-[50px] max-h-[50px] flex-row items-center justify-between space-x-4 border-b border-gray-200/50 bg-gray-50 px-4 py-2.5'>
        <div className='flex flex-row items-center justify-start'>
          <div
            className={cn(
              'flex w-[0] flex-row items-center justify-start space-x-1 overflow-hidden',
              !isSidebarOpen && 'w-[28px] mr-2',
            )}
          >
            <button
              className='flex items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700'
              onClick={toggleLeft}
            >
              <PanelLeft size={20} />
            </button>
          </div>
          {/* <div className='h-[25px] w-[1px] bg-gray-300 rounded-full mx-1'/> */}
          {/* <RenderHeader url={url}/> */}
          <Link to='/'>
            <h1 className='whitespace-nowrap text-base font-semibold text-gray-900'>
              {`Bookmarks/`}
            </h1>
          </Link>
        </div>
        <div className='flex flex-row items-center space-x-2'>
          <button
            className='flex items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700'
            onClick={toggleRight}
            disabled={width < 768 ? true : false}
          >
            {isCalenderOpen ? <PanelRightClose /> : <PanelRightOpen />}
          </button>
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
      <div
        className={cn(
          'overflow-hidden transition-[width] ease-in-out',
          width > 1500 ? 'w-[280px]' : 'w-[250px]',
          !isSidebarOpen ? 'w-0' : '',
        )}
      >
        <Nav onClickHandle={toggleLeft} />
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
      <div
        className={cn(
          'overflow-hidden w-[280px] transition-[width] ease-in-out',
          isCalenderOpen && width < 1280 && 'w-0',
          !isCalenderOpen && 'w-0',
        )}
      >
        {/* <C/> */}
        <CalenderView />
      </div>
      <div className='position: fixed; z-index: 9999; inset: 16px; pointer-events: none;' />
    </main>
  );
}
