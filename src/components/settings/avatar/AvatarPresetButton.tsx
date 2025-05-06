
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LucideIcon } from "lucide-react";

interface AvatarPresetButtonProps {
  name: string;
  url?: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const AvatarPresetButton: React.FC<AvatarPresetButtonProps> = ({
  name,
  url,
  icon,
  isSelected,
  onClick,
}) => {
  return (
    <button
      className={`p-2 rounded-md ${
        isSelected ? "ring-2 ring-primary" : "hover:bg-accent"
      }`}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12 mx-auto">
        {icon ? (
          <AvatarFallback className="bg-muted">
            {icon}
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src={url} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </>
        )}
      </Avatar>
      <p className="text-xs text-center mt-1">{name}</p>
    </button>
  );
};

export default AvatarPresetButton;
