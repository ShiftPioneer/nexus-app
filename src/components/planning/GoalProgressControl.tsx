
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, Edit3, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface GoalProgressControlProps {
  currentProgress: number;
  onUpdateProgress: (newProgress: number) => void;
}

const GoalProgressControl: React.FC<GoalProgressControlProps> = ({
  currentProgress,
  onUpdateProgress
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentProgress.toString());

  const handleQuickAdjust = (delta: number) => {
    const newProgress = Math.max(0, Math.min(100, currentProgress + delta));
    onUpdateProgress(newProgress);
  };

  const handleDirectEdit = () => {
    const newProgress = Math.max(0, Math.min(100, parseInt(inputValue) || 0));
    onUpdateProgress(newProgress);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(currentProgress.toString());
    setIsEditing(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Progress</span>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Input
                type="number"
                min="0"
                max="100"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-16 h-7 text-xs bg-slate-800 border-slate-600 text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleDirectEdit();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDirectEdit}
                className="h-6 w-6 p-0 hover:bg-green-500/20 text-green-400"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-400"
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          ) : (
            <>
              <span className="text-lg font-bold text-white">{currentProgress}%</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 hover:bg-slate-700/50 text-slate-400"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Progress value={currentProgress} className="h-2" />
      
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuickAdjust(-10)}
            disabled={currentProgress <= 0}
            className="h-7 w-7 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuickAdjust(-5)}
            disabled={currentProgress <= 0}
            className="h-7 px-2 text-xs hover:bg-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30"
          >
            -5
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuickAdjust(5)}
            disabled={currentProgress >= 100}
            className="h-7 px-2 text-xs hover:bg-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30"
          >
            +5
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuickAdjust(10)}
            disabled={currentProgress >= 100}
            className="h-7 w-7 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalProgressControl;
