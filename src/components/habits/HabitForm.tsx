
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Habit interface
interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  type: "daily" | "weekly" | "monthly";
  completedToday: boolean;
  accountabilityScore: number;
}

interface HabitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addHabit: (habit: Habit) => void;
  initialHabit?: Habit;
}

const habitSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  target: z.coerce.number().int().min(1, "Target must be at least 1"),
  type: z.enum(["daily", "weekly", "monthly"]),
});

type HabitFormValues = z.infer<typeof habitSchema>;

const HabitForm: React.FC<HabitFormProps> = ({
  open,
  onOpenChange,
  addHabit,
  initialHabit,
}) => {
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: initialHabit || {
      title: "",
      category: "health",
      target: 21,
      type: "daily",
    },
  });

  const onSubmit = (data: HabitFormValues) => {
    setSubmitting(true);
    try {
      const newHabit: Habit = {
        id: initialHabit?.id || "",
        title: data.title,
        category: data.category,
        streak: initialHabit?.streak || 0,
        target: data.target,
        status: initialHabit?.status || "pending",
        type: data.type,
        completedToday: initialHabit?.completedToday || false,
        accountabilityScore: initialHabit?.accountabilityScore || 0,
      };
      
      addHabit(newHabit);
      form.reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialHabit ? "Edit Habit" : "Add New Habit"}</DialogTitle>
          <DialogDescription>
            {initialHabit 
              ? "Update your habit details below." 
              : "Create a new habit to track. It takes 21 days to form a habit!"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Drink water" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="productivity">Productivity</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="relationships">Relationships</SelectItem>
                      <SelectItem value="religion">Religion</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Days</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
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
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Saving..." : initialHabit ? "Update Habit" : "Add Habit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
