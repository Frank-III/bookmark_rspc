import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { NewCollection } from '../components/modals/collection_modals';
import { Button } from '../components/ui/button';
import { CollectionDropdown } from '../components/buttons/collection_popover';
import { client, rspc } from '../utils/rspc';
import { CollectionPinned } from '../components/links/collection_lists';
import { EditCllectionForm } from '../components/forms/edit_collection_forms';
import { CardsSkeleton } from '../components/links/card_loader';
import { Collection, CollectionWithPinnedStatus } from '../../bindings';
import { cn } from '../utils';
import { CollectionCard } from '../components/buttons/collection_card';
import ContentLoader from 'react-content-loader';

// async function loadCollectionById(
//   collectionId: number,
// ): Promise<Collection[]> {
//   return await client.query(['collections.getByUser'])
// }

export const route = new FileRoute('/collections/').createRoute({
  beforeLoad: () => {
    return {
      queryOptions: {
        queryKey: ['collections.getByUser'],
        queryFn: () => {
          return client.query(['collections.getByUser']);
        },
      },
    };
  },
  loader: async ({ context: { queryClient, queryOptions } }) => {
    await queryClient.ensureQueryData(queryOptions);
  },
  component: ({ useRouteContext }) => {
    const { queryOptions } = useRouteContext();
    const {
      isPreviousData,
      isLoading,
      status,
      data: allCollections,
      isFetching,
    } = rspc.useQuery(queryOptions, {
      keepPreviousData: true,
    });
    if (isLoading) {
      return (
        <ContentLoader
          speed={2}
          width={400}
          height={150}
          viewBox='0 0 400 150'
          backgroundColor='#f3f3f3'
          foregroundColor='#ecebeb'
          // {...props}
        >
          <circle cx='10' cy='20' r='8' />
          <rect x='25' y='15' rx='5' ry='5' width='220' height='10' />
          <circle cx='10' cy='50' r='8' />
          <rect x='25' y='45' rx='5' ry='5' width='220' height='10' />
          <circle cx='10' cy='80' r='8' />
          <rect x='25' y='75' rx='5' ry='5' width='220' height='10' />
          <circle cx='10' cy='110' r='8' />
          <rect x='25' y='105' rx='5' ry='5' width='220' height='10' />
        </ContentLoader>
      );
    }
    const collects = allCollections?.map((c: CollectionWithPinnedStatus) => {
      const { pinnedBy, ...collection } = c;
      return {
        ...collection,
        isPinned: pinnedBy.length > 0 ? true : false,
      } as CollectionPinned;
    });
    // const {mutate} = rspc.useMutation('links.create')

    // const newLinks: CreateLinkArgs[] = Array(20).fill(0).map((_, i) => i).map((i) => {
    //   return {
    //     link_name: `test${i}`,
    //     url: `https://test${i}.com`,
    //     collection_id: Math.floor(Math.random() * 5),
    //     tags: [Math.floor(Math.random() * 10)],
    //     description: null
    //   };
    // })
    return (
      <div className='w-full flex flex-col mx-auto justify-center p-y-5'>
        <h1 className='text-3xl font-semibold mb-3'>Collections</h1>
        {status !== 'success' && isFetching && <CardsSkeleton />}
        <div
          className={cn(
            'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6',
            isPreviousData && !isLoading
              ? 'opacity-40 blur-sm pointer-events-none '
              : '',
          )}
        >
          {collects.map((c) => (
            <CollectionCard collection={c} />
          ))}
        </div>
        {/* <Button onClick={() => {newLinks.length ? mutate(newLinks?.pop()!) : ''}}>Create Links</Button> */}
        {/* <DropdownWithDialogItemsSolution2 collection={collects[0]}/> */}
      </div>
    );
  },
});
