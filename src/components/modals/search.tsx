import React from 'react';
import { Command } from 'cmdk';
import { ArrowLeft, ArrowLeftToLine, BadgePlus, BookMarked, BookPlus, Boxes, ChevronDown, ChevronUp, Highlighter, Link, MoveRight, Search, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '../ui/dialog';
import { rspc } from '../../utils/rspc';


export function SearchCMDK() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [inputValue, setInputValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [pages, setPages] = React.useState<string[]>(['home'])
  const activePage = pages[pages.length - 1]
  const isHome = activePage === 'home'

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const popPage = React.useCallback(() => {
    setPages((pages) => {
      const x = [...pages]
      x.splice(-1, 1)
      return x
    })
  }, [])

  const onKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (isHome || inputValue.length) {
        return
      }

      if (e.key === 'Backspace') {
        e.preventDefault()
        popPage()
      }
    },
    [inputValue.length, isHome, popPage],
  )

  function bounce() {
      if (ref.current) {
        ref.current.style.transform = 'scale(0.96)'
        setTimeout(() => {
          if (ref.current) {
            ref.current.style.transform = ''
          }
        }, 100)

        setInputValue('')
      }
  }
  const commands = [
    {
      group: "Tags",
      commandList: [
        {
          name: "Search Tag...",
          icon: <BookMarked />,
          onSelect: () => {
            setPages((pages) => [...pages, 'tags'])
            setInputValue('')
          }
        },
        {
          name: "Create Tag...",
          icon: <BadgePlus />
        },
      ]
    },
    {
      group: "Collections",
      commandList: [
        {
          name: "Search Collection...",
          icon: <Boxes />,
          onSelect: () => {
            setPages((pages) => [...pages, 'collections'])
            setInputValue('')
          }
        },
        {
          name: "Create Collection...",
          icon: <BookPlus />
        },
        {
          name: "Go to Collection...",
          icon: <MoveRight />
        }
      ]
    },
    {
      group: "Links",
      commandList: [
        {
          name: "Search Link...",
          icon: <Link />,
          onSelect: () => {
            setPages((pages) => [...pages, 'links'])
            setInputValue('')
          }
        },
        {
          name: "Create Link...",
          icon: <Highlighter />,
        },
      ]
    }
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='p-0'>
    <Command label="Global Command Menu"
      loop
      ref={ref}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          bounce()
        }
        if (isHome || inputValue.length) {
          return
        }
        if (e.key === 'Backspace') {
          e.preventDefault()
          popPage()
          bounce()
        }
      }}
      className='origin-top overflow-hidden bg-white/90 backdrop-blur-xl transition-transform duration-100 rounded-lg shadow-large ring-1 ring-black/5'
      >
          <div className='flex space-x-1 px-2 pt-2'>
            {pages.map((p) => (
              <div className='flex items-center space-x-1'>
                <div key={p} cmdk-vercel-badge="" className='max-w-[200px] truncate rounded-[3px] bg-black/5 px-1 text-xs capitalize text-black/60 transition-all hover:bg-black/10'>
                  {p}
                </div>
              </div>
            ))}
          </div>
          <div 
          className='flex items-center border-b px-3'
          cmdk-input-wrapper=''>
          <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
          <Command.Input
            autoFocus
            placeholder="What do you need?"
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value)
            }}
            className='flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
          />
          </div>
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            {activePage === 'home' && 
              commands.map((commandgroup) => (
                <Command.Group heading={commandgroup.group} className='overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'>
                  {commandgroup.commandList.map((command) => (
                    <Command.Item
                      key={command.name}
                      value={command.name}
                      onSelect={command.onSelect}
                      className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    >
                      <div className="flex flex-row items-center justify-start truncate">
                        <div className="mr-1.5 flex h-5 w-5 items-center justify-center">
                          {command.icon}
                        </div>
                        <p className="truncate text-sm">{command.name}</p>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>))
            }
            {activePage === 'tags' && <SearchTags />}
            {activePage === 'collections' && <SearchCollection />}
            {activePage === 'links' && <SearchLinks />}
          </Command.List>
        <Command.Separator/>
        <div className='flex items-center justify-between border-t p-2'>
            <div/>
            <div className='flex space-x-2'>
              <div className='flex items-center'>
              <span className='text-xs font-medium text-gray-500'>Navigate</span>
              <kbd className='ml-1 flex h-5 w-5 items-center justify-center rounded-[3px] bg-black/5 text-gray-500'>
                <ChevronUp/>
              </kbd>
              <kbd className='ml-1 flex h-5 w-5 items-center justify-center rounded-[3px] bg-black/5 text-gray-500'>
                <ChevronDown/>
              </kbd>
            </div>
              <div className='flex items-center'>
              <span className='text-xs font-medium text-gray-500'>Back</span>
              <kbd className='ml-1 flex h-5 w-5 items-center justify-center rounded-[3px] bg-black/5 text-gray-500'>
                <ArrowLeft/>
              </kbd>
            </div>
              <div className='flex items-center'>
              <span className='text-xs font-medium text-gray-500'>Select</span>
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
    )
}

export function SearchTags() {
  const {status, data: tags} = rspc.useQuery(['tags.getByUser'])

    return(
    <>
      {status === "loading" && <Command.Loading>Loading...</Command.Loading>}
      {status==="error" && <Command.Empty>Something went wrong</Command.Empty>}
      {tags?.map((tag) => (
          <Command.Item>
            {tag.name}
          </Command.Item>
        )) }
    </>)
}


export function SearchCollection() {
  const {status, data: collections} = rspc.useQuery(['collections.getByUser'])
    return(
    <>
      {status === "loading" && <Command.Loading>Loading...</Command.Loading>}
      {status==="error" && <Command.Empty>Something went wrong</Command.Empty>}
      {collections?.map((collection) => (
          <Command.Item>
            {collection.name}
          </Command.Item>
        )) }
    </>)
    
}

export function SearchLinks() {
  const {status, data: links} = rspc.useQuery(['links.getByUser'])
    return(
    <>
      {status === "loading" && <Command.Loading>Loading...</Command.Loading>}
      {status==="error" && <Command.Empty>Something went wrong</Command.Empty>}
      {links?.map((link) => (
          <Command.Item>
            {link.name}
          </Command.Item>
        )) }
    </>)
}