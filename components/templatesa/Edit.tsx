'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Training } from '@prisma/client';

export interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  description: string;
  validation: z.ZodTypeAny;
  type: 'text' | 'dropdown' | 'checkbox';
  options?: { value: string; label: string }[];
}

interface EditFormProps {
  title: string;
  description: string;
  fields: FieldConfig[];
  onSubmit: (values: Record<string, any>) => void;
  submitButtonLabel: string;
  initialData: Training;
}

export default function EditForm({
  title,
  description,
  fields,
  onSubmit,
  submitButtonLabel,
  initialData,
}: EditFormProps) {
  const schema = z.object(
    fields.reduce(
      (acc, field) => {
        acc[field.name] = field.validation;
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    )
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  return (
    <div className='flex min-h-[60vh] h-full w-full items-center justify-center px-4'>
      <Card className='mx-auto max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8 max-w-3xl mx-auto py-10'
            >
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.type === 'dropdown' && field.options ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='outline'
                                className='w-full justify-between'
                              >
                                {formField.value
                                  ? field.options.find(
                                      (option) =>
                                        option.value === formField.value
                                    )?.label
                                  : field.placeholder}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-full'>
                              {field.options.map((option) => (
                                <DropdownMenuItem
                                  key={option.value}
                                  onClick={() =>
                                    formField.onChange(option.value)
                                  }
                                  className='w-full'
                                >
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : field.type === 'checkbox' ? (
                          <div className='flex items-center space-x-2'>
                            <input
                              type='checkbox'
                              checked={formField.value}
                              onChange={(e) =>
                                formField.onChange(e.target.checked)
                              }
                              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                            />
                            <span>{field.placeholder}</span>
                          </div>
                        ) : (
                          <Input
                            placeholder={field.placeholder}
                            {...formField}
                          />
                        )}
                      </FormControl>
                      <FormDescription>{field.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type='submit'>{submitButtonLabel}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
