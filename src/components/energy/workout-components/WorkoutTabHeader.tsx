
import React from "react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, CheckCircle, Plus } from "lucide-react";

interface WorkoutTabHeaderProps {
  activeTab: "workouts" | "exercises";
  onTabChange: (value: "workouts" | "exercises") => void;
  onAddWorkout: () => void;
}

export function WorkoutTabHeader({
  activeTab,
  onTabChange,
  onAddWorkout,
}: WorkoutTabHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <TabsList>
        <TabsTrigger
          value="workouts"
          className="gap-2"
          onClick={() => onTabChange("workouts")}
        >
          <Dumbbell className="h-4 w-4" />
          Workouts
        </TabsTrigger>
        <TabsTrigger
          value="exercises"
          className="gap-2"
          onClick={() => onTabChange("exercises")}
        >
          <CheckCircle className="h-4 w-4" />
          Exercise Library
        </TabsTrigger>
      </TabsList>

      {activeTab === "workouts" && (
        <div className="flex gap-2">
          <Button onClick={onAddWorkout} className="gap-1">
            <Plus size={18} />
            Add Workout
          </Button>
        </div>
      )}
    </div>
  );
}
