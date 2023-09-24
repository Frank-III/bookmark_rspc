import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { rspc } from '../../utils/rspc';
import { CreateTagArgs } from '../../../bindings';
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
import { Badge } from '../ui/badge';

export function NewTagForm() {
  const queryClient = rspc.useContext().queryClient;
  const addTag = rspc.useMutation(['tags.edit'], {
    onSuccess: () => {
      // queryClient.setQueriesData(['tags.getB'])
      queryClient.invalidateQueries(['tags.getByUser']);
    },
  });
  const formSchema = z.object({
    tag_name: z
      .string()
      .min(2, {
        message: 'Collection name must be at least 2 characters.',
      })
      .max(30, {
        message: 'Collection name must be at most 30 characters.',
      }),
    color: z.string().length(7, {
      message: 'Color must be 7 characters.',
    }),
  });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: '#327fa8',
    },
  });

  function onSubmit(values: FormValues) {
    addTag.mutate(values as CreateTagArgs);
  }
  const { watch } = form;
  const watchedTagName = watch('tag_name');
  const watchedColor = watch('color');
  // 3. Render the form.
  // TODO: a select for collections then get id from that
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='tag_name'
          render={({ field }) => (
            <FormItem className='flex flex-col w-full mb-3'>
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

        <FormLabel>Preview </FormLabel>
        <div className='mt-1 flex items-center justify-center h-[100px] border'>
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
                        <button className='h-4 w-8'>
                          <Badge style={{ backgroundColor: field.value }}>
                            {watchedTagName ? watchedTagName : 'Tag'}
                          </Badge>
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
        </div>
        <Button type='submit' className='mt-3'>
          Submit
        </Button>
      </form>
    </Form>
  );
}
