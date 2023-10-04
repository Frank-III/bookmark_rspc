import React from 'react';
import { Command } from 'cmdk';
import {
  ArrowLeft,
  ArrowLeftToLine,
  BadgePlus,
  BookMarked,
  BookPlus,
  Boxes,
  ChevronDown,
  ChevronUp,
  Highlighter,
  Link,
  MoveRight,
  Search,
  Tag,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
} from '../ui/dialog';
import { rspc } from '../../utils/rspc';
import { cn } from '../../utils';
import { NewTag } from './tag_modals';
import { NewTagForm } from '../forms/create_tag_forms';

function Item({
  command,
}: {
  command: {
    name: string;
    icon: React.ReactNode;
    onSelect?: () => void;
    children?: React.ReactNode;
  };
}) {
  return (
    <Command.Item
      onSelect={command.onSelect}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      {command.children ? (
        command.children
      ) : (
        <div className='flex flex-row items-center justify-start truncate'>
          <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
            {command.icon}
          </div>
          <p className='truncate text-sm'>{command.name}</p>
        </div>
      )}
    </Command.Item>
  );
}

export function NewTagSelect() {
  const [newTag, setNewTag] = React.useState(false);
  return (
    <Command.Item
      onSelect={() => setNewTag(true)}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      )}
      key='newTag'
    >
      <Dialog open={newTag} onOpenChange={() => setNewTag(false)}>
        <DialogTrigger asChild>
          <button className='flex flex-row items-center justify-start truncate'>
            <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
              <BadgePlus />
            </div>
            <p className='truncate text-sm'>Create Tag2...</p>
          </button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[350px]'>
          <DialogHeader>
            <DialogTitle className='text-gray-800 font-md'>New Tag</DialogTitle>
          </DialogHeader>
          <div className='h-[0.8px] w-full rounded-full bg-gray-200' />
          <NewTagForm />
        </DialogContent>
      </Dialog>
    </Command.Item>
  );
}

export function SearchCMDK({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [pages, setPages] = React.useState<string[]>(['home']);
  const activePage = pages[pages.length - 1];
  const isHome = activePage === 'home';

  const [newTag, setNewTag] = React.useState(false);

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const popPage = React.useCallback(() => {
    setPages((pages) => {
      const x = [...pages];
      x.splice(-1, 1);
      return x;
    });
  }, []);

  const onKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (isHome || inputValue.length) {
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        popPage();
      }
    },
    [inputValue.length, isHome, popPage],
  );

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = 'scale(0.96)';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = '';
        }
      }, 100);

      setInputValue('');
    }
  }
  const commands = [
    {
      group: 'Tags',
      commandList: [
        {
          name: 'Search Tag...',
          icon: <BookMarked />,
          onSelect: () => {
            setPages((pages) => [...pages, 'tags']);
            setInputValue('');
          },
        },
        {
          name: 'Create Tag...',
          icon: <BadgePlus />,
          children: (
            <NewTag>
              <button className='flex flex-row items-center justify-start truncate'>
                <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
                  <BadgePlus />
                </div>
                <p className='truncate text-sm'>Create Tag...</p>
              </button>
            </NewTag>
          ),
        },
      ],
    },
    {
      group: 'Collections',
      commandList: [
        {
          name: 'Search Collection...',
          icon: <Boxes />,
          onSelect: () => {
            setPages((pages) => [...pages, 'collections']);
            setInputValue('');
          },
        },
        {
          name: 'Create Collection...',
          icon: <BookPlus />,
        },
        {
          name: 'Go to Collection...',
          icon: <MoveRight />,
        },
      ],
    },
    {
      group: 'Links',
      commandList: [
        {
          name: 'Search Link...',
          icon: <Link />,
          onSelect: () => {
            setPages((pages) => [...pages, 'links']);
            setInputValue('');
          },
        },
        {
          name: 'Create Link...',
          icon: <Highlighter />,
        },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='p-0 max-h-[500px]'>
        <Command
          label='Global Command Menu'
          loop
          ref={ref}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
              bounce();
            }
            if (isHome || inputValue.length) {
              return;
            }
            if (e.key === 'Backspace') {
              e.preventDefault();
              popPage();
              bounce();
            }
          }}
          className={cn(
            '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5',
            'origin-top overflow-y-hidden bg-white/90 backdrop-blur-xl transition-transform duration-100 rounded-lg shadow-large ring-1 ring-black/5',
          )}
        >
          <div className='flex space-x-1 px-2 pt-2'>
            {pages.map((p) => (
              <div className='flex items-center space-x-1'>
                <div
                  key={p}
                  cmdk-vercel-badge=''
                  className='max-w-[200px] truncate rounded-[3px] bg-black/5 px-1 text-xs capitalize text-black/60 transition-all hover:bg-black/10'
                >
                  {p}
                </div>
              </div>
            ))}
          </div>
          <div
            className='flex items-center border-b px-3'
            cmdk-input-wrapper=''
          >
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <Command.Input
              autoFocus
              placeholder='What do you need?'
              value={inputValue}
              onValueChange={(value) => {
                setInputValue(value);
              }}
              className='flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
          <Command.List className='max-h-[500px] overflow-x-hidden overflow-y-auto'>
            <Command.Empty><div className='p-3 items-center justify-center'>Something went wrong</div></Command.Empty>
            {activePage === 'home' &&
              commands.map((commandgroup) => (
                <Command.Group
                  heading={commandgroup.group}
                  className='overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'
                >
                  {commandgroup.commandList.map((command) => (
                    <Item command={command} />
                  ))}
                </Command.Group>
              ))}
            {activePage === 'tags' && <SearchTags />}
            {activePage === 'collections' && <SearchCollection />}
            {activePage === 'links' && <SearchLinks />}
            <NewTagSelect />
          </Command.List>
          <Command.Separator />
          <div className='flex items-center justify-between border-t p-2'>
            <div />
            <div className='flex space-x-2'>
              <div className='flex items-center'>
                <span className='text-xs font-medium text-gray-500'>
                  Navigate
                </span>
                <kbd className='ml-1 flex h-5 w-5 items-center justify-center rounded-[3px] bg-black/5 text-gray-500'>
                  <ChevronUp />
                </kbd>
                <kbd className='ml-1 flex h-5 w-5 items-center justify-center rounded-[3px] bg-black/5 text-gray-500'>
                  <ChevronDown />
                </kbd>
              </div>
              <div className='flex items-center'>
                <span className='text-xs font-medium text-gray-500'>Back</span>
                <kbd className='ml-1 flex h-5 w-5 items-center justify-center rounded-[3px] bg-black/5 text-gray-500'>
                  <ArrowLeft />
                </kbd>
              </div>
              <div className='flex items-center'>
                <span className='text-xs font-medium text-gray-500'>
                  Select
                </span>
                <kbd className='ml-1 flex h-5 w-5 items-center justify-center rounded-[3px] bg-black/5 text-gray-500'>
                  <ArrowLeftToLine />
                </kbd>
              </div>
              <div className='flex items-center'>
                <span className='text-xs font-medium text-gray-500'>Close</span>
                <kbd className='ml-1 flex h-5 w-5 items-center justify-center rounded-[3px] bg-black/5 text-gray-500'>
                  ESC
                </kbd>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function SearchTags() {
  const { status, data: tags } = rspc.useQuery(['tags.getByUser']);

  return (
    <>
      {status === 'loading' && <Command.Loading>Loading...</Command.Loading>}
      {status === 'error' && (
        <Command.Empty>Something went wrong</Command.Empty>
      )}
      {tags?.map((tag) => (
        <Command.Item
          onSelect={() => {}}
          className={cn(
            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {tag.name}
        </Command.Item>
      ))}
    </>
  );
}

export function SearchCollection() {
  const { status, data: collections } = rspc.useQuery([
    'collections.getByUser',
  ]);
  return (
    <>
      {status === 'loading' && <Command.Loading>Loading...</Command.Loading>}
      {status === 'error' && (
        <Command.Empty>Something went wrong</Command.Empty>
      )}
      {collections?.map((collection) => (
        <Command.Item
          onSelect={() => {}}
          className={cn(
            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {collection.name}
        </Command.Item>
      ))}
    </>
  );
}

export function SearchLinks() {
  const { status, data: links } = rspc.useQuery(['links.getByUser']);
  return (
    <>
      {status === 'loading' && <Command.Loading><div className='p-3 items-center justify-center'>Loading...</div></Command.Loading>}
      {status === 'error' && (
        <Command.Empty><div className='p-3 items-center justify-center'>Something went wrong</div></Command.Empty>
      )}
      {links?.map((link) => (
        <Command.Item
          key={link.id}
          value={`${link.name} ${link.collectionId} ${link.url}`}
          onSelect={() => {}}
          className={cn(
            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {link.name}
        </Command.Item>
      ))}
    </>
  );
}
