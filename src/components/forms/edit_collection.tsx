import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { rspc } from '../../utils/rspc';
import { CreateCollectionArgs, EditCollectionArgs } from '../../../bindings';
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
import { CommandList, Command as CommandPrimative } from 'cmdk';
import { CheckIcon, Command, Pin } from 'lucide-react';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';
import { Switch } from '../ui/switch';

interface EditCollectionProps {
  key: number;
}

export function EditCllectionForm({ key }: EditCollectionProps) {
  const queryClient = rspc.useContext().queryClient;
  const { isLoading: collectionLoading, data: collection_detail } =
    rspc.useQuery(['collections.getOnePinnedStatus', key]);
  const addCollection = rspc.useMutation(['collections.editSingle'], {
    onSuccess: (data) => {
      queryClient.setQueryData(['collections.getById', key], data);
      queryClient.invalidateQueries(['collections.getByUser']);
    },
  });

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: 'Collection name must be at least 2 characters.',
      })
      .max(30, {
        message: 'Collection name must be at most 30 characters.',
      }),
    color: z.string().max(7, {
      message: 'Color must be at most 7 characters.',
    }),
    pinned: z.boolean(),
    public: z.boolean(),
  });
  type FormValues = z.infer<typeof formSchema>;
  if (collectionLoading) {
    return <div>Loading...</div>;
  }
  // 1. Define your form.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: collection_detail?.name,
      color: collection_detail?.color,
      pinned: collection_detail?.pinnedBy.length ? true : false,
      public: collection_detail?.isPublic,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    addCollection.mutate({
      id: key,
      ...values,
    } as EditCollectionArgs);
  }

  // 3. Render the form.
  // TODO: a select for collections then get id from that
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='color'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Color' {...field} />
              </FormControl>
              <FormDescription>color for you collection</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Collection Name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='pinned'
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
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='public'
          render={({ field }) => (
            <FormItem className='flex items-center space-x-2 flex-row pt-1 pb-3'>
              <FormLabel>Public</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  // aria-readonly
                />
              </FormControl>
              {/* <FormDescription>
                The collection you want to add the link to
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Add Link</Button>
      </form>
    </Form>
  );
}
