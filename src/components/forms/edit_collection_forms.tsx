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
import { Switch } from '../ui/switch';
import { HexColorPicker } from 'react-colorful';
import { CollectionPinned } from '../links/collection_lists';
import React from 'react';

interface EditCollectionProps {
  collection: CollectionPinned;
}

export function EditCllectionForm({ collection }: EditCollectionProps) {
  const { id, color, name, isPinned, isPublic } = collection;
  const queryClient = rspc.useContext().queryClient;
  const editCollection = rspc.useMutation(['collections.editSingle'], {
    onSuccess: (data) => {
      queryClient.setQueryData(['collections.getById', id], data);
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      color: color,
      pinned: isPinned,
      public: isPublic,
    },
  });

  function onSubmit(values: FormValues) {
    console.log('aaaaaa');
    editCollection.mutate({
      id: id,
      ...values,
    } as EditCollectionArgs);
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
                  aria-readonly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
