import { NewCollectionForm } from '../forms/new_collection_forms';
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

interface NewCollectionProps {
  children: React.ReactNode;
}

export function NewCollection({ children }: NewCollectionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <NewCollectionForm />
      </DialogContent>
    </Dialog>
  );
}

interface EditCollectionProps {
  key: number;
  children: React.ReactNode;
}

export function EditCollection({ key, children }: EditCollectionProps) {
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className='sm:max-w-[425px]'>
      <EditCollectionForm key={key} />
    </DialogContent>
  </Dialog>
}
