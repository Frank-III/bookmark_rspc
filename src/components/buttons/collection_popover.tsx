import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '../ui/dropdown-menu';

import { CollectionPinned } from '../links/collection_lists';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { DialogHeader } from '../ui/dialog';
import { EditCllectionForm } from '../forms/edit_collection_forms';
import React from 'react';
import { queryClient, rspc } from '../../utils/rspc';

interface CollectionPopoverProps {
  collection: CollectionPinned;
  children: React.ReactNode;
}

export function CollectionDropdown({
  collection,
  children,
}: CollectionPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const { mutate: delCollection } = rspc.useMutation(
    ['collections.deleteOne'],
    {
      meta: {
        message: 'Collection deleted!',
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['collections.getbyUser'], (oldData: any) => {
          return oldData.filter((collection: any) => collection.id !== data.id);
        });
      },
    },
  );

  const { mutate: cancelPinned } = rspc.useMutation(['collections.editOne'], {
    meta: {
      message: 'Edit Pinned Status!',
    },
    onSuccess: () => {},
  });

  return (
    <Dialog open={showEdit} onOpenChange={setShowEdit}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className='w-[220px]'>
          <DropdownMenuItem key='edit'>
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
                Edit Collection
              </button>
            </DialogTrigger>
          </DropdownMenuItem>
          {collection.isPinned ? (
            <DropdownMenuItem key='remove'>
              <button
                onClick={() => {
                  cancelPinned({
                    id: collection.id,
                    name: collection.name,
                    color: collection.color,
                    pinned: false,
                    public: collection.isPublic,
                  });
                }}
              >
                Remove Pinned
              </button>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key='remove'>
              <button
                onClick={() => {
                  cancelPinned({
                    id: collection.id,
                    name: collection.name,
                    color: collection.color,
                    pinned: true,
                    public: collection.isPublic,
                  });
                }}
              >
                Set Pinned
              </button>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className='data-[highlighted]:bg-red-500 data-[highlighted]:opacity-80 data-[highlighted]:text-black'
            key='delete'
          >
            <button
              onClick={() => {
                delCollection(collection.id);
              }}
            >
              Delete Collection
            </button>
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
        <EditCllectionForm collection={collection} />
      </DialogContent>
    </Dialog>
  );
}

// export const DialogItem = React.forwardRef((props, forwardedRef) => {
//   const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } = props;
//   return (
//     <Dialog onOpenChange={onOpenChange}>
//       <DialogTrigger asChild>
//         <DropdownMenuItem
//           {...itemProps}
//           ref={forwardedRef}
//           className="DropdownMenuItem"
//           onSelect={(event) => {
//             event.preventDefault();
//             onSelect && onSelect();
//           }}
//         >
//           {triggerChildren}
//         </DropdownMenuItem>
//       </DialogTrigger>
//         <DialogContent className="DialogContent">
//           {children}
//         </DialogContent>
//     </Dialog>
//   );
// });

// export function DropdownWithDialogItemsSolution2({collection}: CollectionPopoverProps) {
//   const [dropdownOpen, setDropdownOpen] = React.useState(false);
//   const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
//   const dropdownTriggerRef = React.useRef(null);
//   const focusRef = React.useRef(null);

//   function handleDialogItemSelect() {
//     focusRef.current = dropdownTriggerRef.current;
//   }

//   function handleDialogItemOpenChange(open: boolean) {
//     setHasOpenDialog(open);
//     if (open === false) {
//       setDropdownOpen(false);
//     }
//   }

//   return (
//     <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
//       <DropdownMenuTrigger asChild>
//         <button className='flex -translate-x-1 items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100 sm:opacity-0' aria-expanded={open}>
//           <MoreVertical size={15} />
//         </button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         className="DropdownMenuContent w-[220px]"
//         sideOffset={5}
//         hidden={hasOpenDialog}
//         onCloseAutoFocus={(event) => {
//           if (focusRef.current) {
//             focusRef.current.focus();
//             focusRef.current = null;
//             event.preventDefault();
//           }
//         }}
//       >
//         <DropdownMenuItem>
//           <DialogItem
//             triggerChildren={<button>Edit Collection</button>}
//             onSelect={handleDialogItemSelect}
//             onOpenChange={handleDialogItemOpenChange}
//           >
//           <DialogHeader>
//             <DialogTitle className='text-gray-800 font-md'>Edit Collection</DialogTitle>
//           </DialogHeader>
//           <div className='h-[0.8px] w-full rounded-full bg-gray-200' />
//           <EditCllectionForm collection={collection} />
//           </DialogItem>
//         </DropdownMenuItem>

//         <DropdownMenuItem>
//           <DialogItem
//             triggerChildren={<button>Edit Collection</button>}
//             onSelect={handleDialogItemSelect}
//             onOpenChange={handleDialogItemOpenChange}
//           >
//           <DialogHeader>
//             <DialogTitle className='text-gray-800 font-md'>Edit Collection</DialogTitle>
//           </DialogHeader>
//           <div className='h-[0.8px] w-full rounded-full bg-gray-200' />
//           <EditCllectionForm collection={collection} />
//           </DialogItem>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator className="DropdownMenuSeparator" />
//         <DropdownMenuLabel className='text-xs text-gray-700 font-light'>
//           Deleting a collection does not remove any of its content.
//         </DropdownMenuLabel>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
