import {
  Outlet,
  Route,
  Link,
} from '@tanstack/react-router'
import { useUser } from '@clerk/clerk-react';
import { PanelLeft, Plus } from 'lucide-react';

const privateLinks = [
  {href:"/tags", label: "Tags"},
  {href:"/collections", label: "Collections"},
  {href:"/me", label: "Me"},
] as const;

interface PinnedCollectionProps {

}

export function PinnedCollections(PinnedCollectionProps) {
  return (
    <div className='flex w-full flex-col space-y-0.5'>
      <Link>
        <button className='group flex w-full flex-row items-center justify-between rounded-lg border-2 border-transparent px-2 py-1 transition bg-gray-100 font-semibold text-gray-900'>

        </button>
      </Link>
    </div>
  )

}


export function Nav() {
  const { user } = useUser();

  return (
    <div className='flex h-full w-[280px] flex-col items-center justify-between border-r border-gray-200 bg-white'>
      <div className='flex h-full w-full flex-auto flex-col overflow-hidden'>
        <div className='flex h-[50px] flex-row items-center justify-between space-x-2 border-b border-gray-100 p-2 pl-2'> 
          UserButton
          {/* TODO: add onClick */}
          <button className='flex items-center justify-center rounded-md p-0.5 text-gray-500 transition hover:bg-gray-200/50 hover:text-gray-700'> 
            <PanelLeft />
          </button>
        </div>
        <div className='mt-4 flex w-full flex-row space-x-2 px-2'>
          Search, Add
        </div>
        <div className='mt-4 flex w-full flex-col space-y-0.5 px-2'>
          Links
        </div>
        <div className="relative flex w-full items-center justify-center mt-4 px-2">
          <div className="h-[1px] w-full rounded-full bg-gray-100"/>
        </div>
        <div className='styled-scrollbar relative flex w-full flex-auto flex-col space-y-2 overflow-y-auto px-2 pb-2 pt-2'>
          <div className="sticky -top-2 z-10 flex w-full flex-row items-center justify-between px-2 pt-2">
            <div className="pointer-events-none absolute left-0 top-0 z-0 h-10 w-full bg-gradient-to-b from-white via-white"></div>
            <p className="relative z-10 text-xs font-medium text-gray-500">
              Collections
            </p>
            <button className='relative z-10 flex h-4 w-4 items-center justify-center rounded-md bg-gray-100 transition hover:bg-gray-200'>
              <Plus />
            </button>
          </div>
        </div>
      </div>
    </div>
    )
    }
