
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Zap, Brain, Check, Star, Trophy, Flame, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }
    
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

  const renderIcon = (iconName: string) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
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
        <div>
          <h4 className="font-medium">Profile Picture</h4>
          <p className="text-sm text-muted-foreground">
            Choose an avatar or upload your own
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {avatarPresets.map((preset, index) => (
          <button
            key={index}
            className={`p-2 rounded-md ${
              (preset.url === currentAvatar || 
               (preset.name && currentAvatar?.includes(preset.name.toLowerCase()))) 
                ? "ring-2 ring-primary" 
                : "hover:bg-accent"
            }`}
            onClick={() => handleAvatarSelect(preset)}
          >
            <Avatar className="h-12 w-12 mx-auto">
              {preset.icon ? (
                <AvatarFallback className="bg-muted">
                  {preset.icon}
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={preset.url} alt={preset.name} />
                  <AvatarFallback>{preset.name.charAt(0)}</AvatarFallback>
                </>
              )}
            </Avatar>
            <p className="text-xs text-center mt-1">{preset.name}</p>
          </button>
        ))}
      </div>
      
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
          
          <div className="relative">
            <Button
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              Upload Image
            </Button>
            <input 
              id="avatar-upload"
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
        
        {showUrlInput && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Enter image URL"
              className="flex-1 px-3 py-1 border rounded-md text-sm"
              value={avatarUrlInput}
              onChange={(e) => setAvatarUrlInput(e.target.value)}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAvatarUrlSubmit}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarSelector;
