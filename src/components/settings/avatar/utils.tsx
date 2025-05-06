
import React from "react";
import { Zap, Brain, Check, Star, Flame, Trophy, BookOpen } from "lucide-react";

export const renderIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'flame': return <Flame className="h-8 w-8 text-orange-500" />;
    case 'zap': return <Zap className="h-8 w-8 text-yellow-500" />;
    case 'check': return <Check className="h-8 w-8 text-green-500" />;
    case 'brain': return <Brain className="h-8 w-8 text-purple-500" />;
    case 'star': return <Star className="h-8 w-8 text-amber-500" />;
    case 'trophy': return <Trophy className="h-8 w-8 text-blue-500" />;
    case 'bookopen': return <BookOpen className="h-8 w-8 text-indigo-500" />;
    default: return <Zap className="h-8 w-8 text-yellow-500" />;
  }
};
