import { NewTagForm } from '../forms/create_tag_forms';
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

interface NewTagProps {
  children: React.ReactNode;
}


export function NewTag({ children }: NewTagProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[350px] '>
        <DialogHeader>
          <DialogTitle className='text-gray-800 font-md'>
            New Tag
          </DialogTitle>
        </DialogHeader>
        <div className='h-[0.8px] w-full rounded-full bg-gray-200' />
        <NewTagForm/>
      </DialogContent>
    </Dialog>
  );
}

