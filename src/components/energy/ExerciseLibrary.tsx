
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { ExerciseTemplate } from "@/types/energy";
import { ExerciseFilters } from "./exercise-components/ExerciseFilters";
import { ExerciseCard } from "./exercise-components/ExerciseCard";
import { 
  sampleExercises, 
  muscleGroups, 
  difficultyLevels, 
  getMuscleGroupColor 
} from "./exercise-components/sampleExercises";

export function ExerciseLibrary() {
  const [exercises, setExercises] = useState<ExerciseTemplate[]>(sampleExercises);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroup === "all" || exercise.category === selectedMuscleGroup;
    // In a real implementation, exercises would have a difficulty property
    return matchesSearch && matchesMuscleGroup;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <ExerciseFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedMuscleGroup={selectedMuscleGroup}
          onMuscleGroupChange={setSelectedMuscleGroup}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          muscleGroups={muscleGroups}
          difficultyLevels={difficultyLevels}
        />
        
        <Button className="gap-1">
          <Plus size={18} />
          Add Exercise
        </Button>
      </div>
      
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => (
              <ExerciseCard 
                key={exercise.id} 
                exercise={exercise} 
                getMuscleGroupColor={getMuscleGroupColor}
                view="grid"
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <div className="space-y-2">
            {filteredExercises.map((exercise) => (
              <ExerciseCard 
                key={exercise.id} 
                exercise={exercise} 
                getMuscleGroupColor={getMuscleGroupColor}
                view="list"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
