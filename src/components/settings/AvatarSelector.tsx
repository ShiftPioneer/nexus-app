
import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, Star, User, Flame, Brain, BarChart3, Clock, Calendar, Target } from "lucide-react";

// Updated avatars with productivity-themed icons
const PRODUCTIVITY_AVATARS = [
  // Custom app-themed avatars
  "/lovable-uploads/6bf766fd-bbfc-4672-a544-c599f8ea80fb.png",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Focus&backgroundColor=e63946",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Brain&backgroundColor=8ecae6",
  "https://api.dicebear.com/7.x/shapes/svg?seed=Productive&backgroundColor=ffb703",
  "https://api.dicebear.com/7.x/identicon/svg?seed=zap&backgroundColor=ffd700",
  "https://api.dicebear.com/7.x/identicon/svg?seed=flame&backgroundColor=ff4500",
  "https://api.dicebear.com/7.x/identicon/svg?seed=star&backgroundColor=06d6a0",
  "https://api.dicebear.com/7.x/identicon/svg?seed=check&backgroundColor=ef476f",
  "https://api.dicebear.com/7.x/identicon/svg?seed=rocket&backgroundColor=118ab2",
  "https://api.dicebear.com/7.x/identicon/svg?seed=circle&backgroundColor=073b4c",
];

const AVATAR_COLORS = [
  "#FF6500", // Primary orange
  "#024CAA", // Secondary blue
  "#0B192C", // Dark blue
  "#8884d8", // Purple
  "#06d6a0", // Teal
  "#ffb703", // Yellow
  "#e76f51", // Coral
  "#ef476f", // Pink
  "#118ab2", // Blue
  "#073b4c", // Dark navy
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (avatar: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onAvatarChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || PRODUCTIVITY_AVATARS[0]);
  const [customAvatar, setCustomAvatar] = useState<File | null>(null);
  const [customPreviewUrl, setCustomPreviewUrl] = useState<string | null>(null);
  const [avatarTab, setAvatarTab] = useState<string>("preset");
  const [initialLetter, setInitialLetter] = useState("N");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (3MB)
      if (file.size > 3 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 3MB",
          variant: "destructive",
        });
        return;
      }
      
      setCustomAvatar(file);
      const imageUrl = URL.createObjectURL(file);
      setCustomPreviewUrl(imageUrl);
      setSelectedAvatar(imageUrl);
      setAvatarTab("custom");
    }
  };

  const handleInitialLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setInitialLetter(e.target.value.charAt(0).toUpperCase());
    } else {
      setInitialLetter("N");
    }
    setAvatarTab("initial");
  };

  const handleSelectAvatar = () => {
    if (avatarTab === "custom" && customAvatar) {
      // For a real app, we'd upload the file to storage/server here
      // and then set the URL
      if (customPreviewUrl) {
        onAvatarChange(customPreviewUrl);
      }
    } else if (avatarTab === "initial") {
      // No actual image, we'll use the AvatarFallback
      onAvatarChange(`initial:${initialLetter}:${selectedColor}`);
    } else {
      // Preset avatar
      onAvatarChange(selectedAvatar);
    }
    
    setOpen(false);
    
    toast({
      title: "Avatar Updated",
      description: "Your avatar has been updated successfully",
    });
  };

  // Parse initial letter and color if the avatar string is in the format "initial:X:#color"
  React.useEffect(() => {
    if (currentAvatar && currentAvatar.startsWith("initial:")) {
      const parts = currentAvatar.split(":");
      if (parts.length === 3) {
        setInitialLetter(parts[1]);
        setSelectedColor(parts[2]);
        setAvatarTab("initial");
      }
    } else if (currentAvatar) {
      setSelectedAvatar(currentAvatar);
      // Determine which tab to show based on the avatar
      if (PRODUCTIVITY_AVATARS.includes(currentAvatar)) {
        setAvatarTab("preset");
      } else {
        setAvatarTab("custom");
        setCustomPreviewUrl(currentAvatar);
      }
    }
  }, [currentAvatar]);

  // Get the avatar to display
  const getDisplayAvatar = () => {
    if (currentAvatar?.startsWith("initial:")) {
      const parts = currentAvatar.split(":");
      if (parts.length === 3) {
        return (
          <Avatar className="h-20 w-20">
            <AvatarFallback style={{ backgroundColor: parts[2] }}>
              {parts[1]}
            </AvatarFallback>
          </Avatar>
        );
      }
    }
    
    return (
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentAvatar} alt="Profile" />
        <AvatarFallback>
          <User className="h-10 w-10 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        {getDisplayAvatar()}
        <Button variant="outline" onClick={() => setOpen(true)}>
          Change Avatar
        </Button>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Avatar</DialogTitle>
          </DialogHeader>
          
          <Tabs value={avatarTab} onValueChange={setAvatarTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="preset">Preset Icons</TabsTrigger>
              <TabsTrigger value="initial">Initial</TabsTrigger>
              <TabsTrigger value="custom">Upload Image</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preset" className="space-y-6 mt-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedAvatar} alt="Selected Avatar" />
                  <AvatarFallback>
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <RadioGroup
                value={selectedAvatar}
                onValueChange={setSelectedAvatar}
                className="grid grid-cols-5 gap-3"
              >
                {PRODUCTIVITY_AVATARS.map((avatar, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1">
                    <Label
                      htmlFor={`avatar-${index}`}
                      className="cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200"
                      style={{ 
                        borderColor: selectedAvatar === avatar ? 'var(--primary)' : 'transparent'
                      }}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                        <AvatarFallback>{index + 1}</AvatarFallback>
                      </Avatar>
                    </Label>
                    <RadioGroupItem
                      id={`avatar-${index}`}
                      value={avatar}
                      className="sr-only"
                    />
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>
            
            <TabsContent value="initial" className="space-y-6 mt-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback style={{ backgroundColor: selectedColor }}>
                    {initialLetter}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="initial-letter">Initial Letter</Label>
                <input
                  id="initial-letter"
                  type="text"
                  maxLength={1}
                  value={initialLetter}
                  onChange={handleInitialLetterChange}
                  className="w-full p-2 text-center font-bold text-lg border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_COLORS.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-primary' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-6 mt-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={customPreviewUrl || undefined} alt="Custom Avatar" />
                  <AvatarFallback>
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {customAvatar ? "Change Image" : "Upload Image"}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-center text-muted-foreground">
                  Supported formats: JPG, PNG, GIF (max 3MB)
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button onClick={handleSelectAvatar}>Save Avatar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvatarSelector;
