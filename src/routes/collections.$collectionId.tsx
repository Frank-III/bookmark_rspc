import * as React from 'react';
import { FileRoute, useRouteContext } from '@tanstack/react-router';
import { CollectionDropdown } from '../components/buttons/collection_popover';
import { client, rspc } from '../utils/rspc';
import { CollectionPinned } from '../components/links/collection_lists';
import { parse } from 'path';
import { EditCllectionForm } from '../components/forms/edit_collection_forms';
import { CollectionWithPinnedStatus } from '../../bindings';
import { MakeCollectionWithPinnedStatus } from '../utils';
import { Button } from '../components/ui/button';
import { LinkCard } from '../components/buttons/link_card';

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
    const queryOptions = {
      queryKey: ['collections.getOnePinnedStatus', parseInt(collectionId)],
      queryFn: () => loadCollectionById(parseInt(collectionId)),
      enabled: !!collectionId,
    } as const;
    return { queryOptions };
  },
  loader: async ({
    context: { queryClient },
    routeContext: { queryOptions },
  }) => {
    await queryClient.ensureQueryData(queryOptions);
  },
  component: ({ useRouteContext }) => {
    const { queryOptions } = useRouteContext();
    const { status, data: thisCollection } = rspc.useQuery(queryOptions);
    if (status !== 'success') {
      return <div>Error</div>;
    }



    const collection = MakeCollectionWithPinnedStatus(
      thisCollection as CollectionWithPinnedStatus,
    );
    const {data: links} = rspc.useQuery(['links.getByCollection', thisCollection?.id]);

    return (
      <>
        <div className='w-full bg-base-200'>
          <div className='w-full max-w-7xl p-4 mx-auto'>
            <h1>Collections</h1>
            <CollectionDropdown collection={collection}>
              <Button>Edit Collection</Button>
            </CollectionDropdown>
            <div className='grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>
            {links && links.map((link) => <LinkCard link={link}/>)}
            </div>
          </div>
        </div>
      </>
    );
  },
});
