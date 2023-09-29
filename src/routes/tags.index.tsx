import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { Badge } from '../components/ui/badge';
import { rspc } from '../utils/rspc';
import { is } from 'date-fns/locale';
import ContentLoader from 'react-content-loader';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';

export const route = new FileRoute('/tags/').createRoute({
  component: () => {
    const { status, data: allTags } = rspc.useQuery(['tags.getByUser']);

    if (status !== 'success') {
      return (
        <div className='flex justify-center'>
        <ContentLoader
          speed={1}
          width={400}
          height={84}
          viewBox='0 0 340 84'
          backgroundColor='#f6f6ef'
          foregroundColor='#e8e8e3'
        >
          <rect x='9' y='4' rx='0' ry='0' width='320' height='22' />
          <rect x='18' y='14' rx='0' ry='0' width='303' height='6' />
          <rect x='11' y='33' rx='0' ry='0' width='108' height='13' />
          <rect x='129' y='33' rx='0' ry='0' width='60' height='13' />
          <rect x='196' y='33' rx='0' ry='0' width='60' height='13' />
        </ContentLoader>
      </div>
      );
    }

    return (
<div className='flex flex-col mx-auto justify-center'>
  <h1 className='text-3xl font-semibold mb-3'>Tags</h1>
  <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
    <Input
      className='w-full '
      placeholder='Search by tags...'
    />
    <Button className='border-2 bg-gray-900 w-full md:w-auto'>
      <Search />
    </Button>
  </div>
  <div className='flex flex-wrap space-x-2 items-center justify-center mt-5'>
    {allTags.map((tag) => (
      <Badge
        key={tag.id}
        className='mb-2' // Add margin at the bottom for spacing
        style={{
          backgroundColor: `${tag.color}30`,
          color: tag.color,
          borderColor: `${tag.color}20`,
        }}
      >
        {tag.name}
      </Badge>
    ))}
  </div>
</div>

    );
  },
});
