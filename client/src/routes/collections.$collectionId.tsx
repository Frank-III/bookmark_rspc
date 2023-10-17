import * as React from 'react';
import { FileRoute, useRouteContext } from '@tanstack/react-router';
import { CollectionDropdown } from '../components/buttons/collection_popover';
import { client, rspc } from '../utils/rspc';
import { CollectionPinned } from '../components/links/collection_lists';
import { parse } from 'path';
import { EditCllectionForm } from '../components/forms/edit_collection_forms';
import { CollectionWithPinnedStatus, SearchMode } from '../../bindings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { MakeCollectionWithPinnedStatus, cn } from '../utils';
import { Button } from '../components/ui/button';
import { LinkCard } from '../components/buttons/link_card';
import { CardsSkeleton } from '../components/links/card_loader';
import { useDebounce } from 'usehooks-ts';
import { set } from 'date-fns';
import { Input } from '../components/ui/input';
import { ChevronLeftIcon, ChevronRightIcon, Search } from 'lucide-react';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { useUrlStore } from '../store';

async function loadCollectionById(
  collectionId: number,
): Promise<CollectionWithPinnedStatus> {
  return await client
    .query(['collections.getOnePinnedStatus', collectionId])
    .then((rsp) => rsp as CollectionWithPinnedStatus);
}

// FIXME: Some hacky way to get around
export const route = new FileRoute('/collections/$collectionId').createRoute({
  beforeLoad: ({ params: { collectionId } }) => {
    return { 
      queryOptions: {
        queryKey: ['collections.getOnePinnedStatus', parseInt(collectionId)],
        queryFn: () => loadCollectionById(parseInt(collectionId)),
        enabled: !!collectionId,
      }
    };
  },
  loader: async ({ context: { queryClient, queryOptions } }) => {
    await queryClient.ensureQueryData(queryOptions);
  },
  component: ({ useRouteContext }) => {

    const { queryOptions } = useRouteContext();
    const { status, data: thisCollection } = rspc.useQuery(queryOptions);

    // useUrlStore.getState().setUrl(['/', 'collections', thisCollection?.name ?? '...']);
    if (status !== 'success') {
      return <div>Error</div>;
    }
    const [input, setInput] = React.useState<string>('');
    const debouncedValue = useDebounce<string>(input, 500);
    const [page, setpage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<undefined | number>(
      undefined,
    );
    const [mode, setMode] = React.useState<SearchMode>('Name');

    const collection = MakeCollectionWithPinnedStatus(
      thisCollection as CollectionWithPinnedStatus,
    );
    const {
      status: link_status,
      data: searchedLinks,
      isLoading: linkLoading,
      isPreviousData,
      refetch,
    } = rspc.useQuery(
      [
        'links.searchByWord',
        {
          collection_id: collection.id,
          word: debouncedValue,
          mode: mode,
          skip: (page - 1) * 20,
          take: 20,
        },
      ],
      {
        keepPreviousData: true,
        onSuccess: (data) => {
          if (data?.total_links !== undefined && data?.total_links !== null) {
            setTotalPage(Math.ceil(data?.total_links / 20));
          }
        },
      },
    );

    return (
      <>
        {/* <CollectionDropdown collection={collection}>
          <Button>Edit Collection</Button>
        </CollectionDropdown> */}
        <div className='w-full flex flex-col justify-center'>
          <h1 className='text-3xl font-semibold mb-3'>
            Welcome to Collections:{collection.name}
          </h1>
          <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center'>
            <Select
              onValueChange={(v: SearchMode) => {
                setMode(v);
              }}
              defaultValue='Name'
            >
              <SelectTrigger className='w-[100px]'>
                <SelectValue placeholder='Select Mode' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Name'>Name</SelectItem>
                <SelectItem value='Description'>Description</SelectItem>
                <SelectItem value='Url'>Url</SelectItem>
              </SelectContent>
            </Select>
            <Input
              className='flex-wrap space-x-2 items-center'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className='rounded-full border-1 bg-gray-100 w-full md:w-auto text-gray-400 text-sm font-light'
              onClick={() => {
                setInput('');
                setpage(1);
              }}
            >
              clear
            </button>
            <Button
              className='border-2 bg-gray-900 w-full md:w-auto'
              onClick={() => {
                setpage(1);
                refetch();
              }}
            >
              <Search />
            </Button>
          </div>
          {link_status !== 'success' && <CardsSkeleton />}
          <div className='mt-5'>
            <div
              className={cn(
                'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6',
                isPreviousData && !linkLoading
                  ? 'opacity-40 blur-sm pointer-events-none '
                  : '',
              )}
            >
              {searchedLinks &&
                searchedLinks?.links.length > 0 &&
                searchedLinks.links.map((link) => <LinkCard link={link} />)}
            </div>
          </div>
          <div className='flex items-center justify-end px-2 mt-3'>
            <div className='flex items-center space-x-6 lg:space-x-8'>
              <div className=' flex w-[100px] items-center justify-center text-sm font-medium'>
                {totalPage && `Page ${page} of ${totalPage}`}
              </div>
              <div className='flex items-center space-x-2 '>
                <Button
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => {
                    setpage(1);
                    refetch();
                  }}
                  disabled={page == 1}
                >
                  <DoubleArrowLeftIcon className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => {
                    setpage(page - 1);
                    refetch();
                  }}
                  disabled={page == 1}
                >
                  <ChevronLeftIcon className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => {
                    setpage(page + 1);
                    refetch();
                  }}
                  disabled={page == totalPage}
                >
                  <ChevronRightIcon className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => {
                    setpage(totalPage!);
                    refetch();
                  }}
                  disabled={page == totalPage}
                >
                  <DoubleArrowRightIcon className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
});
