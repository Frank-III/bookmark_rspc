import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { Layout } from '../components/layout';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { rspc } from '../utils/rspc';
import { addDays, addWeeks, startOfYear, getISODay } from 'date-fns';

const SQUARE_SIZE = 20;
const GAP = 2;
const firstDay = new Date(Date.UTC(2023, 0, 1));

function getDateFromWeek(weekNumber: number, dayOfWeek: number): Date {
  console.log(weekNumber, dayOfWeek);
  const startDate = startOfYear(new Date(2023, 0, 1)); // January 1, 2023
  const daysToAdd = (weekNumber - 1) * 7 + dayOfWeek;

  return addDays(startDate, daysToAdd);
}

export const route = new FileRoute('/').createRoute({
  component: () => {
    const {
      isLoading,
      data: summaryData,
      refetch,
    } = rspc.useQuery(['links.getSummary', 2023], {
      enabled: false,
    });

    const year = 2023;

    const preview_rest = summaryData?.map((row, rowId) => {
      return (
        <div>
          {row?.map((val, colId) => (
            <button
              className='border font-sm p-0 m-1 w-[20px]'
              onClick={() => {
                console.log(`${colId}, ${rowId}`);
                console.log(`${getDateFromWeek(colId + 1, rowId)}`);
              }}
            >
              {val}
            </button>
          ))}
        </div>
      );
    });
    return (
      <div className='p-2'>
        <h1>Hello</h1>
        <button onClick={() => refetch()}>Refetch</button>
        {isLoading && <div>Loading...</div>}
        <div>
          <div className='space-x-[95px]'>
            {Array(12)
              .fill(null)
              .map((_, month) => {
                const firstDayOfMonth = new Date(Date.UTC(year, month, 1));

                return (
                  <text key={month} fontSize={12} className='fill-gray-11'>
                    {firstDayOfMonth.toLocaleDateString('en-US', {
                      month: 'short',
                      timeZone: 'UTC',
                    })}
                  </text>
                );
              })}
          </div>
          {preview_rest}
        </div>
      </div>
    );
  },
});
