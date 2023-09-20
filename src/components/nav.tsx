import { Outlet, Route, Link } from '@tanstack/react-router';
import { useUser, UserButton as ClerkUserButton } from '@clerk/clerk-react';
import {
  Boxes,
  PanelLeft,
  Plus,
  Tag,
  User,
  Search,
  Loader2,
  Dot,
  GalleryVerticalEnd,
} from 'lucide-react';
import React, {
  ForwardRefExoticComponent,
  ReactElement,
  ReactNode,
} from 'react';
import { rspc } from '../utils/rspc';
import ButtonLoading from './buttons/button_loading';
import { CollectionPopover } from './buttons/collection_popover';
// import { UserButton } from './buttons/user_button';

const privateLinks = [
  { href: '/tags', label: 'Tags', icon: <Tag /> },
  { href: '/collections', label: 'Collections', icon: <Boxes /> },
  { href: '/me', label: 'Me', icon: <User /> },
] as const;

const fakedCollections = [
  {color: "red", name: "test1", id: "1"},
  {color: "blue", name: "test2", id: "2"},
  {color: "green", name: "test3", id: "3"},
  {color: "gray", name: "test4", id: "4"},
]


interface LinksProps {
  links: typeof privateLinks;
}

export function Links({ links }: LinksProps) {
  return (
    <div className='flex w-full flex-col space-y-0.5'>
      {links.map(({ href, label, icon }) => (
        <Link
          to={href}
          activeProps={{ style: { backgroundColor: 'rgb(243 244 246)' } }}
          key={`link${href}`}
          className='group flex w-full flex-row items-center justify-between rounded-lg border-2 border-transparent px-2 py-1 transition font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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

export function Nav() {
  const { isSignedIn, user } = useUser();

  const UserButton = () => {
    return (
      <div className='hover:bg-gray-200/50 group flex w-full flex-row items-center justify-between space-x-2 rounded-lg p-2 space-y-3'>
        <div className='flex flex-row items-center justify-start space-x-2'>
          {isSignedIn ? (
            <>
              <ClerkUserButton afterSignOutUrl='/' />
              <span className='line-clamp-1 text-left text-sm font-medium'>
                {user.username}
              </span>
            </>
          ) : (
            <Link to='/auth/sign_in' key='sign-in'>
              Sign In
            </Link>
          )}
        </div>
      </div>
    );
  };

  const {
    status,
    data: collections,
    isFetching,
  } = rspc.useQuery(['collections.getByUser'], { enabled: !!user });

  const PinndCollections = () => {
    // const collections = [{collection:{id:"1", name:"test", color:"red"}}]
    switch (status) {
      case 'loading':
        return isFetching ? (
          <div className='flex w-full flex-row items-center mt-4 justify-center'>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          </div>
        ) : (
          <div>Error</div>
        );
        break;
      case 'error':
        return <div>Error</div>;
        break;
      case 'success':
        // collections.sort((a, b) => {return a.})
        return (
          <>
            {collections.length == 0 ? (
              // <div className='flex items-center justify-center mt-5'>
              //   <span className='text-gray-700 text-sm '>
              //     You have no Pinned Collections
              //   </span>
              // </div>
                <>
                  <div className=" pointer-events-none opacity-40 blur-sm">
                    {fakedCollections.map((collection) => (
                      <a href="#">
                        <button className='group flex w-full flex-row items-center justify-between rounded-lg border-2 border-transparent px-2 py-1 transition font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'>
                          <div className='flex flex-row items-center justify-start truncate'>
                            <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
                              <Dot color={collection.color} size={'auto'} />
                            </div>
                            <p className='truncate text-sm'>{collection.name}</p>
                          </div>
                        </button>
                      </a>
                    )
                    )}
                  </div>
                  <div className='absolute h-full w-full bg-gradient-to-t from-white to-transparent'>
                  </div>
                  <div className='absolute left-1/2 top-6 mx-auto flex max-w-[150px] -translate-x-1/2 flex-col items-center justify-center text-center'>
                    <GalleryVerticalEnd size={24}/>
                    <h4 className='mb-1 mt-3 text-sm font-medium text-gray-900'>No Collections</h4>
                    <p className='mb-3 text-xs text-gray-500'>Create a collection to organize your writing.</p>
                    <div className='mx-auto'>
                      <button className='bg-white text-gray-700 focus:outline-none ring-1 ring-black/5 shadow-small hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white focus-visible:button-focus-outline  auto shrink-0 h-8 rounded-lg px-2 text-sm min-w-[60px] relative flex flex-row items-center justify-center space-x-1 font-medium transition disabled:cursor-not-allowed'>
                        <span className='relative whitespace-nowrap'>
                          Create Collection
                        </span>
                      </button>
                    </div>
                  </div>
                </>
            ) : (
              collections?.map((collection) => {
                const { id, name, color } = collection;
                return (
                  <Link
                    to={`/collections/${id}`}
                    className='group flex w-full flex-row items-center justify-between rounded-lg border-2 border-transparent px-2 py-1 transition bg-gray-100 font-semibold text-gray-900'
                    key={`to-collection${id}`}
                  >
                    <div className='flex flex-row items-center justify-start truncate'>
                      <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
                        <Dot color={color} size={'auto'} />
                      </div>
                      <p className='truncate text-sm'>{name}</p>
                    </div>
                    <CollectionPopover />
                  </Link>
                );
              })
            )}
          </>
        );
    }
  };

  return (
    <div className='left-sidebar flex h-full w-[280px] flex-col items-center justify-between border-r border-gray-200 bg-white'>
      <div className='flex h-full w-full flex-auto flex-col overflow-hidden'>
        <div className='flex h-[50px] flex-row items-center justify-between space-x-2 border-b border-gray-100 p-2 pl-2'>
          <UserButton />
          {/* TODO: add onClick */}
          <button className='flex items-center justify-center rounded-md p-0.5 text-gray-500 transition hover:bg-gray-200/50 hover:text-gray-700'>
            <PanelLeft size={20} />
          </button>
        </div>
        <div className='mt-4 flex w-full flex-row space-x-2 px-2'>
          <button className='bg-white text-gray-700 focus:outline-none ring-1 ring-black/5 shadow-small hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white focus-visible:button-focus-outline  w-full h-8 rounded-lg px-2 text-sm min-w-[60px] relative flex flex-row items-center justify-center space-x-1 font-medium transition disabled:cursor-not-allowed'>
            <div className='relative flex items-center justify-center'>
              <Search />
              <span className='relative whitespace-nowrap'>Search</span>
            </div>
          </button>
          <button className='bg-white text-gray-700 focus:outline-none ring-1 ring-black/5 shadow-small hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white focus-visible:button-focus-outline  auto shrink-0 h-8 rounded-lg px-2 text-sm h-8 w-8  relative flex flex-row items-center justify-center space-x-1 font-medium transition disabled:cursor-not-allowed'>
            <div className='relative flex items-center justify-center'>
              <Plus />
            </div>
          </button>
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
            <button className='relative z-10 flex h-4 w-4 items-center justify-center rounded-md bg-gray-100 transition hover:bg-gray-200'>
              <Plus />
            </button>
          </div>
          <div className='flex w-full flex-col space-y-0.5'>
            <PinndCollections />
          </div>
          {/* <div className='flex w-full flex-col space-y-0.5'>
            <CollectionLinks />
          </div> */}
        </div>
      </div>
    </div>
  );
}
