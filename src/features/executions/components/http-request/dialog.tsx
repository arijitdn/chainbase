"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JsonEditor } from "./json-editor";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*/, {
      message:
        "Variable name must start with a letter or underscore and container only letters, numbers, and underscores",
    }),
  endpoint: z
    .string({
      message: "Please enter a valid url",
    })
    .min(1),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export type HTTPRequestFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<HTTPRequestFormValues>;
}

export const HTTPRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<HTTPRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        endpoint: defaultValues.endpoint || "",
        method: defaultValues.method || "GET",
        body: defaultValues.body || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName");
  const watchMethod = form.watch("method");
  const showBody = ["POST", "PUT", "PATCH"].includes(watchMethod);

  const handleSubmit = (values: HTTPRequestFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP request node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col overflow-hidden"
          >
            <div className="space-y-8 mt-4 overflow-y-auto pr-2">
              <FormField
                control={form.control}
                name="variableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable Name</FormLabel>
                    <FormControl>
                      <Input placeholder="myApiCall" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use this name to reference the result in other nodes{" "}
                      <span className="font-mono">{`{{${watchVariableName || "myApiCall"}.response.data}}`}</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The HTTP method to use for this request
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://api.example.com/v1/users/{{response.data.id}}"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Static URL or use{" "}
                      <span className="font-mono">{"{{variables}}"}</span> for
                      simple values or{" "}
                      <span className="font-mono">{"{{json variable}}"}</span>{" "}
                      to stringify objects
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showBody && (
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Body</FormLabel>
                      <JsonEditor
                        placeholder={`{\n "userId": "{{response.data.id}}",\n "items": "{{response.data.items}}"\n}`}
                        className="h-[120px] font-mono text-sm"
                        {...field}
                      />
                      <FormDescription>
                        JSON with template variables. Use {"{{variables}}"} for
                        simple values or {"{{json variable}}"} to stringify
                        objects
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter className="mt-4 shrink-0">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
