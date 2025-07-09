
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface ReviewItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ReviewSectionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  items: ReviewItem[];
  onItemToggle: (id: string) => void;
  onReset: () => void;
  onMarkAllComplete: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  description,
  icon,
  items,
  onItemToggle,
  onReset,
  onMarkAllComplete
}) => {
  const completedCount = items.filter(item => item.completed).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
            {description && <p className="text-sm text-slate-400">{description}</p>}
          </div>
        </div>
        
        <div className="w-full bg-slate-800/50 rounded-full h-2 mb-4">
          <motion.div 
            className="bg-gradient-to-r from-primary to-orange-500 h-2 rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-slate-400">
          <span>{completedCount} of {items.length} completed</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                item.completed 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/60'
              }`}
            >
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={() => onItemToggle(item.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label 
                htmlFor={item.id} 
                className={`flex-1 text-sm cursor-pointer transition-colors ${
                  item.completed ? 'text-green-400 line-through' : 'text-slate-300'
                }`}
              >
                {item.text}
              </label>
            </motion.div>
          ))}
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-slate-700/30">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700/50"
          >
            Reset
          </Button>
          <Button
            onClick={onMarkAllComplete}
            className="flex-1 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white"
          >
            Mark All Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
