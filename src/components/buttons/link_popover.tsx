import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '../ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '../ui/dialog';
import { DialogHeader } from '../ui/dialog';
import React from 'react';
import { LinkWithTags } from '../../../bindings';
import { EditLinkForm } from '../forms/edit_link_forms';

interface LinkPopoverProps {
  link: LinkWithTags;
  children: React.ReactNode;
}

export function LinkDropdown({ link, children }: LinkPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  return (
    <Dialog open={showEdit} onOpenChange={setShowEdit}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className='w-[220px]'>
          <DropdownMenuItem>
            <DialogTrigger
              asChild
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <button
                onClick={(e) => {
                  setOpen(false);
                  setShowEdit(true);
                  e.preventDefault();
                }}
              >
                Edit Link
              </button>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem>Archive Link</DropdownMenuItem>
          <DropdownMenuItem
            className='data-[highlighted]:bg-red-500 data-[highlighted]:opacity-80 data-[highlighted]:text-black'
            key='delete'
          >
            Delete Link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className='text-xs text-gray-700 font-light'>
            Deleting a collection does not remove any of its content.
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className='sm:max-w-[350px]'>
        <DialogHeader>
          <DialogTitle className='text-gray-800 font-md'>
            Edit Collection
          </DialogTitle>
        </DialogHeader>
        <div className='h-[0.8px] w-full rounded-full bg-gray-200' />
        <EditLinkForm link={link} />
      </DialogContent>
    </Dialog>
  );
}
