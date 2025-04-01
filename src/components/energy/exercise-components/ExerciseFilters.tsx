
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { MuscleGroup } from "@/types/energy";

interface ExerciseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedMuscleGroup: string;
  onMuscleGroupChange: (value: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (value: string) => void;
  muscleGroups: MuscleGroup[];
  difficultyLevels: string[];
}

export function ExerciseFilters({
  searchQuery,
  onSearchChange,
  selectedMuscleGroup,
  onMuscleGroupChange,
  selectedDifficulty,
  onDifficultyChange,
  muscleGroups,
  difficultyLevels
}: ExerciseFiltersProps) {
  return (
    <div className="flex-1 flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Select value={selectedMuscleGroup} onValueChange={onMuscleGroupChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by muscle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Muscles</SelectItem>
          {muscleGroups.map((group) => (
            <SelectItem key={group} value={group}>{group}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Difficulties</SelectItem>
          {difficultyLevels.map((level) => (
            <SelectItem key={level} value={level}>{level}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
