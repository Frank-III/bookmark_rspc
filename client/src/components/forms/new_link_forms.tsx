import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { rspc } from '../../utils/rspc';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { cn } from '../../utils';
import { Command as CommandPrimative } from 'cmdk';
import { CheckIcon, Search } from 'lucide-react';
import { CreateLinkArgs } from '../../../bindings';
import { MultiSelectTags } from '../buttons/multi_select_tags';

export function NewLinkForm() {
  const queryClient = rspc.useContext().queryClient;
  const { data: potentialCollections, isLoading: collectionLoading } =
    rspc.useQuery(['collections.getByUser']);
  const addLink = rspc.useMutation(['links.create'], {
    meta: {
      message: 'Link created!',
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        'links.getByDate',
        { date: new Date().toISOString().slice(0, 10) },
      ]);
    },
  });
  const formSchema = z.object({
    link_name: z
      .string()
      .min(2, {
        message: 'Link name must be at least 2 characters.',
      })
      .max(30, {
        message: 'Link name must be at most 30 characters.',
      }),
    url: z.string().url({
      message: 'Please enter a valid URL.',
    }),
    description: z.string().optional(),
    collection_id: z.number(),
    tags: z.array(z.number()),
  });
  type FormValues = z.infer<typeof formSchema>;
  // 1. Define your form.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link_name: 'unnamed-' + new Date().toISOString(),
      tags: [],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    addLink.mutate({
      description: values.description || null,
      ...values,
    } as CreateLinkArgs);
  }

  // 3. Render the form.
  // TODO: a select for collections then get id from that
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='py-3'>
        <FormField
          control={form.control}
          name='link_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Link Name' {...field} />
              </FormControl>
              {/* <FormDescription>This is the link name</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder='Url' {...field} />
              </FormControl>
              {/* <FormDescription>Url to the lin</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Discription' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='collection_id'
          render={({ field }) => (
            <FormItem className='py-3 flex flex-col'>
              <FormLabel>Collection</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? potentialCollections?.find(
                            (collection) => collection.id === field.value,
                          )?.name
                        : 'Select collection'}
                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[400px] p-0'>
                  <CommandPrimative className='flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground'>
                    <div
                      className='flex items-center border-b px-3'
                      cmdk-input-wrapper=''
                    >
                      <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
                      <CommandPrimative.Input
                        placeholder='Search Collection...'
                        className='flex h-11 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                      />
                    </div>
                    {collectionLoading && (
                      <CommandPrimative.Loading>
                        Loading...
                      </CommandPrimative.Loading>
                    )}
                    <CommandPrimative.Empty className='py-6 text-center text-sm'>
                      Collection not found.
                    </CommandPrimative.Empty>
                    <CommandPrimative.Group className='overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'>
                      {potentialCollections?.map((collection) => (
                        <CommandPrimative.Item
                          value={collection.id.toString()}
                          key={`collections+${collection.name}`}
                          className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          onSelect={() => {
                            form.setValue('collection_id', collection.id);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              collection.id === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {collection.name}
                        </CommandPrimative.Item>
                      ))}
                    </CommandPrimative.Group>
                  </CommandPrimative>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem className='py-3 flex flex-col'>
              <FormLabel>Tags</FormLabel>
              <MultiSelectTags selected={field.value} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='mt-3'>
          Add Link
        </Button>
      </form>
    </Form>
  );
}
