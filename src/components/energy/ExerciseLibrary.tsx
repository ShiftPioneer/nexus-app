
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Grid3X3, List, Search } from "lucide-react";
import { ExerciseTemplate } from "@/types/energy";
import { ExerciseFilters } from "./exercise-components/ExerciseFilters";
import { ExerciseCard } from "./exercise-components/ExerciseCard";
import { ExerciseDialog } from "./ExerciseDialog";
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
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseTemplate | null>(null);
  
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroup === "all" || exercise.category === selectedMuscleGroup;
    return matchesSearch && matchesMuscleGroup;
  });

  const handleAddExercise = () => {
    setSelectedExercise(null);
    setExerciseDialogOpen(true);
  };

  const handleEditExercise = (exercise: ExerciseTemplate) => {
    setSelectedExercise(exercise);
    setExerciseDialogOpen(true);
  };

  const handleSaveExercise = (exercise: any) => {
    if (selectedExercise) {
      setExercises(exercises.map(e => e.id === exercise.id ? { ...exercise, ...exercise } : e));
    } else {
      setExercises([...exercises, { 
        ...exercise, 
        id: Date.now().toString(),
        equipment: exercise.equipment || '',
        primaryMuscleGroup: exercise.category,
      }]);
    }
    setExerciseDialogOpen(false);
    setSelectedExercise(null);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter(e => e.id !== exerciseId));
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header Section with Stats */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Exercise Library</h2>
              <p className="text-slate-400">Discover and manage your exercise collection</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{exercises.length}</div>
                <div className="text-xs text-slate-400">Total Exercises</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{muscleGroups.length}</div>
                <div className="text-xs text-slate-400">Muscle Groups</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <Button onClick={handleAddExercise} className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg">
                <Plus size={18} className="mr-2" />
                Add Exercise
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-6">
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
        </div>
        
        {/* Exercise Grid/List */}
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-slate-400">
              Showing {filteredExercises.length} of {exercises.length} exercises
            </div>
            <TabsList className="bg-slate-800/50 border border-white/10">
              <TabsTrigger value="grid" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Grid3X3 size={16} className="mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <List size={16} className="mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="mt-0">
            {filteredExercises.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-12 text-center">
                <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No exercises found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedMuscleGroup("all");
                  setSelectedDifficulty("all");
                }} variant="outline" className="border-white/20 text-slate-300 hover:bg-slate-800/50">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise) => (
                  <ExerciseCard 
                    key={exercise.id} 
                    exercise={exercise} 
                    getMuscleGroupColor={getMuscleGroupColor}
                    view="grid"
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            {filteredExercises.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-12 text-center">
                <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No exercises found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedMuscleGroup("all");
                  setSelectedDifficulty("all");
                }} variant="outline" className="border-white/20 text-slate-300 hover:bg-slate-800/50">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExercises.map((exercise) => (
                  <ExerciseCard 
                    key={exercise.id} 
                    exercise={exercise} 
                    getMuscleGroupColor={getMuscleGroupColor}
                    view="list"
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <ExerciseDialog
        open={exerciseDialogOpen}
        onOpenChange={setExerciseDialogOpen}
        onSave={handleSaveExercise}
        exercise={selectedExercise ? {
          id: selectedExercise.id,
          name: selectedExercise.name,
          category: selectedExercise.category,
          sets: 3,
          reps: 10,
          weight: undefined,
          notes: selectedExercise.description
        } : null}
        exerciseTemplates={exercises}
      />
    </>
  );
}
