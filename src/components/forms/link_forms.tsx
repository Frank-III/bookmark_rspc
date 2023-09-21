'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { rspc } from '../../utils/rspc';
import { CreateLinkArgs } from '../../../bindings';

export function NewLinkForm() {
  // const queryClient = rspc.useContext().queryClient;
  // const addNewLink = rspc.useMutation(['links.create'], {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["links.getByDate", new Date().toISOString().slice(0, 10)]);
  //   }
  // });
  const formSchema = z.object({
    link_name: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    url: z.string().url({
      message: 'Please enter a valid URL.',
    }),
    description: z.string().nullable(),
    collection_id: z.number(),
  });
  // 1. Define your form.
  const form = useForm<CreateLinkArgs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link_name: 'unnamed-' + new Date().toISOString(),
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateLinkArgs) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  // 3. Render the form.
  // TODO: a select for collections then get id from that
}
