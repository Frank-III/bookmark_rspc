import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

import { CollectionWithPinnedStatus } from '../../../bindings';
import { CollectionPinned } from '../links/collection_lists';
import { ArrowRight, Menu } from 'lucide-react';
import { LinkDropdown } from './link_popover';
import { CollectionDropdown } from './collection_popover';
import { Link } from '@tanstack/react-router';
import { StyledButton } from './styled_button';

export function CollectionCard({
  collection,
}: {
  collection: CollectionPinned;
}) {
  const { id, name, description, color, isPinned } = collection;

  return (
    <Card
      className='group w-full rounded-lg border-2 border-gray-100 m-h-[200px] pb-0 hover:border-indigo-400 group'
      key={id}
      // style={{ borderColor: `${color}50` }}
    >
      <CardHeader className='p-3 text-gray-700 font-medium'>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description || 'None'}</CardDescription>
      </CardHeader>
      <CardContent className='p-2'>
        {/* <div className='h-[1px] w-full rounded-full bg-gray-100' /> */}
      </CardContent>
      {/* <div className='h-[1px] w-full rounded-full bg-gray-100' /> */}
      <div className='group mt-2 flex w-full items-center justify-end space-x-1 '>
        <CollectionDropdown collection={collection}>
          <button className='bg-white text-gray-700  ring-1 ring-black/5 shadow-small hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white auto shrink-0 rounded-lg text-sm  relative flex flex-row items-center justify-center space-x-1 font-medium transition disabled:cursor-not-allowed h-6 px-0 w-6 '>
            <Menu size={20} />
          </button>
        </CollectionDropdown>
        <Link
          to={`/collections/$collectionId`}
          params={{ collectionId: id.toString() }}
          className='rounded-full h-6 w-6 ' // Position the button at the bottom-right
          style={{ borderColor: `${color}50` }}
        >
          <StyledButton className='h-6 px-0 w-6'>
            <ArrowRight color={'black'} size={20} />
          </StyledButton>
        </Link>
      </div>
    </Card>
  );
}

//wrap
