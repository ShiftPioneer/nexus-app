
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { 
  Target, 
  Heart, 
  Sparkles, 
  Star, 
  Lightbulb, 
  Moon, 
  BarChart3, 
  Wrench, 
  PenTool 
} from "lucide-react";

interface ReflectionFieldsProps {
  reflections: {
    intentions: string;
    morningAffirmations: string;
    gratitude: string;
    makeTodayGreat: string;
    highlight: string;
    nightAffirmations: string;
    todayEvaluation: string;
    improvement: string;
    freeThoughts: string;
  };
  onReflectionChange: (field: string, value: string) => void;
}

const ReflectionFields: React.FC<ReflectionFieldsProps> = ({
  reflections,
  onReflectionChange
}) => {
  const fields = [
    {
      key: "intentions",
      label: "Today's Intentions",
      placeholder: "What do you intend to focus on today?",
      icon: Target,
      color: "text-blue-400"
    },
    {
      key: "morningAffirmations",
      label: "3 Morning Affirmations",
      placeholder: "Write three positive affirmations for your morning",
      icon: Sparkles,
      color: "text-purple-400"
    },
    {
      key: "gratitude",
      label: "3 Things I'm Grateful For",
      placeholder: "What are you grateful for today?",
      icon: Heart,
      color: "text-emerald-400"
    },
    {
      key: "makeTodayGreat",
      label: "What Would Make Today Great",
      placeholder: "What actions or events would make today great?",
      icon: Star,
      color: "text-yellow-400"
    },
    {
      key: "highlight",
      label: "Highlight of The Day",
      placeholder: "What was the best moment of your day?",
      icon: Lightbulb,
      color: "text-orange-400"
    },
    {
      key: "nightAffirmations",
      label: "3 Night Affirmations",
      placeholder: "Write three positive affirmations for your evening",
      icon: Moon,
      color: "text-indigo-400"
    },
    {
      key: "todayEvaluation",
      label: "What Made Today Great/Bad",
      placeholder: "Reflect on what went well and what didn't",
      icon: BarChart3,
      color: "text-cyan-400"
    },
    {
      key: "improvement",
      label: "What Can Be Improved/Fixed",
      placeholder: "What can you improve tomorrow?",
      icon: Wrench,
      color: "text-red-400"
    },
    {
      key: "freeThoughts",
      label: "Feel Free",
      placeholder: "Express any additional thoughts or feelings",
      icon: PenTool,
      color: "text-pink-400",
      rows: 5
    }
  ];

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <motion.div 
          key={field.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <field.icon className={`h-4 w-4 ${field.color}`} />
            <Label htmlFor={field.key} className="text-white font-medium">
              {field.label}
            </Label>
          </div>
          <Textarea 
            id={field.key} 
            placeholder={field.placeholder} 
            value={reflections[field.key as keyof typeof reflections]} 
            onChange={e => onReflectionChange(field.key, e.target.value)} 
            rows={field.rows || 3} 
            className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 resize-none transition-all duration-200" 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ReflectionFields;
