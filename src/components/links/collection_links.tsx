import { Link } from '@tanstack/react-router';
import { Collection } from '../../../bindings';
import { CollectionPopover } from '../buttons/collection_popover';
import { Dot, Pin } from 'lucide-react';

export interface CollectionLinksProps {
  collections: Collection[];
  pinned: boolean;
}

export function PinndCollections({
  collections,
  pinned,
}: CollectionLinksProps) {
  // const collections = [{collection:{id:"1", name:"test", color:"red"}}]
  return (
    <>
      {collections.length == 0 ? (
        <div className='flex items-center justify-center mt-5'>
          <span className='text-gray-700 text-sm '>
            You have no {`${pinned ? '' : 'Pinned'}`} Collections
          </span>
        </div>
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
                  {pinned ? (
                    <Pin color={color} size={'auto'} />
                  ) : (
                    <Dot color={color} size={'auto'} />
                  )}
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
