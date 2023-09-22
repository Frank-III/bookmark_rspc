
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { rspc } from '../../utils/rspc';
import { CreateCollectionArgs } from '../../../bindings';
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
import { CheckIcon, Command } from 'lucide-react';
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

export function EditCllectionForm({key}: EditCollectionProps) {
  const queryClient = rspc.useContext().queryClient;
  const addCollection = rspc.useMutation(['collections.create'], {
    onSuccess: () => {
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
    pinned: z.boolean().default(false),
    public: z.boolean().default(true),
  });
  type FormValues = z.infer<typeof formSchema>;
  // 1. Define your form.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: '#000000',
      pinned: false,
      public: true,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    addCollection.mutate(values as CreateCollectionArgs);
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
