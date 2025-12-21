import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Target, Clock, Trophy, Minus, Repeat } from "lucide-react";

const habitSchema = z.object({
  title: z.string().min(1, "Habit name is required"),
  category: z.string(),
  target: z.number().min(1),
  type: z.enum(["daily", "weekly", "monthly"]),
  duration: z.string().optional(),
  scoreValue: z.number().min(1),
  penaltyValue: z.number().min(0),
  dailyTarget: z.number().min(1).optional(),
});

type HabitFormValues = z.infer<typeof habitSchema>;

interface HabitCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitCreate: (habit: Habit) => void;
  initialHabit?: Habit | null;
}

const HabitCreationDialog: React.FC<HabitCreationDialogProps> = ({
  open,
  onOpenChange,
  onHabitCreate,
  initialHabit = null
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: initialHabit?.title || "",
      category: initialHabit?.category || "health",
      target: initialHabit?.target || 21,
      type: initialHabit?.type || "daily",
      duration: initialHabit?.duration || "10 minutes",
      scoreValue: initialHabit?.scoreValue || 5,
      penaltyValue: initialHabit?.penaltyValue || 10,
      dailyTarget: initialHabit?.dailyTarget || 1,
    },
  });

  const handleSubmit = async (values: HabitFormValues) => {
    setIsSubmitting(true);
    try {
      const habit: Habit = {
        id: initialHabit?.id || `habit-${Date.now()}`,
        title: values.title,
        category: values.category as HabitCategory,
        streak: initialHabit?.streak || 0,
        target: values.target,
        status: initialHabit?.status || "pending",
        completionDates: initialHabit?.completionDates || [],
        type: values.type,
        createdAt: initialHabit?.createdAt || new Date(),
        duration: values.duration,
        scoreValue: values.scoreValue,
        penaltyValue: values.penaltyValue,
        dailyTarget: values.dailyTarget || 1,
        todayCompletions: initialHabit?.todayCompletions || 0,
        completionHistory: initialHabit?.completionHistory || []
      };
      await onHabitCreate(habit);
      if (!initialHabit) {
        form.reset();
      }
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: "health", label: "Health", color: "from-green-500 to-emerald-500", icon: "💪" },
    { value: "mindfulness", label: "Mindfulness", color: "from-purple-500 to-indigo-500", icon: "🧘" },
    { value: "learning", label: "Learning", color: "from-blue-500 to-cyan-500", icon: "📚" },
    { value: "productivity", label: "Productivity", color: "from-orange-500 to-red-500", icon: "⚡" },
    { value: "relationships", label: "Relationships", color: "from-pink-500 to-rose-500", icon: "❤️" },
    { value: "finance", label: "Finance", color: "from-yellow-500 to-amber-500", icon: "💰" },
    { value: "religion", label: "Religion", color: "from-violet-500 to-purple-500", icon: "🙏" },
    { value: "other", label: "Other", color: "from-slate-500 to-gray-500", icon: "📌" }
  ];

  const commitmentOptions = [
    { value: 3, label: "3 Days", description: "Quick start" },
    { value: 7, label: "7 Days", description: "One week" },
    { value: 21, label: "21 Days", description: "Build foundation" },
    { value: 30, label: "30 Days", description: "Monthly challenge" },
    { value: 90, label: "90 Days", description: "Serious commitment" },
    { value: 365, label: "365 Days", description: "Full year" },
    { value: 9999, label: "Forever", description: "Lifetime habit" }
  ];

  const watchedCategory = form.watch("category");
  const selectedCategoryData = categoryOptions.find(cat => cat.value === watchedCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-slate-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            {initialHabit ? "Edit Habit" : "Create New Habit"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {initialHabit ? "Update your habit details below." : "Define your new habit to start building consistency and unlock your potential"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            {/* Habit Name */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Habit Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="What habit would you like to build?" 
                      {...field} 
                      className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary text-white placeholder-slate-400"
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">
                    Be specific (e.g., "Meditate for 10 minutes" instead of just "Meditate")
                  </FormDescription>
                  <FormLabel />
                </FormItem>
              )}
            />
            
            {/* Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold">Frequency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700 focus:ring-primary">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="daily" className="text-white hover:bg-slate-800">Daily</SelectItem>
                        <SelectItem value="weekly" className="text-white hover:bg-slate-800">Weekly</SelectItem>
                        <SelectItem value="monthly" className="text-white hover:bg-slate-800">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormLabel />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700 focus:ring-primary">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                              <span>{option.icon}</span>
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormLabel />
                  </FormItem>
                )}
              />
            </div>

            {/* Selected Category Preview */}
            {selectedCategoryData && (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedCategoryData.color} bg-opacity-20`}>
                      <span className="text-xl">{selectedCategoryData.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{selectedCategoryData.label}</h4>
                      <p className="text-sm text-slate-400">Building habits in this category</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Daily Target for Multi-Daily Habits */}
            {form.watch("type") === "daily" && (
              <FormField
                control={form.control}
                name="dailyTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold flex items-center gap-2">
                      <Repeat className="h-4 w-4" />
                      Times Per Day
                    </FormLabel>
                    <FormDescription className="text-slate-500 text-sm">
                      How many times should this habit be completed each day? (e.g., 5 for daily prayers)
                    </FormDescription>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          max={20}
                          {...field}
                          value={field.value || 1}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary text-white w-24"
                        />
                      </FormControl>
                      <span className="text-slate-400 text-sm">times per day</span>
                    </div>
                    <FormLabel />
                  </FormItem>
                )}
              />
            )}

            {/* Duration and Commitment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duration
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 10 minutes" 
                        {...field} 
                        className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary text-white placeholder-slate-400"
                      />
                    </FormControl>
                    <FormLabel />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold">Initial Commitment</FormLabel>
                    <Select value={field.value.toString()} onValueChange={(val) => field.onChange(parseInt(val))}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700 focus:ring-primary">
                          <SelectValue placeholder="Select commitment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        {commitmentOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()} className="text-white hover:bg-slate-800">
                            <div className="flex flex-col">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-xs text-slate-400">{option.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormLabel />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator className="bg-slate-700" />
            
            {/* Gamification Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Gamification Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="scoreValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Reward Points</FormLabel>
                      <FormDescription className="text-slate-500 text-sm">Points earned when completed</FormDescription>
                      <div className="flex items-center">
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary text-white rounded-r-none" 
                          />
                        </FormControl>
                        <div className="bg-slate-800 px-3 py-2 border border-l-0 border-slate-700 rounded-r-md">
                          <span className="text-primary font-medium">points</span>
                        </div>
                      </div>
                      <FormLabel />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="penaltyValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Penalty Points</FormLabel>
                      <FormDescription className="text-slate-500 text-sm">Points lost when missed</FormDescription>
                      <div className="flex items-center">
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary text-white rounded-r-none" 
                          />
                        </FormControl>
                        <div className="bg-slate-800 px-3 py-2 border border-l-0 border-slate-700 rounded-r-md">
                          <span className="text-red-400 font-medium flex items-center gap-1">
                            <Minus className="h-3 w-3" />
                            points
                          </span>
                        </div>
                      </div>
                      <FormLabel />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        
        <DialogFooter className="pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isSubmitting}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <EnhancedButton 
            onClick={form.handleSubmit(handleSubmit)}
            isLoading={isSubmitting}
            icon={Target}
            variant="primary"
          >
            {initialHabit ? "Save Changes" : "Create Habit"}
          </EnhancedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HabitCreationDialog;