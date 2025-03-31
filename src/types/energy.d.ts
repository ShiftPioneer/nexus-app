
export interface Workout {
  id: string;
  name: string;
  date: Date;
  duration: number; // in minutes
  caloriesBurned: number;
  exercises: Exercise[];
  notes?: string;
  status: 'Planned' | 'Completed';
  tracking?: WorkoutTracking;
}

export interface WorkoutTracking {
  startTime?: Date;
  endTime?: Date;
  exerciseProgress: Record<string, ExerciseProgress>;
}

export interface ExerciseProgress {
  completed: boolean;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  exerciseType?: ExerciseType;
  equipment?: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  distance?: number;
  notes?: string;
  imageUrl?: string;
}

export type ExerciseType = 
  | 'Weight Reps' 
  | 'Reps Only' 
  | 'Weighted Bodyweight' 
  | 'Assisted Bodyweight' 
  | 'Duration' 
  | 'Weight & Duration' 
  | 'Distance & Duration';

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
  exerciseType?: ExerciseType;
  imageUrl?: string;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups?: MuscleGroup[];
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
