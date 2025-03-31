
export interface Workout {
  id: string;
  name: string;
  date: Date;
  duration: number; // in minutes
  caloriesBurned: number;
  exercises: Exercise[];
  notes?: string;
  status: 'Planned' | 'Completed';
}

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  equipment?: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export type MuscleGroup = 
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Back/Legs'
  | 'Cardio'
  | 'Full Body';

export interface ExerciseTemplate {
  id: string;
  name: string;
  category: MuscleGroup;
  equipment?: string;
  description: string;
}
