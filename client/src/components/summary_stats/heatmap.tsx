import {
  type FC,
  Fragment,
  type PointerEvent,
  type UIEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { SummariesReturnData } from '../../../bindings';
import {
  TooltipWithBounds,
  useTooltip,
  useTooltipInPortal,
} from '@visx/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '../../utils';
import { rspc } from '../../utils/rspc';
import { Button } from '../ui/button';
import { RefreshCcw } from 'lucide-react';
import { StyledButton } from '../buttons/styled_button';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const LinkHeatMap: FC = () => {




  const SQUARE_SIZE = 18;
  const GAP = 4;

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const {
    isLoading,
    data: linkSummary,
    refetch,
  } = rspc.useQuery(['links.getSummary', year], {
    staleTime: Infinity,
    keepPreviousData: true,
    // enabled: false,
  });

  const yearsLogged = [2023, 2022, 2021];

  const [scrollIsAtLeft, setScrollIsAtLeft] = useState<boolean>(true);
  const [scrollIsAtRight, setScrollIsAtRight] = useState<boolean>(false);

  const { containerRef, containerBounds } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
  } = useTooltip<string>({
    tooltipOpen: true,
    tooltipLeft: undefined,
    tooltipTop: undefined,
  });

  const handlePointerMove = useCallback(
    (event: PointerEvent<SVGSVGElement>) => {
      // Coordinates should be relative to the container
      const tooltipLeft =
        ('clientX' in event ? event.clientX : 0) - containerBounds.left;
      const tooltipTop =
        ('clientY' in event ? event.clientY : 0) - containerBounds.top;

      // Read `data-value` attribute from the target element
      const targetNode = event.target as SVGPathElement;
      const dataDate = targetNode.getAttribute('data-date') ?? undefined;
      const dataValue = targetNode.getAttribute('data-value') ?? undefined;
      const tooltipData =
        dataDate !== undefined && dataValue !== undefined
          ? JSON.stringify({
              date: dataDate,
              value: dataValue,
            })
          : undefined;
      showTooltip({ tooltipLeft, tooltipTop, tooltipData });
    },
    [containerBounds.left, containerBounds.top, showTooltip],
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLFieldSetElement;
    const scrollLeft = target.scrollLeft;
    const scrollWidth = target.scrollWidth;
    const clientWidth = target.clientWidth;

    setScrollIsAtLeft(scrollLeft === 0);
    setScrollIsAtRight(scrollWidth - scrollLeft === clientWidth);
  };

  const firstDay = useMemo(() => new Date(Date.UTC(year, 0, 1)), [year]);
  const dayOffset = useMemo(() => firstDay.getUTCDay(), [firstDay]);
  const width = useMemo(() => 53 * SQUARE_SIZE + 52 * GAP, []);
  const height = useMemo(() => 7 * SQUARE_SIZE + 6 * GAP + 16, []);

  return (
    <div className='mt-4 w-[700px] flex flex-col h-[280px] rounded-md pb-5 px-4 ring-1 shadow-small ring-black/5'>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div className='flex h-full flex-col p-2'>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>
              <span className='text-gray-12'>{linkSummary?.total_links}</span>
            </div>
            <div className='inline-flex space-x-0.5'>
              <Select
                // intent="none"
                defaultValue={'2023'}
                onValueChange={(e) => setYear(Number(e))}
                aria-label='Select year to view running logs from'
              >
                <SelectTrigger className='w-[80px] h-8'>
                  <SelectValue>{year}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {yearsLogged.map((year) => (
                    <SelectItem value={`${year}`}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <StyledButton
                onClick={() => {
                  refetch();
                }}
                className='h-8 w-8 p-2'
              >
                <RefreshCcw size={20} color='black' />
              </StyledButton>
            </div>
          </div>
          <div className='relative'>
            <div
              className='hide-scrollbar relative mt-2 overflow-x-scroll'
              tabIndex={-1}
              onScroll={handleScroll}
            >
              <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                xmlns='http://www.w3.org/2000/svg'
                role='figure'
                ref={containerRef}
                onPointerMove={handlePointerMove}
                onMouseLeave={hideTooltip}
              >
                <desc>5/9&apos;s running heatmap for {year}</desc>
                {Array(12)
                  .fill(null)
                  .map((_, month) => {
                    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));

                    return (
                      <text
                        key={month}
                        x={
                          (SQUARE_SIZE + GAP) *
                          Math.ceil(
                            (86_400 * dayOffset +
                              firstDayOfMonth.getTime() -
                              firstDay.getTime()) /
                              604_800_000,
                          )
                        }
                        y={12}
                        fontSize={12}
                        className='fill-gray-11'
                      >
                        {firstDayOfMonth.toLocaleDateString('en-US', {
                          month: 'short',
                          timeZone: 'UTC',
                        })}
                      </text>
                    );
                  })}
                {linkSummary?.summaries.map((log, y) => {
                  return (
                    <Fragment key={y}>
                      {log.map((day, x) => {
                        if (day === null) return null;

                        const props = {
                          // Add 16 to account for the height of month labels (font
                          // size is 12px, and we want a 4px margin).
                          d: `M${(SQUARE_SIZE + GAP) * x + 2} ${
                            (SQUARE_SIZE + GAP) * y + 0.5 + 16
                          }h${SQUARE_SIZE - 4}q1.5 0 1.5 1.5v${
                            SQUARE_SIZE - 4
                          }q0 1.5-1.5 1.5h-${SQUARE_SIZE - 4}q-1.5 0-1.5-1.5v-${
                            SQUARE_SIZE - 4
                          }q0-1.5 1.5-1.5z`,
                          ...(day === undefined
                            ? {}
                            : {
                                fillOpacity:
                                  linkSummary.max_links > 0
                                    ? day.count / linkSummary.max_links
                                    : 0,
                                'data-date': day.date,
                                'data-value': day.count,
                              }),
                        };

                        return (
                          <path
                            key={`running-heatmap-${x}-${y}`}
                            className={cn(
                              'stroke stroke-gray-300 transition-colors hover:stroke-gray-400',
                              day === undefined
                                ? 'fill-transparent'
                                : 'fill-blue-600',
                            )}
                            {...props}
                          />
                        );
                      })}
                    </Fragment>
                  );
                })}
              </svg>
              {tooltipOpen &&
              tooltipLeft !== undefined &&
              tooltipTop !== undefined &&
              tooltipData !== undefined ? (
                <TooltipWithBounds
                  key={Math.random()}
                  top={tooltipTop}
                  left={tooltipLeft}
                  offsetLeft={-SQUARE_SIZE}
                  className='pointer-events-none absolute left-0 top-0 z-50 rounded border border-gray-6 bg-gray-3 px-2 py-1 text-sm text-gray-12 shadow-md transition-colors'
                  style={{}}
                >
                  {JSON.parse(tooltipData).value}
                  {/* {unit.spaceBefore ? ' ' : ''} */}
                  {/* <span className="text-gray-11">{unit.name} on</span>{' '} */}
                  {new Date(JSON.parse(tooltipData).date).toLocaleDateString(
                    'en-US',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    },
                  )}
                </TooltipWithBounds>
              ) : null}
            </div>

            {/* Left gradient to hide overflow */}
            <div
              className={cn(
                'pointer-events-none absolute bottom-0 left-0 h-[112px] w-4 bg-gradient-to-r from-gray-3 transition-opacity',
                scrollIsAtLeft ? 'opacity-0' : 'opacity-100',
              )}
            />
            {/* Right gradient to hide overflow */}
            <div
              className={cn(
                'pointer-events-none absolute bottom-0 right-0 h-[112px] w-4 bg-gradient-to-l from-gray-3 transition-opacity',
                scrollIsAtRight ? 'opacity-0' : 'opacity-100',
              )}
            />
          </div>
          <div className='flex grow items-end justify-end space-x-2'>
            <div className='flex items-center space-x-1 text-xs text-gray-11'>
              <span>Less</span>
              <svg
                width='68'
                height='12'
                viewBox='0 0 68 12'
                xmlns='http://www.w3.org/2000/svg'
                role='note'
              >
                <path
                  id='a'
                  d='M58 .5h8q1.5 0 1.5 1.5v8q0 1.5-1.5 1.5h-8q-1.5 0-1.5-1.5V2Q56.5.5 58 .5z'
                  className='stroke fill-blue-700 stroke-gray-400'
                />
                <use
                  xlinkHref='#a'
                  transform='translate(-14)'
                  fillOpacity='0.75'
                />
                <use
                  xlinkHref='#a'
                  transform='translate(-28)'
                  fillOpacity='0.5'
                />
                <use
                  xlinkHref='#a'
                  transform='translate(-42)'
                  fillOpacity='0.25'
                />
                <use
                  xlinkHref='#a'
                  transform='translate(-56)'
                  fillOpacity='0'
                />
              </svg>
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkHeatMap;
