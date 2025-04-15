"use client"
import {
  useState
} from "react"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Check,
  ChevronsUpDown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const formSchema = z.object({
  title: z.string().min(2, { message: 'El titulo debe ser mas largo' }),
  description: z.string().min(5, { message: 'La descripcion debe ser mas larga' }),
  instructor: z.string()
});

export default function CreateTraining() {
  const languages = [{
      label: "Julio",
      value: "en"
    },
    {
      label: "Daniel",
      value: "fr"
    },
    {
      label: "German",
      value: "de"
    },
    {
      label: "Valentina",
      value: "es"
    },
  ] as
  const;
  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),

  })

  function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      console.log(values);
      toast.success('Your message has been sent successfully!')
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="flex min-h-[60vh] h-full w-full items-center justify-center px-4">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl">Nueva capacitacion</CardTitle>
                <CardDescription>
                  Por favor complete el formulario con los datos de la nueva capacitacion.
                </CardDescription>
            </CardHeader>
            <CardContent>

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                    
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                            <Input 
                            placeholder="Título"
                            
                            type="text"
                            {...field} />
                        </FormControl>
                        <FormDescription>Ingrese el nombre de la nueva capacitación.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                            <Input 
                            placeholder="Descripción"
                            
                            type="text"
                            {...field} />
                        </FormControl>
                        <FormDescription>Informacion sobre la capacitacio.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Instructor</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                                
                                >
                                {field.value
                                    ? languages.find(
                                        (language) => language.value === field.value
                                    )?.label
                                    : "Nombre instructor"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Buscar instructor..." />
                                <CommandList>
                                <CommandEmpty>Pareces perdido.</CommandEmpty>
                                <CommandGroup>
                                    {languages.map((language) => (
                                    <CommandItem
                                        value={language.label}
                                        key={language.value}
                                        onSelect={() => {
                                        form.setValue("instructor", language.value);
                                        }}
                                    >
                                        <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            language.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                        />
                                        {language.label}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                            </Command>
                            </PopoverContent>
                        </Popover>
                        <FormDescription>Selecciona el instructor encargado para esta capacitación</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Crear</Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}