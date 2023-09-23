import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { EditCollection } from '../modals/collection_modals';
import { CollectionPinned } from '../links/collection_links';

function removePinned() {}
interface CollectionPopoverProps {
  collection: CollectionPinned;
}
export function CollectionPopover({collection}: CollectionPopoverProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className='flex -translate-x-1 items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100 sm:opacity-0'>
          <MoreVertical size={12} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[220px]'>
        <DropdownMenuItem key='edit'>
          <EditCollection collection={collection} >
            <button>
              Edit Collection
            </button>
          </EditCollection>
        </DropdownMenuItem>
        <DropdownMenuItem key='remove-pin'>Remove Pinned</DropdownMenuItem>
        <DropdownMenuItem
          className='data-[highlighted]:bg-red-500 data-[highlighted]:opacity-80 data-[highlighted]:text-black'
          key='delete'
        >
          Delete Collection
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='text-xs text-gray-700 font-light'>
          Deleting a collection does not remove any of its content.
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
