import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command as CommandPrimative } from 'cmdk';
import React from 'react';
import { Badge } from '../ui/badge';
import { queryClient, rspc } from '../../utils/rspc';
import { cn } from '../../utils';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { on } from 'events';
import { CreateTagArgs } from '../../../bindings';

interface MultiSelectProps {
  selected: number[];
  onChange: React.Dispatch<React.SetStateAction<number[]>>;
  className?: string;
}
export function MultiSelectTags({
  selected,
  onChange,
  className,
  ...props
}: MultiSelectProps) {
  const { isLoading, data: tags } = rspc.useQuery(['tags.getByUser']);
  const handleUnselect = (item: number) => {
    onChange(selected.filter((i) => i !== item));
  };
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>();

  const addNewTag = rspc.useMutation(['tags.create'], {
    meta: {
      message: 'Tag created!',
    },
    onSuccess: (data) => {
      onChange([...selected, data.id]);
      queryClient.setQueryData(['tags.getByUser'], (oldData: any) => {
        return [...oldData, data];
      });
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={`w-full justify-between ${
            selected.length > 1 ? 'h-full' : 'h-10'
          }`}
          onClick={() => setOpen(!open)}
        >
          <div className='flex gap-1 flex-wrap'>
            {selected.map((item) => {
              const this_tag = tags?.find((tag) => tag.id === item);
              return (
                <Badge
                  variant='secondary'
                  key={item.toString()}
                  className='mr-1 mb-1'
                  onClick={() => handleUnselect(item)}
                  style={{
                    backgroundColor: `${this_tag?.color}30`,
                    color: this_tag?.color,
                    borderColor: `${this_tag?.color}20`,
                  }}
                >
                  {this_tag?.name}
                  <button
                    className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                  </button>
                </Badge>
              );
            })}
          </div>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0'>
        <CommandPrimative className='flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground'>
          <div
            className='flex items-center border-b px-3'
            cmdk-input-wrapper=''
          >
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <CommandPrimative.Input
              placeholder='Search Tags...'
              className='flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
              value={value}
              onValueChange={setValue}
            />
          </div>
          {isLoading && (
            <CommandPrimative.Loading>Loading...</CommandPrimative.Loading>
          )}
          <CommandPrimative.Empty>
            {/* No Tags Found */}
            <button
              key='no-tags-found'
              onClick={() => {
                addNewTag.mutate({
                  tag_name: value,
                  color: '#327fa8',
                } as CreateTagArgs);
                setValue('');
              }}
              className='inline-flex'
              // className='relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground'
            >
              Add 
              <Badge
                variant='secondary'
                className='ml-1'
                style={{
                  backgroundColor: '#327fa830',
                  color: '#327fa8',
                  borderColor: '#327fa820',
                }}>
                {value}
                </Badge>
                to tags
              {/* {`add "${value}" to tags`} */}
            </button>
          </CommandPrimative.Empty>
          <CommandPrimative.Group className='overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'>
            {tags?.map((tag) => (
              <CommandPrimative.Item
                key={tag.name}
                onSelect={() => {
                  onChange(
                    selected.includes(tag.id)
                      ? selected.filter((item) => item !== tag.id)
                      : [...selected, tag.id],
                  );
                  setOpen(true);
                }}
                className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected.includes(tag.id) ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {tag.name}
              </CommandPrimative.Item>
            ))}
          </CommandPrimative.Group>
        </CommandPrimative>
      </PopoverContent>
    </Popover>
  );
}
