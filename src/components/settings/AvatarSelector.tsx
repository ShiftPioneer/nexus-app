
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AvatarDisplay from "./avatar/AvatarDisplay";
import AvatarPresetGrid from "./avatar/AvatarPresetGrid";
import AvatarUrlInput from "./avatar/AvatarUrlInput";
import AvatarUploadButton from "./avatar/AvatarUploadButton";

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (avatarUrl: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  onAvatarChange,
}) => {
  const { toast } = useToast();
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleAvatarSelect = (preset: any) => {
    if (preset.url) {
      onAvatarChange(preset.url);
    } else if (preset.icon) {
      // For icon avatars, we'll create a data URL with the icon name
      onAvatarChange(`icon:${preset.name.toLowerCase()}`);
    }
    toast({
      title: "Avatar Updated",
      description: "Your avatar has been updated.",
    });
  };

  const handleAvatarUrlSubmit = () => {
    if (!avatarUrlInput) return;
    
    onAvatarChange(avatarUrlInput);
    toast({
      title: "Avatar Updated",
      description: "Your avatar has been updated from URL.",
    });
    setShowUrlInput(false);
    setAvatarUrlInput("");
  };

  const handleFileUpload = (file: File) => {    
    // Use FileReader to convert the file to a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onAvatarChange(e.target.result.toString());
        toast({
          title: "Avatar Updated",
          description: "Your avatar has been updated from uploaded image.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <AvatarDisplay currentAvatar={currentAvatar} />
        <div>
          <h4 className="font-medium">Profile Picture</h4>
          <p className="text-sm text-muted-foreground">
            Choose an avatar or upload your own
          </p>
        </div>
      </div>
      
      <AvatarPresetGrid 
        currentAvatar={currentAvatar} 
        onAvatarSelect={handleAvatarSelect} 
      />
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            Use Image URL
          </Button>
          
          <AvatarUploadButton onFileUpload={handleFileUpload} />
        </div>
        
        {showUrlInput && (
          <AvatarUrlInput 
            avatarUrlInput={avatarUrlInput}
            setAvatarUrlInput={setAvatarUrlInput}
            handleAvatarUrlSubmit={handleAvatarUrlSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default AvatarSelector;
