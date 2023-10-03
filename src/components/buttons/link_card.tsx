import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

import { LinkWithTags } from '../../../bindings';
import { Badge } from '../ui/badge';
import { ArrowRight, Menu } from 'lucide-react';
import { LinkDropdown } from './link_popover';

export function LinkCard({ link }: { link: LinkWithTags }) {
  const { id, name, url, description, archived, collectionId, tags } = link;

  return (
    <Card className='w-full rounded-lg m-h-[200px] pb-0' key={id}>
      <CardHeader className='p-3 text-gray-700 font-medium'>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='p-2'>
        <div className='h-[1px] w-full rounded-full bg-gray-100' />
      </CardContent>
      <div
        className='flex flex-row overflow-x-auto px-1 scrollbar-none' // Add 'overflow-x-auto' class for horizontal scroll
        style={{ paddingBottom: '10px' }} // Add some padding for the button
      >
        {link.tags.map((tag) => (
          <Badge
            key={tag.id}
            style={{
              backgroundColor: `${tag.color}30`,
              color: tag.color,
              borderColor: `${tag.color}20`,
              marginRight: '8px', // Add some space between badges
            }}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
      <div className='h-[1px] w-full rounded-full bg-gray-100' />
      <div className='mt-2 flex w-full items-center justify-end space-x-1'>
        <LinkDropdown link={link}>
          <button className='border rounded-full h-6 w-6 '>
            <Menu size={20} />
          </button>
        </LinkDropdown>
        <a
          href={url}
          target='_blank'
          rel='noreferrer'
          className='border rounded-full h-6 w-6 ' // Position the button at the bottom-right
        >
          <button>
            <ArrowRight color={'black'} size={20} />
          </button>
        </a>
      </div>
    </Card>
  );
}

//wrap
