
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Check, Brain, Zap, Star } from "lucide-react";

// Predefined productivity-themed avatars with motivation icons
const predefinedAvatars = [
  { name: "Checkmark", icon: Check, color: "#22c55e", background: "bg-green-500" },
  { name: "Star", icon: Star, color: "#f97316", background: "bg-orange-500" },
  { name: "Zap", icon: Zap, color: "#eab308", background: "bg-yellow-500" },
  { name: "Brain", icon: Brain, color: "#8b5cf6", background: "bg-purple-500" },
];

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarChange?: (avatar: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  currentAvatar,
  onAvatarChange
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    // Try to load from localStorage or props
    if (currentAvatar) return currentAvatar;
    const saved = localStorage.getItem("userAvatar");
    return saved || "";
  });
  
  const [activeIcon, setActiveIcon] = useState<number>(0);
  const [inputUrl, setInputUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("preset");
  
  const saveAvatar = (url: string) => {
    setAvatarUrl(url);
    localStorage.setItem("userAvatar", url);
    
    // Notify parent component if callback provided
    if (onAvatarChange) {
      onAvatarChange(url);
    }
    
    // Dispatch an event for other components to listen to
    const event = new CustomEvent('profileUpdated', { 
      detail: { avatar: url } 
    });
    window.dispatchEvent(event);
    
    toast({
      title: "Avatar Updated",
      description: "Your profile avatar has been updated successfully."
    });
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      saveAvatar(inputUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          saveAvatar(event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPredefined = (index: number) => {
    setActiveIcon(index);
    // We'll create a data URL that represents this selection
    saveAvatar(`icon:${predefinedAvatars[index].name}`);
  };

  // Function to render the correct avatar
  const renderAvatar = () => {
    if (!avatarUrl) {
      return (
        <div className={`${predefinedAvatars[activeIcon].background} flex items-center justify-center h-full w-full`}>
          {React.createElement(predefinedAvatars[activeIcon].icon, { 
            className: "h-12 w-12 text-white" 
          })}
        </div>
      );
    }
    
    if (avatarUrl.startsWith('icon:')) {
      const iconName = avatarUrl.replace('icon:', '');
      const avatarData = predefinedAvatars.find(a => a.name === iconName) || predefinedAvatars[0];
      return (
        <div className={`${avatarData.background} flex items-center justify-center h-full w-full`}>
          {React.createElement(avatarData.icon, { 
            className: "h-12 w-12 text-white" 
          })}
        </div>
      );
    }
    
    // If it's a data URL or external URL
    return <AvatarImage src={avatarUrl} alt="Profile Avatar" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Avatar</CardTitle>
        <CardDescription>Choose an avatar that represents your productivity style</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              {renderAvatar()}
              <AvatarFallback className={predefinedAvatars[activeIcon].background}>
                {React.createElement(predefinedAvatars[activeIcon].icon, { 
                  className: "h-12 w-12 text-white" 
                })}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">Current Avatar</span>
          </div>

          <div className="flex-1 w-full md:max-w-md">
            <Tabs defaultValue="preset" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="preset">Presets</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preset" className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {predefinedAvatars.map((avatar, index) => (
                    <div 
                      key={index} 
                      className={`cursor-pointer flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                        activeIcon === index 
                          ? 'bg-secondary border-2 border-primary' 
                          : 'hover:bg-secondary/50'
                      }`}
                      onClick={() => selectPredefined(index)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className={avatar.background}>
                          {React.createElement(avatar.icon, { className: "h-6 w-6 text-white" })}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{avatar.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click on an icon to select it as your avatar
                </p>
              </TabsContent>
              
              <TabsContent value="upload">
                <div className="space-y-4">
                  <div>
                    <Input 
                      id="avatar-upload" 
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Image File
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="url">
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar-url">Image URL</Label>
                    <Input 
                      id="avatar-url" 
                      placeholder="https://example.com/your-avatar.png" 
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={!inputUrl.trim()}>
                    Set Avatar
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarSelector;
