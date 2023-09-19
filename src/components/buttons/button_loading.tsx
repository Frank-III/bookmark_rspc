import { Loader2 } from 'lucide-react';

import { Button, ButtonProps } from '../ui/button';

interface ButtonLoadingProps extends ButtonProps {}

export default function ButtonLoading({ className }: ButtonLoadingProps) {
  return (
    <Button disabled className={className}>
      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      Please wait
    </Button>
  );
}
