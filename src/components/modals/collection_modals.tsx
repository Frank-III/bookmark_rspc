import { NewCollectionForm } from '../forms/new_collection_forms';
import { EditCllectionForm } from '../forms/edit_collection_forms';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CollectionPinned } from '../links/collection_lists';

interface NewCollectionProps {
  children: React.ReactNode;
}

export function NewCollection({ children }: NewCollectionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[350px] '>
        <DialogHeader>
          <DialogTitle className='text-gray-800 font-md'>New Collection</DialogTitle>
        </DialogHeader>
        <div className='h-[0.8px] w-full rounded-full bg-gray-200' />
        <NewCollectionForm />
      </DialogContent>
    </Dialog>
  );
}

interface EditCollectionProps {
  collection: CollectionPinned;
  children: React.ReactNode;
}

export function EditCollection({ collection, children }: EditCollectionProps) {
  return(
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[350px]'>
        <DialogHeader>
          <DialogTitle className='text-gray-800 font-md'>Edit Collection</DialogTitle>
        </DialogHeader>
        <div className='h-[0.8px] w-full rounded-full bg-gray-200' />
        <EditCllectionForm collection={collection} />
      </DialogContent>
    </Dialog>
    );
}
