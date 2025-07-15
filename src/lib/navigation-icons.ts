
import {
  Home,
  CheckSquare,
  Clock,
  Target,
  Brain,
  BookOpen,
  Crosshair,
  Zap,
  CheckCircle2,
  Repeat,
  Pencil,
} from "lucide-react";

export const navigationIcons = {
  dashboard: Home,
  gtd: CheckSquare,
  actions: CheckCircle2,
  timeDesign: Clock,
  planning: Target,
  habits: Repeat,
  focus: Crosshair,
  mindset: Brain,
  knowledge: BookOpen,
  journal: Pencil,
  energy: Zap,
} as const;

export type NavigationIconKey = keyof typeof navigationIcons;
