import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { NewCollection } from '../components/modals/collection_modals';
import { Button } from '../components/ui/button';
import { CollectionDropdown, DropdownWithDialogItemsSolution2 } from '../components/buttons/collection_popover';
import { rspc } from '../utils/rspc';
import { CollectionPinned } from '../components/links/collection_links';

export const route = new FileRoute('/collections').createRoute({
  component: () => {
    const {isLoading, data: collections} = rspc.useQuery(['collections.getAllWithPinned']);
    if (isLoading) {
      return <div>Error</div>
    }
    
    const collects = collections?.map((c) => {
        const {pinnedBy, ...collection} = c;
        return {...collection, isPinned: pinnedBy.length > 0 ? true : false} as CollectionPinned;
    });


    return (
      <>
        <div className='w-full bg-base-200'>
          <div className='w-full max-w-7xl p-4 mx-auto'>
            <h1> Test Collections</h1>
            <NewCollection>
              <Button variant='outline'>New Collection</Button>
            </NewCollection>
            {/* <DropdownWithDialogItemsSolution2 collection={collects[0]}/> */}
          </div>
        </div>
      </>
    );
  },
});
