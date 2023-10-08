import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import LinkHeatMap from '../components/summary_stats/heatmap';
import { Button } from '../components/ui/button';
import { NewLinkForm } from '../components/forms/new_link_forms';
import { NewTagForm } from '../components/forms/create_tag_forms';
import { cn } from '../utils';
import * as Dialog from '@radix-ui/react-dialog';
import { time } from 'console';
import { useUser } from '@clerk/clerk-react';

interface Quote {
  content: string;
  author: string;
}

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'night';
  }
};

const fetchQuote = async (): Promise<Quote> => {
  const response = await fetch('https://api.quotable.io/random');
  const data = await response.json().then((data) => data as Quote);
  return data;
};

export const route = new FileRoute('/').createRoute({
  component: () => {
    const {user} = useUser();

    const [quote, setQuote] = React.useState<Quote | null>(null);

    React.useEffect(() => {
      fetchQuote().then((data) => setQuote(data));
    }, []);
    const timeOfDay = getTimeOfDay();
    const [isDialogOpen, setDialogOpen] = React.useState(false);

    return (
      <div className='p-5 grid-cols-2 gap-4 '>
        <h1 className='items-first scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl'>
          Good {timeOfDay}: {user?.firstName }
        </h1>
        {quote && (
          <div>
            <blockquote className='mt-6 border-l-2 pl-6 italic'>
              {quote.content + ' - ' + quote.author}
            </blockquote>
          </div>
        )}
        <div className='flex items-center justify-center mt-10'>
          <div className='flex flex-row space-x-5'>
            <LinkHeatMap />
            <div className='mt-4 w-[300px] flex justify-center items-center border shadow-sm ring ring-black/5 rounded-md'>
              <Dialog.Root
                onOpenChange={() => {
                  setDialogOpen(!isDialogOpen);
                }}
              >
                <Dialog.Trigger className={cn('', isDialogOpen && 'hidden')}>
                  <div className='relative flex w-full flex-col '>
                    <div
                      className={cn(
                        '',
                        !isDialogOpen &&
                          'opacity-40 blur-sm pointer-events-none',
                      )}
                    >
                      <NewTagForm />
                    </div>
                    <div className='absolute left-1/2 top-1/2 mx-auto flex max-w-[150px] -translate-x-1/2 items-center justify-center text-center'>
                      <Button className='mx-auto'>New Tag</Button>
                    </div>
                  </div>
                </Dialog.Trigger>
                <Dialog.Content>
                  <NewTagForm />
                </Dialog.Content>
              </Dialog.Root>
            </div>
          </div>
        </div>
        <div className='flex items-end justify-center gap-4 gap-y-10'>
          <div className='flex flex-row justify-between'>
            <div className='mt-4 w-[350px] h-[500px] flex justify-center items-center border shadow-sm ring ring-black/5 rounded-md'>
              <NewLinkForm />
            </div>
            {/* <NewCollectionForm /> */}
          </div>
          <div className='flex flex-col space-y-4'>
            <div className='w-[500px] h-[180px] grid grid-cols3 border shadow-sm ring ring-black/5 rounded-lg'>
              
            </div>
          <div className='w-[500px] border h-[300px] shadow-sm ring ring-black/5 rounded-lg'></div>
          </div>
        </div>
      </div>
    );
  },
});
