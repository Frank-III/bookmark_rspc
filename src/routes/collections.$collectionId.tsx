import * as React from 'react';
import { FileRoute, useRouteContext } from '@tanstack/react-router';
import { NewCollection } from '../components/modals/collection_modals';
import { Button } from '../components/ui/button';
import {
  CollectionDropdown,
} from '../components/buttons/collection_popover';
import { rspc } from '../utils/rspc';
import { CollectionPinned } from '../components/links/collection_lists';
import { parse } from 'path';
import { EditCllectionForm } from '../components/forms/edit_collection_forms';

export const route = new FileRoute('/collections/$collectionId').createRoute({
  beforeLoad: ({params: {collectionId}}) => {
    const queryOptions = {
        queryKey: ['collections.getById', parseInt(collectionId)],
        enabled: !!collectionId,
      };
      return { queryOptions };
  },
  loader: async ({
    context: { queryClient },
    routeContext: { queryOptions },
  }) => {
    await queryClient.ensureQueryData(queryOptions);
  },
  component: () => {
    const { queryOptions } = useRouteContext();
    const collectionQuery = rspc.useQuery(queryOptions);
    console.log(route.fullPath);
    const collection = route.useLoader()
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
