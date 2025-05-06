
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { renderIcon } from "./utils";

interface AvatarDisplayProps {
  currentAvatar: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ currentAvatar }) => {
  return (
    <Avatar className="h-16 w-16">
      {currentAvatar?.startsWith('icon:') ? (
        <AvatarFallback className="bg-muted">
          {renderIcon(currentAvatar.replace('icon:', ''))}
        </AvatarFallback>
      ) : (
        <>
          <AvatarImage src={currentAvatar} alt="Avatar" />
          <AvatarFallback>
            {currentAvatar ? currentAvatar.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </>
      )}
    </Avatar>
  );
};

export default AvatarDisplay;
