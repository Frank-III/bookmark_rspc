import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { Layout } from '../components/layout';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { rspc } from '../utils/rspc';
import { addDays, addWeeks, startOfYear, getISODay } from 'date-fns';
import { start } from 'repl';
import LinkHeatMap from '../components/summary_stats/heatmap';
import { Button } from '../components/ui/button';
import { NewLinkForm } from '../components/forms/new_link_forms';
import { NewTagForm } from '../components/forms/create_tag_forms';
import { cn } from '../utils';
import * as Dialog from '@radix-ui/react-dialog';
import { NewTag } from '../components/modals/tag_modals';

export const route = new FileRoute('/').createRoute({
  component: () => {
    const [isDialogOpen, setDialogOpen] = React.useState(false);

    return (
      <>
        <h1>Hello, Welcome to Bookmarks</h1>
        <div className='p-2 flex items-center justify-center'>
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
                    <div className='absolute left-1/2 top-1/2 mx-auto flex max-w-[150px] -translate-x-1/2 flex-col items-center justify-center text-center'>
                      <Button className='mx-auto'>New Tag</Button>
                    </div>
                  </div>
                </Dialog.Trigger>
                <Dialog.Content>
                  <div className='h-[0.8px] w-full rounded-full bg-gray-200' />
                  <NewTagForm />
                </Dialog.Content>
              </Dialog.Root>
            </div>
            {/* <div className='relative flex w-full flex-col space-y-2 px-2'>
        <div className='absolute h-full w-full bg-gradient-to-t from-white to-transparent' />
        <div className='absolute left-1/2 top-2 mx-auto flex max-w-[150px] -translate-x-1/2 flex-col items-center justify-center text-center' >
        <div className='mx-auto'>
          <button onClick={() => setNewTag(!newTag)}
          className='bg-white text-gray-700 focus:outline-none ring-1 ring-black/5 shadow-small hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white focus-visible:button-focus-outline  auto shrink-0 h-8 rounded-lg px-2 text-sm min-w-[60px] relative flex flex-row items-center justify-center space-x-1 font-medium transition disabled:cursor-not-allowed'>
            New Tag
          </button>
          </div>
        </div>
        </div> */}
          </div>
        </div>
      </>
    );
  },
});
