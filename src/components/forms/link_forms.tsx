import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { rspc } from '../../utils/rspc';
import { CreateLinkArgs } from '../../../bindings';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

export function NewLinkForm() {
  const queryClient = rspc.useContext().queryClient;
  const addNewLink = rspc.useMutation(['links.create'], {
    onSuccess: () => {
      queryClient.invalidateQueries(["links.getByDate", new Date().toISOString().slice(0, 10)]);
    }
  });
  const formSchema = z.object({
    link_name: z.string().min(2, {
      message: 'Link name must be at least 2 characters.',
    }).max(30, {
      message: 'Link name must be at most 30 characters.',
    }),
    url: z.string().url({
      message: 'Please enter a valid URL.',
    }),
    description: z.string().nullable(),
    collection_id: z.number(),
  });
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link_name: 'unnamed-' + new Date().toISOString(),
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateLinkArgs) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    addNewLink.mutate(values);
  }

  // 3. Render the form.
  // TODO: a select for collections then get id from that
  return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="link_name"
        render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Link Name" {...field} />
              </FormControl>
              <FormDescription>
                This is the link name 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="Url" {...field} />
              </FormControl>
              <FormDescription>
                Url to the link 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

    </form>
  </Form>
  )
}
