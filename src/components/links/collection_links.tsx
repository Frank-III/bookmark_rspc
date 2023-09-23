import { Link } from '@tanstack/react-router';
import { Collection, PinnedCollections, CollectionWithPinnedStatus } from '../../../bindings';
import { CollectionPopover } from '../buttons/collection_popover';
import { Dot, GalleryVerticalEnd, Loader2, MoreVertical, Pin, SquareDot } from 'lucide-react';
import { rspc } from '../../utils/rspc';
import { useUser } from '@clerk/clerk-react';


export type CollectionPinned = Omit<CollectionWithPinnedStatus, 'pinnedBy'> & {isPinned: boolean}

interface CollectionLinkProps {
  collection: CollectionPinned;
}

export function CollectionLink({ collection }: CollectionLinkProps) {
  const {id, color, name} = collection;
  return (
    <Link
      to={`/collections/${id}`}
      key={`to-collection${id}`}
      className='group flex w-full flex-row items-center justify-between rounded-lg border-2 border-transparent px-2 py-1 transition  font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      activeProps={{ style: { backgroundColor: 'rgb(243 244 246)' } }}
    >
      <div className='flex flex-row items-center justify-start truncate'>
        <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
          <SquareDot color={color} size={30} />
          {/* <Dot color={color} size={30} /> */}
        </div>
        <p className='truncate text-sm'>{name}</p>
      </div>
      <CollectionPopover collection={collection} />
    </Link>
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

  const {
    status,
    data: collections,
    isFetching,
  } = rspc.useQuery(
    pinned ? ['collections.getPinned'] : ['collections.getAllWithPinned'],
    { enabled: !!user },
  );

  // const collections = [{collection:{id:"1", name:"test", color:"red"}}]
  {
    switch (status) {
      case 'loading':
        return isFetching ? (
          <div className='flex w-full flex-col space-y-0.5'>
            <div className='flex w-full flex-row items-center mt-4 justify-center'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            </div>
          </div>
        ) : (
          <div>Error</div>
        );
      case 'error':
        //TODO: better Errors
        return <div>Error</div>;
      case 'success':
        // collections.sort((a, b) => {return a.})
        //TODO: better way?
        const collects = collections?.map((c) => {
          if ('collection' in c) {
            return {...c.collection, isPinned: true} as CollectionPinned;
          } else {
            const {pinnedBy, ...collection} = c;
            return {...collection, isPinned: pinnedBy.length > 0 ? true : false} as CollectionPinned;
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
            <div className='absolute h-full w-full bg-gradient-to-t from-white to-transparent'></div>
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
            {collects?.map((collection) => <CollectionLink collection={collection} />)}
          </div>
        );
    }
  }
}
