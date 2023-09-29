import React, { useEffect, useState } from 'react';
import { Calendar } from '../components/ui/calendar';
import { useAuth } from '@clerk/clerk-react';
import { rspc } from '../utils/rspc';
import { LinkLinks } from './links/link_lists';
import ContentLoader from 'react-content-loader';

function DailySummary({ date, total }: { date?: Date; total: number }) {
  return (
    <div className='container m-auto mt-3 flex  items-center justify-center rounded-md m-w-full text-[#111827]'>
      <div className='w-10 h-10 p-1 rounded-lg border border-gray-200 justify-center items-center inline-flex'>
        <div className='grow shrink basis-0 self-stretch p-1.5 bg-gray-100 rounded justify-center items-center inline-flex'>
          <span>{date?.getDay()}</span>
        </div>
      </div>
      <div className='flex flex-col items-center m-auto justify-items-center'>
        <div className=''>
          <p className='text-md'>{date?.toDateString()}</p>
        </div>
        <p className='text-xs'>
          You added <a className='border border-gray-200'>{total}</a> links this day
        </p>
      </div>
    </div>
  );
}


export function CalenderView() {
  const { getToken, isSignedIn, userId } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>();
  const {
    status: dateLinkStatus,
    error,
    data: dateLinks,
    isFetching,
    refetch,
  } = rspc.useQuery(
    ['links.getByDate', { date: date?.toISOString()?.slice(0, 10), size: 10 }],
    { enabled: false },
  );

  useEffect(() => {
    if (date !== undefined) {
      refetch();
    }
  }, [date]);
    
  
  return (
      <div className='right-sidebar flex h-full w-[280px] flex-col items-center justify-between border-l border-gray-200 bg-white'>
        <div className='flex h-full w-full flex-auto flex-col overflow-hidden '>
          <div className='styled-scrollbar relative flex w-full flex-auto flex-col space-y-2 overflow-x-hidden overflow-y-auto px-2 pb-2 pt-2'>
            <Calendar
              mode='single'
              selected={date}
              onSelect={setDate}
              className='rounded-md border-transparent text-gray-800'
            />
            <div className='relative flex w-full items-center justify-center mt-4 px-2 mb-4'>
              <div className='h-[1px] w-full rounded-full bg-gray-100' />
            </div>
            { dateLinkStatus !== 'success' && (
              isFetching ? 
            <ContentLoader
              speed={2}
              width={400}
              height={150}
              viewBox='0 0 400 150'
              backgroundColor='#f3f3f3'
              foregroundColor='#ecebeb'
              // {...props}
            >
              <circle cx='10' cy='20' r='8' />
              <rect x='25' y='15' rx='5' ry='5' width='220' height='10' />
              <circle cx='10' cy='50' r='8' />
              <rect x='25' y='45' rx='5' ry='5' width='220' height='10' />
              <circle cx='10' cy='80' r='8' />
              <rect x='25' y='75' rx='5' ry='5' width='220' height='10' />
              <circle cx='10' cy='110' r='8' />
              <rect x='25' y='105' rx='5' ry='5' width='220' height='10' />
            </ContentLoader> :
            <div className='h-full flex pt-3 justify-center text-gray-400 font-semibold'>
            <h1>Please Pick a Day</h1>
            </div>
            )}
            { dateLinkStatus === 'success' && 
              (<>
              <DailySummary date={date} total={dateLinks.length} />
              <LinkLinks links={dateLinks} />
              </>)
            }
          </div>
        </div>
      </div>
      )
  }
