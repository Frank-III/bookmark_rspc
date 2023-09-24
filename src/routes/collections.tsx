import * as React from 'react';
import { FileRoute, Outlet } from '@tanstack/react-router';
import { NewCollection } from '../components/modals/collection_modals';
import { Button } from '../components/ui/button';
import {
  CollectionDropdown,
} from '../components/buttons/collection_popover';
import { rspc } from '../utils/rspc';
import { CollectionPinned } from '../components/links/collection_lists';

export const route = new FileRoute('/collections').createRoute({
  component: () => {
    return (
      <>
        <Outlet />
      </>
    )
  },
});
