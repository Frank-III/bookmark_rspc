import * as React from 'react'
import { cn } from "../../utils"

import { Check, X, ChevronsUpDown } from "lucide-react"
import { Button } from "./button"
import { Command as CommandPrimative } from 'cmdk';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover"
import { Badge } from "./badge";
import { rspc } from '../../utils/rspc'
import { Procedures } from '../../../bindings'

type ExtractQuery<Key extends Procedures['queries']['key']> = Extract<Procedures['queries'], { key: Key }>['result'];
type ExtractIdType<Key extends Procedures['queries']['key']>=  ExtractQuery<Key> extends {id: infer V} ? V : never;

interface MultiSelectProps<Key extends Procedures['queries']['key'], V=ExtractIdType<Key>> {
  selected: V[];
  onChange: React.Dispatch<React.SetStateAction<V[]>>;
  className?: string;
}

function MultiSelect<Key extends Procedures['queries']['key'], Output = ExtractQuery<Key>, V = Output extends {id: infer V} ? V: never>({ selected, onChange, className, ...props }: MultiSelectProps<Key>) {

    const {isLoading, data: tags} = rspc.useQuery(Key)
    const [open, setOpen] = React.useState(false)

    const handleUnselect = (item: V) => {
        onChange(selected.filter((i) => i !== item))
    }

    return (
        <Popover open={open} onOpenChange={setOpen} {...props}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between ${selected.length > 1 ? "h-full" : "h-10"}`}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex gap-1 flex-wrap">
                        {selected.map((item) => (
                            <Badge
                                variant="secondary"
                                key={item.toString()}
                                className="mr-1 mb-1"
                                onClick={() => handleUnselect(item)}
                            >
                                {item}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(item);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(item)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <CommandPrimative className='flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground'>
                    <CommandPrimative.Input placeholder="Search ..." />
                    {isLoading && <CommandPrimative.Loading>Loading...</CommandPrimative.Loading>}
                    <CommandPrimative.Empty>No item found.</CommandPrimative.Empty>
                    <CommandPrimative.Group className='max-h-64 overflow-auto'>
                        {tags?.map((tag) => (
                            <CommandPrimative.Item
                                key={tag.name}
                                onSelect={() => {
                                    onChange(
                                        selected.includes(tag.id)
                                            ? selected.filter((item) => item !== tag.id)
                                            : [...selected, tag.id]
                                    )
                                    setOpen(true)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selected.includes(tag.id as V) ?
                                            "opacity-100" : "opacity-0"
                                    )}
                                />
                                {tag.name}
                            </CommandPrimative.Item>
                        ))}
                    </CommandPrimative.Group>
                </CommandPrimative>
            </PopoverContent>
        </Popover>
    )
}
