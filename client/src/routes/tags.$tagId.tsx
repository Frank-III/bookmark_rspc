import * as React from 'react';
import { FileRoute, Outlet, useRouteContext } from '@tanstack/react-router';
import { CollectionDropdown } from '../components/buttons/collection_popover';
import { client, rspc } from '../utils/rspc';
import { CollectionPinned } from '../components/links/collection_lists';
import { parse } from 'path';
import { EditCllectionForm } from '../components/forms/edit_collection_forms';
import { CollectionWithPinnedStatus, FilterResult, SearchMode } from '../../bindings';
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
import { FullLinkCard } from '../components/buttons/full_link_card';

async function loadCollectionById(
  tagId: number,
): Promise<FilterResult> {
  return await client
    .query(['links.filterByTags', {mode: "And", tags: [tagId], take: 20, skip: 0}])
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
      }
    };
  },
  loader: async ({ context: { queryClient, queryOptions } }) => {
    await queryClient.ensureQueryData(queryOptions);
  },
  component: ({ useRouteContext }) => {


    const { queryOptions } = useRouteContext();
    const { status, data: thisTags} = rspc.useQuery(queryOptions);

    // const {totalLink, links} = thisTags ?? {totalLink: 0, links: []};

    return (
      <div className='grid grid-cols-4'>
      { thisTags && <FullLinkCard link={thisTags?.links[0]} /> } 
      </div>
      )
    
  },
});
