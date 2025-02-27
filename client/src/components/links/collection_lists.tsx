import { Link, useMatch, useRouter } from '@tanstack/react-router';
import {
  Collection,
  PinnedCollections,
  CollectionWithPinnedStatus,
} from '../../../bindings';
import { CollectionDropdown } from '../buttons/collection_popover';
import {
  Album,
  Dot,
  GalleryVerticalEnd,
  Loader2,
  MoreVertical,
  Pin,
  SquareDot,
} from 'lucide-react';
import { rspc } from '../../utils/rspc';
import { useUser } from '@clerk/clerk-react';
import React from 'react';
import { set } from 'date-fns';
import { cn } from '../../utils';
import ContentLoader from 'react-content-loader';
import { useWindowSize } from 'usehooks-ts';

export type CollectionPinned = Omit<CollectionWithPinnedStatus, 'pinnedBy'> & {
  isPinned: boolean;
};

interface CollectionLinkProps {
  collection: CollectionPinned;
}

//FIXME: a really bad hack
export function CollectionLink({ collection }: CollectionLinkProps) {
  const [active, setActive] = React.useState(false);
  const { id, color, name } = collection;
  return (
    <div
      className={cn(
        'group flex w-full flex-row items-center justify-between rounded-lg border-2 border-transparent px-2 py-1 transition  font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        active && 'bg-gray-100 text-gray-900',
      )}
      key={`collection${id}`}
    >
      <Link
        to={`/collections/$collectionId`}
        params={{ collectionId: id.toString() }}
        key={`to-collection${id}`}
        // activeProps={{ style: { backgroundColor: 'rgb(243 244 246)' } }}
      >
        {({ isActive }) => {
          setActive(isActive);
          return (
            <div className='flex flex-row items-center justify-start truncate'>
              <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
                <Pin
                  color='white'
                  size={30}
                  fill={`${color}20`}
                  stroke={color}
                />
                {/* <Dot color={color} size={30} /> */}
              </div>
              <p className='truncate text-sm'>{name}</p>
            </div>
          );
        }}
        {/* <CollectionPopover collection={collection} /> */}
      </Link>
      <CollectionDropdown collection={collection}>
        <button className='flex -translate-x-1 items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700'>
          <MoreVertical size={15} />
        </button>
      </CollectionDropdown>
    </div>
  );
}

export interface CollectionLinksProps {
  pinned: boolean;
}

const fakedCollections = [
  { color: 'red', name: 'test1', id: '1' },
  { color: 'blue', name: 'test2', id: '2' },
  { color: 'green', name: 'test3', id: '3' },
  { color: 'gray', name: 'test4', id: '4' },
];

export function CollectionLinks({ pinned }: CollectionLinksProps) {
  const { isSignedIn, user } = useUser();
  const { width, height } = useWindowSize();
  const {
    status,
    data: collections,
    isFetching,
  } = rspc.useQuery(
    pinned ? ['collections.getPinned'] : ['collections.getAllWithPinned'],
    { enabled: !!user },
  );

  const size = width > 1500 ? 300 : 180;
  // const collections = [{collection:{id:"1", name:"test", color:"red"}}]
  {
    switch (status) {
      case 'loading':
        return isFetching ? (
          <ContentLoader
            speed={2}
            width={size}
            height={150}
            viewBox={`0 0 ${size} 150`}
            backgroundColor='#f3f3f3'
            foregroundColor='#ecebeb'
            // {...props}
          >
            <circle cx='10' cy='20' r='8' />
            <rect x='25' y='15' rx='5' ry='5' width='220' height='10' />
            <circle cx='10' cy='50' r='8' />
            <rect x='25' y='45' rx='5' ry='5' width='220' height='10' />
            <circle cx='10' cy='80' r='8' />
            <rect x='25' y='75' rx='5' ry='5' width='220' height='10' />
            <circle cx='10' cy='110' r='8' />
            <rect x='25' y='105' rx='5' ry='5' width='220' height='10' />
          </ContentLoader>
        ) : (
          <></>
        );
      // : (
      //   <div>Error</div>
      // );
      case 'error':
        //TODO: better Errors
        // return <div>Error</div>;
        return <></>;
      case 'success':
        // collections.sort((a, b) => {return a.})
        //TODO: better way?
        const collects = collections?.map((c) => {
          if ('collection' in c) {
            return { ...c.collection, isPinned: true } as CollectionPinned;
          } else {
            const { pinnedBy, ...collection } = c;
            return {
              ...collection,
              isPinned: pinnedBy.length > 0 ? true : false,
            } as CollectionPinned;
          }
        });
        return collects.length == 0 ? (
          <div className='relative flex w-full flex-col space-y-2 px-2'>
            <div className=' pointer-events-none opacity-40 blur-sm'>
              {fakedCollections.map((collection, index) => (
                <a href='#' key={`random-${index}`}>
                  <button className='group flex w-full flex-row items-center justify-between rounded-lg border-2 border-transparent px-2 py-1 transition font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'>
                    <div className='flex flex-row items-center justify-start truncate'>
                      <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
                        <Dot color={collection.color} size={'auto'} />
                      </div>
                      <p className='truncate text-sm'>{collection.name}</p>
                    </div>
                  </button>
                </a>
              ))}
            </div>
            <div className='absolute h-full w-full bg-gradient-to-t from-white to-transparent' />
            <div className='absolute left-1/2 top-2 mx-auto flex max-w-[150px] -translate-x-1/2 flex-col items-center justify-center text-center'>
              <GalleryVerticalEnd size={24} />
              <h4 className='mb-1 mt-3 text-sm font-medium text-gray-900'>
                No Collections
              </h4>
              <p className='mb-3 text-xs text-gray-500'>
                Create a collection to organize your writing.
              </p>
              <div className='mx-auto'>
                <button className='bg-white text-gray-700 focus:outline-none ring-1 ring-black/5 shadow-small hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white focus-visible:button-focus-outline  auto shrink-0 h-8 rounded-lg px-2 text-sm min-w-[60px] relative flex flex-row items-center justify-center space-x-1 font-medium transition disabled:cursor-not-allowed'>
                  <span className='relative whitespace-nowrap'>
                    Create Collection
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex w-full flex-col space-y-0.5'>
            {collects?.map((collection) => (
              <CollectionLink collection={collection} />
            ))}
          </div>
        );
    }
  }
}
