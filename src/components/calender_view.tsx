import React, { useEffect, useState } from 'react';
import { Calendar } from '../components/ui/calendar';
import { useAuth } from '@clerk/clerk-react';
import { rspc } from '../utils/rspc';

function DailySummary({ date, total }: { date?: Date; total: number }) {
  return (
    <div className='container m-auto mt-3 flex  items-center justify-center rounded-md m-w-full text-[#111827]'>
      <div className='w-10 h-10 p-1 rounded-lg border border-gray-200 justify-center items-center inline-flex'>
        <div className='grow shrink basis-0 self-stretch p-1.5 bg-gray-100 rounded justify-center items-center inline-flex'>
          <span>3</span>
        </div>
      </div>
      <div className='flex flex-col items-center m-auto justify-items-center'>
        <div className=''>
          <p className='text-md'>Sep 20, 2023</p>
        </div>
        <p className='text-xs'>
          You added <a className='border border-gray-200'>0</a> links this day
        </p>
      </div>
    </div>
  );
}

function DailyLink() {
  return (
    <div className='w-full h-14 relative rounded-lg border border-gray-200'>
      <div className='p-1.5 left-[304px] top-[14px] absolute rounded-lg justify-center items-center gap-1.5 inline-flex'>
        <div className='w-5 h-5 relative' />
      </div>
      <div className="left-[72px] top-[8px] absolute text-gray-900 text-sm font-normal font-['Inter'] leading-normal">
        Scandinavia
      </div>
      <div className="left-[72px] top-[32px] absolute text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
        Denmark, Norway, Sweden
      </div>
      <div className='w-10 h-10 left-[16px] top-[10px] absolute rounded-lg border border-gray-200' />
      <div className='w-8 h-8 p-1.5 left-[20px] top-[14px] absolute bg-gray-100 rounded justify-center items-center inline-flex'>
        <div className='w-5 h-5 relative flex-col justify-start items-start flex' />
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
        <div className='flex h-full flex-col mb-2'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={setDate}
            className='rounded-md border-transparent text-gray-800'
          />
          <div className='relative flex w-full items-center justify-center mt-4 px-2'>
            <div className='h-[1px] w-full rounded-full bg-gray-100' />
          </div>
          <DailySummary date={date} total={0} />
          {/* <LinkLists dateLinks={dateLinks} /> */}
        </div>
      </div>
    </div>
  );
}
