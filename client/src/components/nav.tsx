import { Outlet, Route, Link } from '@tanstack/react-router';
import {
  useUser,
  UserButton as ClerkUserButton,
  RedirectToSignIn,
} from '@clerk/clerk-react';
import {
  Boxes,
  PanelLeft,
  Plus,
  Tag,
  User,
  Search,
  BadgeCheck,
} from 'lucide-react';
import { CollectionLinks } from './links/collection_lists';
import { NewCollection } from './modals/collection_modals';
import { SearchCMDK } from './modals/search';
import { TabLinkCollection } from './modals/link_modals';
import { cn } from '../utils';
// import './nav.css'
import React from 'react';
const privateLinks = [
  { href: '/tags', label: 'Tags', icon: <Tag />, disabled: false },
  {
    href: '/collections',
    label: 'Collections',
    icon: <Boxes />,
    disabled: false,
  },
  { href: '/me', label: 'Me', icon: <User />, disabled: true },
] as const;

interface LinksProps {
  links: typeof privateLinks;
}

export function Links({ links }: LinksProps) {
  return (
    <div className='flex w-full flex-col space-y-0.5'>
      {links.map(({ href, label, icon, disabled }) => (
        <Link
          to={href}
          activeProps={{ style: { backgroundColor: 'rgb(243 244 246)' } }}
          key={`link${href}`}
          className={cn(
            'group flex w-full flex-row items-center justify-between rounded-lg border-2 border-transparent px-2 py-1 transition text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-normal',
            disabled && 'opacity-50',
          )}
          disabled={disabled}
        >
          <button>
            <div className='flex flex-row items-center justify-start truncate'>
              <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
                {icon}
              </div>
              <p className='truncate text-sm'>{label}</p>
            </div>
          </button>
        </Link>
      ))}
    </div>
  );
}

export function Nav({ onClickHandle }: { onClickHandle: () => void }) {
  const { isSignedIn, user } = useUser();
  const UserButton = () => {
    return (
      <div className='hover:bg-blue-200/50 hover:text-indigo-900 group flex w-full flex-row items-center justify-between space-x-2 rounded-xl m-0.5 p-1 space-y-3 border shadow-sm'>
        <div className='flex flex-row items-center justify-start space-x-2'>
          {isSignedIn ? (
            <>
              <ClerkUserButton afterSignOutUrl='/' />
              <span className='line-clamp-1 text-left text-sm font-medium'>
                {user.username}
              </span>
              <BadgeCheck size={16} />
            </>
          ) : (
            <RedirectToSignIn />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-between border-r border-gray-200 bg-white',
      )}
    >
      <div className='flex h-full w-full flex-auto flex-col overflow-hidden'>
        <div className='flex h-[50px] flex-row items-center justify-between space-x-2 border-b border-gray-100 p-2 pl-2'>
          <UserButton />
          {/* TODO: add onClick */}
          <div className='trigger'>
            <button
              className='flex items-center justify-center rounded-md p-0.5 text-gray-500 transition hover:bg-gray-200/50 hover:text-gray-700'
              onClick={onClickHandle}
            >
              <PanelLeft size={20} />
            </button>
          </div>
        </div>
        <div className='mt-4 flex w-full flex-row space-x-2 px-2'>
          <SearchCMDK>
            <button className='bg-white text-gray-700 focus:outline-none ring-1 ring-black/5 shadow-small hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white focus-visible:button-focus-outline  w-full h-8 rounded-lg px-2 text-sm min-w-[60px] relative flex flex-row items-center justify-center space-x-1 font-medium transition disabled:cursor-not-allowed'>
              <div className='relative flex items-center justify-center'>
                <Search />
                <span className='relative whitespace-nowrap'>Search</span>
              </div>
            </button>
          </SearchCMDK>
          <TabLinkCollection>
            <button className='rounded-lg bg-white text-gray-700 focus:outline-none ring-1 ring-black/5 shadow-small hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white focus-visible:button-focus-outline  auto shrink-0 ounded-lg px-2 text-sm h-8 w-8  relative flex flex-row items-center justify-center space-x-1 font-medium transition disabled:cursor-not-allowed'>
              <div className='relative flex items-center justify-center'>
                <Plus />
              </div>
            </button>
          </TabLinkCollection>
        </div>
        <div className='mt-4 flex w-full flex-col space-y-0.5 px-2'>
          <Links links={privateLinks} />
        </div>
        <div className='relative flex w-full items-center justify-center mt-4 px-2'>
          <div className='h-[1px] w-full rounded-full bg-gray-100' />
        </div>
        <div className='styled-scrollbar relative flex w-full flex-auto flex-col space-y-2 overflow-x-hidden overflow-y-auto px-2 pb-2 pt-2'>
          <div className='sticky -top-2 z-10 flex w-full flex-row items-center justify-between px-2 pt-2'>
            <div className='pointer-events-none absolute left-0 top-0 z-0 h-10 w-full bg-gradient-to-b from-white via-white'></div>
            <p className='relative z-10 text-xs font-medium text-gray-500'>
              Collections
            </p>
            <NewCollection>
              <button className='relative z-10 flex h-4 w-4 items-center justify-center rounded-md bg-gray-100 transition hover:bg-gray-200'>
                <Plus />
              </button>
            </NewCollection>
          </div>
          <CollectionLinks pinned={true} />
        </div>
      </div>
      <div className='flex w-full flex-col'>
        {/* <button className='group flex w-full flex-col items-start justify-start p-4 text-left transition hover:bg-gray-200/50 rounded-md border-card'>
        </button> */}
      </div>
    </div>
  );
}
