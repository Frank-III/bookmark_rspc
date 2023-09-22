import { NewLinkForm } from '../forms/new_link_forms';
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

interface NewLinkProps {
  children: React.ReactNode;
}

export function NewLink({ children }: NewLinkProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>New Link</DialogTitle>
          <DialogDescription>
            Add a new link to your collection
          </DialogDescription>
        </DialogHeader>
        <NewLinkForm />
      </DialogContent>
    </Dialog>
  );
}
