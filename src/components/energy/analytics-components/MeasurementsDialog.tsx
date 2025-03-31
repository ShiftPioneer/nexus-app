
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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BodyMeasurement } from "@/types/energy";

interface MeasurementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (measurement: BodyMeasurement) => void;
  measurement?: BodyMeasurement | null;
}

export function MeasurementsDialog({
  open,
  onOpenChange,
  onSave,
  measurement = null,
}: MeasurementsDialogProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [arms, setArms] = useState("");
  const [thighs, setThighs] = useState("");

  useEffect(() => {
    if (measurement) {
      setDate(measurement.date);
      setWeight(measurement.weight?.toString() || "");
      setBodyFat(measurement.bodyFat?.toString() || "");
      setChest(measurement.chest?.toString() || "");
      setWaist(measurement.waist?.toString() || "");
      setHips(measurement.hips?.toString() || "");
      setArms(measurement.arms?.toString() || "");
      setThighs(measurement.thighs?.toString() || "");
    } else {
      resetForm();
    }
  }, [measurement, open]);

  const resetForm = () => {
    setDate(new Date());
    setWeight("");
    setBodyFat("");
    setChest("");
    setWaist("");
    setHips("");
    setArms("");
    setThighs("");
  };

  const handleSave = () => {
    const newMeasurement: BodyMeasurement = {
      id: measurement?.id || Date.now().toString(),
      date,
      weight: weight ? parseFloat(weight) : undefined,
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
      arms: arms ? parseFloat(arms) : undefined,
      thighs: thighs ? parseFloat(thighs) : undefined,
    };

    onSave(newMeasurement);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {measurement ? "Edit Measurement" : "Log New Measurement"}
          </DialogTitle>
          <DialogDescription>
            Track your body measurements over time to monitor your progress
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="weight" className="text-sm font-medium">
                Weight (kg)
              </label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 70"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="bodyFat" className="text-sm font-medium">
                Body Fat %
              </label>
              <Input
                id="bodyFat"
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="e.g., 15"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="chest" className="text-sm font-medium">
                Chest (cm)
              </label>
              <Input
                id="chest"
                type="number"
                step="0.1"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                placeholder="e.g., 95"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="waist" className="text-sm font-medium">
                Waist (cm)
              </label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="e.g., 80"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label htmlFor="hips" className="text-sm font-medium">
                Hips (cm)
              </label>
              <Input
                id="hips"
                type="number"
                step="0.1"
                value={hips}
                onChange={(e) => setHips(e.target.value)}
                placeholder="e.g., 100"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="arms" className="text-sm font-medium">
                Arms (cm)
              </label>
              <Input
                id="arms"
                type="number"
                step="0.1"
                value={arms}
                onChange={(e) => setArms(e.target.value)}
                placeholder="e.g., 35"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="thighs" className="text-sm font-medium">
                Thighs (cm)
              </label>
              <Input
                id="thighs"
                type="number"
                step="0.1"
                value={thighs}
                onChange={(e) => setThighs(e.target.value)}
                placeholder="e.g., 55"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Measurements</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
