
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Smile, Meh, Frown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface MoodSelectorProps {
  mood: string;
  onMoodChange: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  mood,
  onMoodChange
}) => {
  const moodOptions = [
    { 
      value: "positive", 
      label: "Positive", 
      icon: Smile, 
      color: "text-green-400",
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30"
    },
    { 
      value: "neutral", 
      label: "Neutral", 
      icon: Meh, 
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30"
    },
    { 
      value: "negative", 
      label: "Negative", 
      icon: Frown, 
      color: "text-red-400",
      gradient: "from-red-500/20 to-pink-500/20",
      border: "border-red-500/30"
    },
    { 
      value: "mixed", 
      label: "Mixed", 
      icon: Sparkles, 
      color: "text-orange-400",
      gradient: "from-orange-500/20 to-yellow-500/20",
      border: "border-orange-500/30"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Smile className="h-4 w-4 text-primary" />
        <Label className="text-white font-medium">How are you feeling?</Label>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {moodOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="button"
              onClick={() => onMoodChange(option.value)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                mood === option.value
                  ? `bg-gradient-to-r ${option.gradient} ${option.border} shadow-lg`
                  : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                mood === option.value
                  ? `bg-gradient-to-r ${option.gradient}`
                  : "bg-slate-700/50"
              }`}>
                <option.icon 
                  size={16} 
                  className={mood === option.value ? option.color : "text-slate-400"} 
                />
              </div>
              <span className={`font-medium ${
                mood === option.value ? "text-white" : "text-slate-300"
              }`}>
                {option.label}
              </span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
