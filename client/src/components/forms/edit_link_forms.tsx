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
import { Switch } from '../ui/switch';
import { Command as CommandPrimative } from 'cmdk';
import { CheckIcon, Command, Search } from 'lucide-react';
import { LinkWithTags, EditLinkArgs } from '../../../bindings';
import { MultiSelectTags } from '../buttons/multi_select_tags';
import { StyledButton } from '../buttons/styled_button';
interface EditLinkProps {
  link: LinkWithTags;
}

export function EditLinkForm({ link }: EditLinkProps) {
  const { id, name, url, collectionId, archived, description, tags } = link;
  const queryClient = rspc.useContext().queryClient;

  const { data: potentialCollections, isLoading: collectionLoading } =
    rspc.useQuery(['collections.getByUser']);

  const editLink = rspc.useMutation(['links.editOne'], {
    meta: {
      message: 'Link edited!',
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['links.getByUser']);
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
    archived: z.boolean(),
    collection_id: z.number(),
    tags: z.array(z.number()),
  });

  const tags_id = tags.map((tag) => tag.id);
  type FormValues = z.infer<typeof formSchema>;
  // 1. Define your form.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link_name: name,
      description: description,
      archived: archived,
      url: url,
      collection_id: collectionId,
      tags: tags_id,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const new_tags = values.tags.filter((tag) => !tags_id.includes(tag));
    const deleted_tags = tags_id.filter((tag) => !values.tags.includes(tag));
    editLink.mutate({
      id: id,
      link_name: values.link_name,
      url: values.url,
      description: values.description || null,
      collection_id: values.collection_id,
      new_tags: new_tags,
      deleted_tags: deleted_tags,
      archived: values.archived,
    } as EditLinkArgs);
  }

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
                          value={`${collection.name}`}
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
        <FormField
          control={form.control}
          name='archived'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center pt-1 space-x-2'>
              <FormLabel>Pin Collection</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StyledButton type='submit' className='mt-3'>
          Edit Link
        </StyledButton>
      </form>
    </Form>
  );
}
