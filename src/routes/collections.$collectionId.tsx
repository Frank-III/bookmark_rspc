import * as React from 'react';
import { FileRoute, useRouteContext} from '@tanstack/react-router';
import {
  CollectionDropdown,
} from '../components/buttons/collection_popover';
import { client, rspc } from '../utils/rspc';
import { CollectionPinned } from '../components/links/collection_lists';
import { parse } from 'path';
import { EditCllectionForm } from '../components/forms/edit_collection_forms';
import { CollectionWithPinnedStatus } from '../../bindings'
import { MakeCollectionWithPinnedStatus } from '../utils';

async function loadCollectionById(collectionId: number): Promise<CollectionWithPinnedStatus> {
  return await client.query(["collections.getOnePinnedStatus", collectionId]).then((rsp) => rsp as CollectionWithPinnedStatus);
}

// FIXME: Some hacky way to get around
export const route = new FileRoute('/collections/$collectionId').createRoute({
  beforeLoad: ({params: {collectionId}}) => {
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
    const {status, data: thisCollection} = rspc.useQuery(queryOptions);
    if (status !=='success') {
      return <div>Error</div>;
    }
    const  collection = MakeCollectionWithPinnedStatus(thisCollection);


    return (
      <>
        <div className='w-full bg-base-200'>
          <div className='w-full max-w-7xl p-4 mx-auto'>
            <h1>Collections</h1>
            <EditCllectionForm collection={collection} />
          </div>
        </div>
      </>
    );
  },
});
