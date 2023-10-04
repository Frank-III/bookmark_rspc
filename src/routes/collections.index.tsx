import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { NewCollection } from '../components/modals/collection_modals';
import { Button } from '../components/ui/button';
import { CollectionDropdown } from '../components/buttons/collection_popover';
import { rspc } from '../utils/rspc';
import { CollectionPinned } from '../components/links/collection_lists';
import { EditCllectionForm } from '../components/forms/edit_collection_forms';
import { CardsSkeleton } from '../components/links/card_loader';
import {CreateLinkArgs} from '../../bindings'

export const route = new FileRoute('/collections/').createRoute({
  component: () => {
    // const { isLoading, data: collections } = rspc.useQuery([
    //   'collections.getAllWithPinned',
    // ]);
    // if (isLoading) {
    //   return <CardsSkeleton />;
    // }

    // const collects = collections?.map((c) => {
    //   const { pinnedBy, ...collection } = c;
    //   return {
    //     ...collection,
    //     isPinned: pinnedBy.length > 0 ? true : false,
    //   } as CollectionPinned;
    // });

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
      <>
        <div className='w-full bg-base-200'>
          <div className='w-full max-w-7xl p-4 mx-auto'>
            <h1> Test Collections</h1>
            <NewCollection>
              <Button variant='outline'>New Collection</Button>
            </NewCollection>
            {/* <Button onClick={() => {newLinks.length ? mutate(newLinks?.pop()!) : ''}}>Create Links</Button> */}
            {/* <DropdownWithDialogItemsSolution2 collection={collects[0]}/> */}
          </div>
        </div>
      </>
    );
  },
});
