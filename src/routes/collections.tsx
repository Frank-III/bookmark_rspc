
import * as React from 'react'
import { FileRoute } from '@tanstack/react-router'
import { NewCollection } from '../components/modals/collection_modals';
import { Button } from '../components/ui/button';

export const route = new FileRoute('collections').createRoute({
  component: () => {
    return (
      <>
        <div className='w-full bg-base-200'>
          <div className='w-full max-w-7xl p-4 mx-auto'>
            <h1> Test Collections</h1>
            <NewCollection>
              <Button variant='outline'>New Collection</Button>
            </NewCollection>
          </div>
        </div>
      </>
    );
  },
})
