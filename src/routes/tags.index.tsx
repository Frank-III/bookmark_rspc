import * as React from 'react';
import { FileRoute } from '@tanstack/react-router';
import { Badge } from '../components/ui/badge';
import { rspc } from '../utils/rspc';
import { is } from 'date-fns/locale';
import ContentLoader from 'react-content-loader';

export const route = new FileRoute('/tags/').createRoute({
  component: () => {
    const { status, data: allTags } = rspc.useQuery(['tags.getByUser']);

    if (status !== 'success') {
      return (
        <ContentLoader
          speed={1}
          width={340}
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
      );
    }

    return (
      <div className='flex wrap space-x-2'>
        {allTags.map((tag) => (
          <Badge
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
    );
  },
});
