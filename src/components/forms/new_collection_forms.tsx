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
import { Switch } from '../ui/switch';
import { HexColorPicker } from 'react-colorful';

export function NewCollectionForm() {
  const queryClient = rspc.useContext().queryClient;
  const addCollection = rspc.useMutation(['collections.create'], {
    meta: {
      message: 'Collection created!',
    },
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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: '#000000',
      pinned: false,
      public: true,
    },
  });

  function onSubmit(values: FormValues) {
    addCollection.mutate(values as CreateCollectionArgs);
  }

  // 3. Render the form.
  // TODO: a select for collections then get id from that
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-row  w-full items-end justify-start space-x-2'>
          <FormField
            control={form.control}
            name='color'
            render={({ field }) => (
              <FormItem>
                <div>
                  {/* <FormLabel>Pick Color</FormLabel> */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <button className='shrink-0 rounded-lg border px-2 text-sm h-8 w-8  relative flex flex-row items-center justify-center space-x-1 font-medium'>
                          <div
                            className='rounded-full h-4 w-4'
                            style={{ backgroundColor: field.value }}
                          />
                        </button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <HexColorPicker
                        color={field.value}
                        onChange={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  {/* <FormDescription>color for you collection</FormDescription> */}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='flex flex-col w-full'>
                <FormLabel className='text-sm font-normal text-gray-700'>
                  Name*
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Collection Name'
                    {...field}
                    className='h-8 w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
