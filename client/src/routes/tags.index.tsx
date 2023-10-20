import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { rspc } from '../utils/rspc';
import ContentLoader from 'react-content-loader';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';
import { Tag } from '../../bindings';
import { create } from 'zustand';
import { cn } from '../utils';
import { CardsSkeleton } from '../components/links/card_loader';
import { LinkCard } from '../components/buttons/link_card';
// import { useUrlStore } from '../store';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Mode, FilterByTagsArgs } from '../../bindings';
import { Input } from '../components/ui/input';
import { StyledButton } from '../components/buttons/styled_button';
import { TagBadge } from '../components/buttons/tag_badge';
import { FullLinkCard } from '../components/buttons/full_link_card';

type selectedTags = {
  tags: Array<Exclude<Tag, 'ownerId'>>;
  mode: Mode;
  page: number;
  setmode: (mode: Mode) => void;
  setpage: (page: number) => void;
  setselect: (tags: Array<Exclude<Tag, 'ownerId'>>) => void;
  addSelect: (tag: Exclude<Tag, 'ownerId'>) => void;
  removeSelect: (tag: Exclude<Tag, 'ownerId'>) => void;
};

const useSelectedTagsStore = create<selectedTags>((set) => ({
  tags: [],
  mode: 'And',
  page: 1,
  setpage: (page) => set(() => ({ page })),
  setmode: (mode) => set(() => ({ mode })),
  setselect: (tags) => set(() => ({ tags })),
  addSelect: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeSelect: (tag) =>
    set((state) => ({ tags: state.tags.filter((t) => t.id !== tag.id) })),
}));


function TagMode() {
  return (
    <Select
      onValueChange={(v: Mode) => {
        useSelectedTagsStore.getState().setmode(v);
      }}
      defaultValue='And'
    >
      <SelectTrigger className='w-[85px]'>
        <SelectValue placeholder='Select Mode' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='And'>Every</SelectItem>
        <SelectItem value='Or'>Some</SelectItem>
      </SelectContent>
    </Select>
  );
}

export const route = new FileRoute('/tags/').createRoute({
  component: () => {
    const { status, data: allTags } = rspc.useQuery(['tags.getByUser']);
    // useUrlStore.getState().setUrl(['/', 'tags']);
    const useSelectedTagsId = useSelectedTagsStore((state) =>
      state.tags.map((t) => t.id),
    );

    const [totalPage, setTotalPage] = React.useState<undefined | number>(
      undefined,
    );

    const FilterTagProps: FilterByTagsArgs = {
      mode: useSelectedTagsStore((state) => state.mode),
      tags: useSelectedTagsId,
      skip: (useSelectedTagsStore.getState().page - 1) * 20,
      take: 20,
    };

    const {
      isLoading: linkLoading,
      isPreviousData,
      status: link_status,
      data: filteredLinks,
      isFetching: linkFetching,
      refetch,
    } = rspc.useQuery(['links.filterByTags', FilterTagProps], {
      // enabled: false,
      keepPreviousData: true,
      onSuccess: (data) => {
        if (data?.total_links !== undefined && data?.total_links !== null) {
          setTotalPage(Math.ceil(data?.total_links / 20));
        }
      },
    });

    // if (filteredLinks?.total_links !== undefined && filteredLinks?.total_links !== null) {
    //   setTotalPage(Math.ceil(filteredLinks?.total_links / 20));
    // }

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
      <div className='w-full flex flex-col mx-auto justify-center'>
        <h1 className='text-3xl font-semibold mb-3'>🏷️ Tags</h1>
        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center'>
          <TagMode />
          <div
            className={cn(
              'flex min-h-[2.5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              'flex-wrap space-x-2 items-center text-gray-300 font-semibold',
            )}
          >
            {useSelectedTagsStore.getState().tags.length === 0 && "Select Tag By Clicking on it"}
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
          <Input placeholder='Search by link name...'>
          </Input>
          <button
            className='rounded-full border-1 bg-gray-100 w-full md:w-auto text-gray-400 text-sm font-light'
            onClick={() => {
              useSelectedTagsStore.getState().setselect([]);
              useSelectedTagsStore.setState({ page: 1 });
            }}
          >
            clear
          </button>
          <StyledButton
            className='w-full md:w-auto '
            onClick={() => {
              useSelectedTagsStore.setState({ page: 1 });
              refetch();
            }}
          >
            <Search />
          </StyledButton>
        </div>
        <div className='flex flex-wrap space-x-2 items-center justify-center mt-5'>
          {allTags.map((tag) => (
            <TagBadge
              tag={tag}
              onClick={() => {
                useSelectedTagsId.includes(tag.id)
                  ? useSelectedTagsStore.getState().removeSelect(tag)
                  : useSelectedTagsStore.getState().addSelect(tag);
                useSelectedTagsStore.setState({ page: 1 });
              }}
              style={
                useSelectedTagsId.includes(tag.id) ? { opacity: 0.5 } : {}
              }
            />
          ))}
        </div>

        {link_status !== 'success' && linkFetching && <CardsSkeleton />}
        <div className={cn('mt-5')}>
          <div
            className={cn(
              'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6',
              isPreviousData && !linkLoading
                ? 'opacity-40 blur-sm pointer-events-none '
                : '',
            )}
          >
            {filteredLinks &&
              filteredLinks?.links.length > 0 &&
              filteredLinks.links.map((link) => <FullLinkCard link={link} />)}
          </div>
          {/* {isPreviousData  && <div className='absolute left-1/2 top-1/2'>Please Click Search</div>} */}
        </div>
        <div className='flex items-center justify-end px-2 mt-3'>
          <div className='flex items-center space-x-6 lg:space-x-8'>
            <div className=' flex w-[100px] items-center justify-center text-sm font-medium'>
              {totalPage &&
                `Page ${useSelectedTagsStore.getState().page} of ${totalPage}`}
            </div>
            <div className='flex items-center space-x-2 '>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => {
                  useSelectedTagsStore.setState({ page: 1 });
                  refetch();
                }}
                disabled={useSelectedTagsStore.getState().page == 1}
              >
                <DoubleArrowLeftIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => {
                  useSelectedTagsStore.setState({
                    page: useSelectedTagsStore.getState().page - 1,
                  });
                  refetch();
                }}
                disabled={useSelectedTagsStore.getState().page == 1}
              >
                <ChevronLeftIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => {
                  useSelectedTagsStore.setState({
                    page: useSelectedTagsStore.getState().page + 1,
                  });
                  refetch();
                }}
                disabled={useSelectedTagsStore.getState().page == totalPage}
              >
                <ChevronRightIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => {
                  useSelectedTagsStore.setState({ page: totalPage });
                  refetch();
                }}
                disabled={useSelectedTagsStore.getState().page == totalPage}
              >
                <DoubleArrowRightIcon className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
        {/* <div className='mt-5 grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {!linkFetching &&  link_status !== 'success' ? <div>Please Click Search</div> :
            link_status !== 'success' ? <CardsSkeleton /> :
            filteredLinks && filteredLinks?.length > 0 ? filteredLinks.map((link) => <LinkCard link={link} />) :
            <div>No Links Found</div>
          }
        </div> */}
      </div>
    );
  },
});
