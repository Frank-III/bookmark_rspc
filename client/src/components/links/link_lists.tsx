import { Link } from '@tanstack/react-router';
import { LinkWithTags } from '../../../bindings';
import { CollectionDropdown } from '../buttons/collection_popover';
import { Dot, GalleryVerticalEnd, MoreVertical, Pin } from 'lucide-react';
import { rspc } from '../../utils/rspc';
import { useUser } from '@clerk/clerk-react';
import React from 'react';
import { cn } from '../../utils';
import ContentLoader from 'react-content-loader';
import { LinkDropdown } from '../buttons/link_popover';

//FIXME: a really bad hack
export function LinkLink({ link }: { link: LinkWithTags }) {
  const { id, name, url, collectionId, tags } = link;
  return (
    <div
      className='group flex w-full flex-row items-center justify-between rounded-lg border-[0.5] ring-1 ring-black/5 shadow-small px-2 py-1 transition font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      key={`collection${id}`}
    >
      <div className='flex flex-row items-center justify-start truncate'>
        <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
          <div className='flex h-full w-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' />
          {/* <Dot color={color} size={30} /> */}
          {/* <Dot color={color} size={30} /> */}
        </div>
        <a href={url} target='_black' rel='noreferrer'>
          <p className='truncate text-sm'>{name}</p>
        </a>
      </div>
      {/* <CollectionPopover collection={collection} /> */}
      <LinkDropdown link={link}>
        <button className='flex -translate-x-1 items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700'>
          <MoreVertical size={15} />
        </button>
      </LinkDropdown>
    </div>
  );
}

export function LinkLinks({ links }: { links: LinkWithTags[] }) {
  return links.length == 0 ? (
    <div className='h-full flex pt-3 justify-center text-gray-500 font-semibold'>
      <h1>No link created this day</h1>
    </div>
  ) : (
    <div className='flex w-full flex-col space-y-2 pt-5'>
      {links?.map((link) => <LinkLink link={link} />)}
    </div>
  );
}
