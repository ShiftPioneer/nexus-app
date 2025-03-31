
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExerciseTemplate, MuscleGroup } from "@/types/energy";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Search, Plus, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const sampleExercises: ExerciseTemplate[] = [
  {
    id: "1",
    name: "Bench Press",
    category: "Chest",
    equipment: "Barbell, Bench",
    description: "Lie on a bench and press the weight upward until arms are extended."
  },
  {
    id: "2",
    name: "Deadlift",
    category: "Back/Legs",
    equipment: "Barbell",
    description: "Lift a barbell from the ground to hip level with a straight back."
  },
  {
    id: "3",
    name: "Squat",
    category: "Legs",
    equipment: "Barbell, Squat Rack",
    description: "Lower your body by bending your knees and then return to standing position."
  },
  {
    id: "4",
    name: "Pull-up",
    category: "Back",
    equipment: "Pull-up Bar",
    description: "Hang from a bar and pull your body upward until chin is over the bar."
  },
  {
    id: "5",
    name: "Shoulder Press",
    category: "Shoulders",
    equipment: "Dumbbells",
    description: "Press weights overhead from shoulder level until arms are fully extended."
  },
  {
    id: "6",
    name: "Bicep Curl",
    category: "Arms",
    equipment: "Dumbbells",
    description: "Curl weights up toward shoulders while keeping elbows stationary."
  }
];

const muscleGroups: MuscleGroup[] = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Back/Legs",
  "Cardio",
  "Full Body"
];

const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

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
  
  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors: Record<string, string> = {
      "Chest": "bg-red-100 text-red-800",
      "Back": "bg-blue-100 text-blue-800",
      "Legs": "bg-green-100 text-green-800",
      "Shoulders": "bg-purple-100 text-purple-800",
      "Arms": "bg-amber-100 text-amber-800",
      "Core": "bg-indigo-100 text-indigo-800",
      "Back/Legs": "bg-cyan-100 text-cyan-800",
      "Cardio": "bg-pink-100 text-pink-800",
      "Full Body": "bg-violet-100 text-violet-800"
    };
    
    return colors[muscleGroup] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
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
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
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
              <Card key={exercise.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">{exercise.name}</h3>
                    <span className={cn("text-xs px-2 py-1 rounded-md", getMuscleGroupColor(exercise.category))}>
                      {exercise.category}
                    </span>
                  </div>
                  
                  {exercise.equipment && (
                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="font-medium">Equipment:</span> {exercise.equipment}
                    </p>
                  )}
                  
                  <p className="text-sm mb-4">{exercise.description}</p>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <PlayCircle className="h-4 w-4" />
                      Watch Demo
                    </Button>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add to Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <div className="space-y-2">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted rounded-full p-2">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">{exercise.equipment}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs px-2 py-1 rounded-md", getMuscleGroupColor(exercise.category))}>
                        {exercise.category}
                      </span>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-3 w-3" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
