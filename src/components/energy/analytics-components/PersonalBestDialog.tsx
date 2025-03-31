
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PersonalBest } from "@/types/energy";

interface PersonalBestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pb: PersonalBest) => void;
  personalBest?: PersonalBest | null;
}

export function PersonalBestDialog({
  open,
  onOpenChange,
  onSave,
  personalBest = null,
}: PersonalBestDialogProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"kg" | "reps" | "minutes" | "seconds">("kg");
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (personalBest) {
      setExerciseName(personalBest.exerciseName);
      setValue(personalBest.value.toString());
      setUnit(personalBest.unit);
      setDate(personalBest.date);
      setNotes(personalBest.notes || "");
    } else {
      resetForm();
    }
  }, [personalBest, open]);

  const resetForm = () => {
    setExerciseName("");
    setValue("");
    setUnit("kg");
    setDate(new Date());
    setNotes("");
  };

  const handleSave = () => {
    if (!exerciseName || !value) return;

    const newPB: PersonalBest = {
      id: personalBest?.id || Date.now().toString(),
      exerciseName,
      value: parseFloat(value),
      unit,
      date,
      notes,
    };

    onSave(newPB);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {personalBest ? "Edit Personal Best" : "Log New Personal Best"}
          </DialogTitle>
          <DialogDescription>
            Record your personal best performance for an exercise
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="exerciseName" className="text-sm font-medium">
              Exercise Name
            </label>
            <Input
              id="exerciseName"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="e.g., Bench Press"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="value" className="text-sm font-medium">
                Value
              </label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., 100"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="unit" className="text-sm font-medium">
                Unit
              </label>
              <Select value={unit} onValueChange={(value) => setUnit(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="reps">reps</SelectItem>
                  <SelectItem value="minutes">minutes</SelectItem>
                  <SelectItem value="seconds">seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Date Achieved</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this achievement"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!exerciseName || !value}>
            Save Personal Best
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
