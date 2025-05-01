
import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Updated avatars with productivity and creativity-themed icons
const PRODUCTIVITY_AVATARS = [
  "/lovable-uploads/711b54f0-9fd8-47e2-b63e-704304865ed3.png",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Productive&backgroundColor=ffb703",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Brain&backgroundColor=8ecae6",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Focus&backgroundColor=e63946",
  "https://api.dicebear.com/7.x/icons/svg?icon=brain",
  "https://api.dicebear.com/7.x/icons/svg?icon=lightbulb",
  "https://api.dicebear.com/7.x/icons/svg?icon=fire",
  "https://api.dicebear.com/7.x/icons/svg?icon=star",
  "https://api.dicebear.com/7.x/icons/svg?icon=rocket",
  "https://api.dicebear.com/7.x/icons/svg?icon=bolt",
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (avatar: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onAvatarChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || PRODUCTIVITY_AVATARS[0]);
  const [customAvatar, setCustomAvatar] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      setSelectedAvatar(imageUrl);
    }
  };

  const handleSelectAvatar = () => {
    onAvatarChange(selectedAvatar);
    setOpen(false);
    
    toast({
      title: "Avatar Updated",
      description: "Your avatar has been updated successfully",
    });
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentAvatar} alt="Profile" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Change Avatar
        </Button>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Avatar</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedAvatar} alt="Selected Avatar" />
                <AvatarFallback>?</AvatarFallback>
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
            
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Custom Avatar
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
            
            <div className="flex justify-end">
              <Button onClick={handleSelectAvatar}>Save Avatar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvatarSelector;
