import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function removePinned() {
}


export function CollectionPopover() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex -translate-x-1 items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100 sm:opacity-0'>
          <MoreVertical size={12} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[220px]'>
        <DropdownMenuItem>
          Edit Collection
        </DropdownMenuItem>
        <DropdownMenuItem>
          Remove Pinned
        </DropdownMenuItem>
        <DropdownMenuItem className='data-[highlighted]:bg-red-500'>
          Delete Collection
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='text-xs text-gray-700 font-light'>Deleting a collection does not remove any of its content.</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
