
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Camera,
  User,
  Smile,
  Image,
  Flame
} from "lucide-react";

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar = "/lovable-uploads/711b54f0-9fd8-47e2-b63e-704304865ed3.png",
  onAvatarChange
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar);
  
  const avatarOptions = [
    {
      url: "/lovable-uploads/711b54f0-9fd8-47e2-b63e-704304865ed3.png",
      label: "Default"
    },
    {
      url: "/lovable-uploads/a004fbed-90d6-44c1-bbf8-96e82ee8c546.png",
      label: "Professional"
    },
    {
      url: "/lovable-uploads/e401f047-a5a0-455c-8e42-9a9d9249d4fb.png",
      label: "Casual"
    }
  ];
  
  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    onAvatarChange(avatarUrl);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="w-24 h-24">
          <AvatarImage src={selectedAvatar} />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" className="mt-2">
          <Camera className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-3">
          <h4 className="text-sm font-medium mb-2">Select Avatar</h4>
          <div className="grid grid-cols-3 gap-2">
            {avatarOptions.map((avatar) => (
              <div
                key={avatar.url}
                className={`cursor-pointer p-1 rounded-md ${selectedAvatar === avatar.url ? 'ring-2 ring-primary' : 'hover:bg-accent'}`}
                onClick={() => handleAvatarSelect(avatar.url)}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={avatar.url} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvatarSelector;
