import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { Badge } from '../components/ui/badge';
import { rspc } from '../utils/rspc';
import ContentLoader from 'react-content-loader';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';
import { Tag } from '../../bindings';
import { create } from 'zustand';
import { cn } from '../utils';
import { CardsSkeleton } from '../components/links/card_loader';
import { LinkCard } from '../components/buttons/link_card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {Mode, FilterByTagsArgs} from '../../bindings'

type selectedTags = {
  tags: Array<Exclude<Tag, 'ownerId'>>;
  mode: Mode;
  setmode: (mode: Mode) => void;
  setselect: (tags: Array<Exclude<Tag, 'ownerId'>>) => void;
  addSelect: (tag: Exclude<Tag, 'ownerId'>) => void;
  removeSelect: (tag: Exclude<Tag, 'ownerId'>) => void;
};

const useSelectedTagsStore = create<selectedTags>((set) => ({
  tags: [],
  mode: "And",
  setmode: (mode) => set(() => ({ mode })),
  setselect: (tags) => set(() => ({ tags })),
  addSelect: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeSelect: (tag) =>
    set((state) => ({ tags: state.tags.filter((t) => t.id !== tag.id) })),
}));

export function TagBadge({
  tag,
  onClick,
  className,
  ...props
}: {
  tag: Exclude<Tag, 'ownerId'>;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Badge
      className={cn('mb-2', className)} // Add margin at the bottom for spacing
      style={{
        backgroundColor: `${tag.color}30`,
        color: tag.color,
        borderColor: `${tag.color}20`,
        ...props.styles,
      }}
      onClick={onClick}
    >
      {tag.name}
    </Badge>
  );
}

function TagMode() {
  return (
  <Select onValueChange={(v: Mode) => {useSelectedTagsStore.getState().setmode(v)}} defaultValue='and'>
    <SelectTrigger className="w-[85px]">
      <SelectValue placeholder="Select Mode" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="and">Every</SelectItem>
      <SelectItem value="or">Some</SelectItem>
    </SelectContent>
  </Select>)
}


export const route = new FileRoute('/tags/').createRoute({
  component: () => {
    const { status, data: allTags } = rspc.useQuery(['tags.getByUser']);

    const useSelectedTagsId = useSelectedTagsStore((state) =>
      state.tags.map((t) => t.id),
    );

    const FilterTagProps: FilterByTagsArgs = {
      mode: useSelectedTagsStore((state) => state.mode),
      tags: useSelectedTagsId
    }

    const {status: link_status, data: filteredLinks, refetch} = rspc.useQuery(['links.filterByTags', FilterTagProps], {
      enabled: false
    });

    if (status !== 'success') {
      return (
        <div className='flex justify-center'>
          <ContentLoader
            speed={1}
            width={400}
            height={84}
            viewBox='0 0 340 84'
            backgroundColor='#f6f6ef'
            foregroundColor='#e8e8e3'
          >
            <rect x='9' y='4' rx='0' ry='0' width='320' height='22' />
            <rect x='18' y='14' rx='0' ry='0' width='303' height='6' />
            <rect x='11' y='33' rx='0' ry='0' width='108' height='13' />
            <rect x='129' y='33' rx='0' ry='0' width='60' height='13' />
            <rect x='196' y='33' rx='0' ry='0' width='60' height='13' />
          </ContentLoader>
        </div>
      );
    }

    return (
      <div className='flex flex-col mx-auto justify-center'>
        <h1 className='text-3xl font-semibold mb-3'>Tags</h1>
        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center'>
          <TagMode />
          <div
            className={cn(
              'flex min-h-[2.5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              'flex-wrap space-x-2 items-center',
            )}
            placeholder='Search by tags...'
          >
            {useSelectedTagsStore.getState().tags.map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                onClick={() => {
                  useSelectedTagsStore.getState().removeSelect(tag);
                }}
                className='my-0 mt-1'
              />
            ))}
          </div>
          <button
            className='rounded-full border-1 bg-gray-100 w-full md:w-auto text-gray-400 text-sm font-light'
            onClick={() => {
              useSelectedTagsStore.getState().setselect([]);
            }}
          >
            clear
          </button>
          <Button className='border-2 bg-gray-900 w-full md:w-auto' onClick={() => {refetch()}}>
            <Search />
          </Button>
        </div>
        <div className='flex flex-wrap space-x-2 items-center justify-center mt-5'>
          {allTags.map((tag) => (
            <TagBadge
              tag={tag}
              onClick={() => {
                useSelectedTagsId.includes(tag.id)
                  ? useSelectedTagsStore.getState().removeSelect(tag)
                  : useSelectedTagsStore.getState().addSelect(tag);
              }}
              styles={
                useSelectedTagsId.includes(tag.id) ? { opacity: 0.5 } : {}
              }
            />
          ))}
        </div>
        <div className='mt-5 grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {link_status !== 'success' && <CardsSkeleton />}
          {filteredLinks &&
            filteredLinks?.length > 0 &&
            filteredLinks.map((link) => <LinkCard link={link} />)}
        </div>
      </div>
    );
  },
});
