import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// Update imports to use the correct type
import { Resource } from "@/types/knowledge";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  url: z.string().optional(),
  type: z.enum(["article", "video", "book", "course", "other"]),
  notes: z.string().optional(),
  tags: z.string().array(),
});

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceCreate: (resource: Resource) => void;
  existingResources: Resource[];
  existingResource?: Resource;
}

const ResourceDialog: React.FC<ResourceDialogProps> = ({
  open,
  onOpenChange,
  onResourceCreate,
  existingResources,
  existingResource,
}) => {
  const { toast } = useToast();

  // Update all references to match the Resource interface
  const initialData = existingResource
    ? {
        title: existingResource.title,
        url: existingResource.url || "",
        type: existingResource.type,
        notes: existingResource.notes || "",
        tags: existingResource.tags
      }
    : {
        title: "",
        url: "",
        type: "article" as const,
        notes: "",
        tags: []
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Make sure the created resource object matches the Resource interface
    const resource: Resource = {
      id: existingResource?.id || uuidv4(),
      title: form.title,
      url: form.url || undefined,
      type: form.type,
      notes: form.notes || undefined,
      tags: form.tags,
      dateAdded: existingResource?.dateAdded || new Date(),
      pinned: existingResource?.pinned || false,
      completed: existingResource?.completed || false
    };

    onResourceCreate(resource);
    toast({
      title: "Resource Created",
      description: "Your resource has been created.",
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {existingResource ? "Edit Resource" : "Create New Resource"}
          </DialogTitle>
          <DialogDescription>
            {existingResource
              ? "Edit your resource here. Click save when you're done."
              : "Add a new resource to your knowledge base."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Resource Title" {...field} />
                  </FormControl>
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
                    <Input placeholder="https://resource-url.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Resource Notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-1">
                    {field.value.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => {
                            form.setValue(
                              "tags",
                              field.value.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        placeholder="Add a tag"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (
                              e.target.value &&
                              !field.value.includes(e.target.value)
                            ) {
                              form.setValue("tags", [
                                ...field.value,
                                e.target.value,
                              ]);
                            }
                            e.target.value = "";
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {existingResource ? "Update Resource" : "Create Resource"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDialog;
