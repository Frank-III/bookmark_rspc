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

export function CollectionCard({
  collection,
}: {
  collection: CollectionPinned;
}) {
  const { id, name, description, color, isPinned } = collection;

  return (
    <Card
      className='w-full rounded-lg m-h-[200px] pb-0'
      style={{ backgroundColor: `${color}10` }}
      key={id}
    >
      <CardHeader className='p-3 text-gray-700 font-medium'>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='p-2'>
        <div className='h-[1px] w-full rounded-full bg-gray-100' />
      </CardContent>
      <div className='h-[1px] w-full rounded-full bg-gray-100' />
      <div className='mt-2 flex w-full items-center justify-end space-x-1'>
        <CollectionDropdown collection={collection}>
          <button className='border rounded-full h-6 w-6 '>
            <Menu size={20} />
          </button>
        </CollectionDropdown>
        <Link
          to={`/collections/$collectionId`}
          params={{ collectionId: id.toString() }}
          className='border rounded-full h-6 w-6 ' // Position the button at the bottom-right
        >
          <button>
            <ArrowRight color={'black'} size={20} />
          </button>
        </Link>
      </div>
    </Card>
  );
}

//wrap
