
import React from "react";
import { Zap, Brain, Check, Star, Flame, Trophy, BookOpen } from "lucide-react";
import AvatarPresetButton from "./AvatarPresetButton";

interface AvatarPresetGridProps {
  currentAvatar: string;
  onAvatarSelect: (preset: { name: string; url?: string; icon?: React.ReactNode }) => void;
}

const AvatarPresetGrid: React.FC<AvatarPresetGridProps> = ({
  currentAvatar,
  onAvatarSelect,
}) => {
  const avatarPresets = [
    { name: "Default", url: "/avatar-1.png" },
    { name: "Flame", icon: <Flame className="h-10 w-10 text-orange-500" /> },
    { name: "Zap", icon: <Zap className="h-10 w-10 text-yellow-500" /> },
    { name: "Check", icon: <Check className="h-10 w-10 text-green-500" /> },
    { name: "Brain", icon: <Brain className="h-10 w-10 text-purple-500" /> },
    { name: "Star", icon: <Star className="h-10 w-10 text-amber-500" /> },
    { name: "Trophy", icon: <Trophy className="h-10 w-10 text-blue-500" /> },
    { name: "BookOpen", icon: <BookOpen className="h-10 w-10 text-indigo-500" /> },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {avatarPresets.map((preset, index) => (
        <AvatarPresetButton
          key={index}
          name={preset.name}
          url={preset.url}
          icon={preset.icon}
          isSelected={
            (preset.url === currentAvatar || 
            (preset.name && currentAvatar?.includes(preset.name.toLowerCase())))
          }
          onClick={() => onAvatarSelect(preset)}
        />
      ))}
    </div>
  );
};

export default AvatarPresetGrid;
