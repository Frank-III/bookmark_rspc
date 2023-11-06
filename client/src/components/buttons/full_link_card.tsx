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
import {
  AlignJustify,
  Archive,
  ArchiveX,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Menu,
  Tags,
  XCircle,
} from 'lucide-react';
import { LinkDropdown } from './link_popover';
import { StyledButton } from './styled_button';
import { cn } from '../../utils';
import { TagBadge } from './tag_badge';

export function FullLinkCard({ link }: { link: LinkWithTags }) {
  const {
    id,
    name,
    url,
    description,
    archived,
    collectionId,
    tags,
    createdAt,
  } = link;

  return (
    <div className='bg-white flex flex-col w-full rounded-lg m-h-[300px] border-0 pb-1 shadow-small ring-1 ring-black/5  hover:border-indigo-400'>
      <div className='items-start space-y-1 py-0.5'>
        <div className='inline-flex items-center'>
          <a
            href={url}
            target='_blank'
            rel='noreferrer'
            className='underline text-gray-800 font-medium ml-2'
          >
            {name}
          </a>
        </div>
        <div className='w-full h-[1px] bg-gray-300' />
        <div className='flex flex-col space-y-1 gap-1 ml-1 text-sm text-gray-500'>
          {/* <div className='flex flex-col items-start'> */}
          <div className='inline-flex space-x-2 items-center gap-2'>
            <Calendar size={16} />
            {createdAt.slice(0, 10)}
          </div>
          <div className='inline-flex space-x-2 items-center'>
            <ArchiveX size={16} />
            {archived}
            <Badge
              variant='outline'
              className={cn(
                'border-0 px-0.5 py-0.5 rounded-full bg-opacity-20 font-normal',
                archived
                  ? 'bg-rose-500 text-rose-500 '
                  : 'bg-emerald-500 text-emerald-500 ',
              )}
            >
              {archived ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
            </Badge>
          </div>
          <div className='flex flex-row space-x-2 items-center'>
            <Tags size={16} />
            <div className='inline-flex overflow-x-auto scrollbar-none space-x-[5px]'>
              {tags.map((tag) => (
                <TagBadge className='py-0.5 mb-1' tag={tag} />
              ))}
            </div>
          </div>
          <div
            className={cn(
              'inline-flex space-x-2 items-center wrap gap-2',
              !description && 'text-gray-400',
            )}
          >
            <AlignJustify size={16} />
            {description}
          </div>
        </div>
      </div>
      <div className='flex flex-row justify-between text-gray-600 mx-1 mt-2'>
        <div className='inline-flex space-x-1'>
          <button className='hover:bg-gray-200 p-1 rounded-md hover:text-gray-600'>
            <ChevronLeft size={16} />
          </button>
        </div>
        <div className='inline-flex space-x-1'>
          <button className='hover:bg-gray-200 p-1 rounded-md hover:text-gray-600'>
            <Copy size={16} />
          </button>
          <button className='hover:bg-gray-200 p-1 rounded-md hover:text-gray-600'>
            <CheckCircle2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

//wrap
