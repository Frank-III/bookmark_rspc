import * as React from 'react';
import { FileRoute, Outlet } from '@tanstack/react-router';
import { client, rspc } from '../utils/rspc';
import {
  CollectionWithPinnedStatus,
  FilterResult,
  SearchMode,
} from '../../bindings';

async function loadCollectionById(tagId: number): Promise<FilterResult> {
  return await client
    .query([
      'links.filterByTags',
      { mode: 'And', tags: [tagId], take: 20, skip: 0 },
    ])
    .then((rsp) => rsp as FilterResult);
}

// FIXME: Some hacky way to get around
export const route = new FileRoute('/tags/$tagId').createRoute({
  beforeLoad: ({ params: { tagId } }) => {
    return {
      queryOptions: {
        queryKey: ['collections.getOnePinnedStatus', parseInt(tagId)],
        queryFn: () => loadCollectionById(parseInt(tagId)),
        enabled: !!tagId,
      },
    };
  },
  load: async ({ meta: { queryClient, queryOptions } }) => {
    await queryClient.ensureQueryData(queryOptions);
  },
  component: ({ useRouteMeta }) => {
    const { queryOptions } = useRouteMeta();
    const { status, data: thisTags } = rspc.useQuery(queryOptions);

    // const {totalLink, links} = thisTags ?? {totalLink: 0, links: []};

    return (
      <div className='grid grid-cols-4'>
        {/* { thisTags && <FullLinkCard link={thisTags?.links[0]} /> }  */}
      </div>
    );
  },
});
