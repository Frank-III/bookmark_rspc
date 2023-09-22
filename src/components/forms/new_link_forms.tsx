import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { rspc } from '../../utils/rspc';
import { CreateLinkArgs } from '../../../bindings';
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
import { CheckIcon, Command } from 'lucide-react';
import {
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';

export function NewLinkForm() {
  const queryClient = rspc.useContext().queryClient;
  const { data: potentialCollections, isLoading: collectionLoading } = rspc.useQuery([
    'collections.getByUser'], {
      onSuccess: () => {
        console.log(potentialCollections);
      }
    });
  const addLink = rspc.useMutation(['links.create'], {
    onSuccess: () => {
      queryClient.invalidateQueries([
        'links.getByDate',
        new Date().toISOString().slice(0, 10),
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
  });
  type FormValues = z.infer<typeof formSchema>;
  // 1. Define your form.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link_name: 'unnamed-' + new Date().toISOString(),
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    addLink.mutate({
      link_name: values.link_name,
      url: values.url,
      description: values.description || null,
      collection_id: values.collection_id,
    });
  }

  if (collectionLoading) {
    return <div>Loading...</div>;
  }

  // 3. Render the form.
  // TODO: a select for collections then get id from that
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='link_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Link Name' {...field} />
              </FormControl>
              <FormDescription>This is the link name</FormDescription>
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
              <FormDescription>Url to the link</FormDescription>
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
              <FormDescription>Url to the link</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='collection_id'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Collection</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? potentialCollections?.find(
                            (collection) => collection.id === field.value,
                          )?.name
                        : 'Select language'}
                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                      <CommandInput placeholder='Search language...' />
                      {collectionLoading && (
                        <CommandPrimative.Loading>
                          Loading...
                        </CommandPrimative.Loading>
                      )}
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {potentialCollections?.map((collection) => (
                          <CommandItem
                            value={collection.id.toString()}
                            key={`collections+${collection.name}`}
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
                          </CommandItem>
                        ))}
                      </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                The collection you want to add the link to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Add Link</Button>
      </form>
    </Form>
  );
}
