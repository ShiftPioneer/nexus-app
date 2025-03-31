
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

// Added for analytics
export interface BodyMeasurement {
  id: string;
  date: Date;
  weight?: number; // in kg
  bodyFat?: number; // percentage
  chest?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  arms?: number; // in cm
  thighs?: number; // in cm
}

export interface WorkoutGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number; // percentage
  type: 'Strength' | 'Endurance' | 'Weight Loss' | 'Muscle Gain' | 'Other';
}

export interface PersonalBest {
  id: string;
  exerciseName: string;
  value: number; // weight, reps, time, etc.
  unit: 'kg' | 'reps' | 'minutes' | 'seconds';
  date: Date;
  notes?: string;
}
