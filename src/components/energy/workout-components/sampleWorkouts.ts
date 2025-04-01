
import { Workout } from "@/types/energy";

export const sampleWorkouts: Workout[] = [
  {
    id: "1",
    name: "Upper Body Strength",
    date: new Date("2023-12-20T10:00:00"),
    duration: 60,
    caloriesBurned: 350,
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        category: "Chest",
        equipment: "Barbell",
        sets: 4,
        reps: 8,
        weight: 80,
        exerciseType: "Weight Reps",
        notes: "Focus on controlled descent"
      },
      {
        id: "e2",
        name: "Pull-ups",
        category: "Back",
        exerciseType: "Reps Only",
        sets: 4,
        reps: 10
      },
      {
        id: "e3",
        name: "Shoulder Press",
        category: "Shoulders",
        equipment: "Dumbbells",
        exerciseType: "Weight Reps",
        sets: 3,
        reps: 10,
        weight: 20
      }
    ],
    status: "Completed"
  },
  {
    id: "2",
    name: "Lower Body Focus",
    date: new Date("2023-12-22T11:00:00"),
    duration: 55,
    caloriesBurned: 400,
    exercises: [
      {
        id: "e1",
        name: "Squats",
        category: "Legs",
        equipment: "Barbell",
        exerciseType: "Weight Reps",
        sets: 4,
        reps: 10,
        weight: 100
      },
      {
        id: "e2",
        name: "Romanian Deadlift",
        category: "Back/Legs",
        equipment: "Barbell",
        exerciseType: "Weight Reps",
        sets: 3,
        reps: 12,
        weight: 80
      },
      {
        id: "e3",
        name: "Plank",
        category: "Core",
        exerciseType: "Duration",
        sets: 3,
        reps: 1,
        duration: 60 // seconds
      }
    ],
    status: "Planned"
  }
];
