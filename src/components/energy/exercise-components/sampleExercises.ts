
import { ExerciseTemplate, MuscleGroup } from "@/types/energy";

export const sampleExercises: ExerciseTemplate[] = [
  {
    id: "1",
    name: "Bench Press",
    category: "Chest",
    equipment: "Barbell, Bench",
    description: "Lie on a bench and press the weight upward until arms are extended.",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Arms"]
  },
  {
    id: "2",
    name: "Deadlift",
    category: "Back/Legs",
    equipment: "Barbell",
    description: "Lift a barbell from the ground to hip level with a straight back.",
    primaryMuscleGroup: "Back/Legs",
    secondaryMuscleGroups: ["Legs", "Arms"]
  },
  {
    id: "3",
    name: "Squat",
    category: "Legs",
    equipment: "Barbell, Squat Rack",
    description: "Lower your body by bending your knees and then return to standing position.",
    primaryMuscleGroup: "Legs",
    secondaryMuscleGroups: ["Core"]
  },
  {
    id: "4",
    name: "Pull-up",
    category: "Back",
    equipment: "Pull-up Bar",
    description: "Hang from a bar and pull your body upward until chin is over the bar.",
    primaryMuscleGroup: "Back",
    secondaryMuscleGroups: ["Arms"]
  },
  {
    id: "5",
    name: "Shoulder Press",
    category: "Shoulders",
    equipment: "Dumbbells",
    description: "Press weights overhead from shoulder level until arms are fully extended.",
    primaryMuscleGroup: "Shoulders",
    secondaryMuscleGroups: ["Arms"]
  },
  {
    id: "6",
    name: "Bicep Curl",
    category: "Arms",
    equipment: "Dumbbells",
    description: "Curl weights up toward shoulders while keeping elbows stationary.",
    primaryMuscleGroup: "Arms",
    secondaryMuscleGroups: []
  }
];

export const muscleGroups: MuscleGroup[] = [
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

export const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

export const getMuscleGroupColor = (muscleGroup: string) => {
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
