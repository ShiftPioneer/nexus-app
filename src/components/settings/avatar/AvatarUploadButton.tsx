
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadButtonProps {
  onFileUpload: (file: File) => void;
}

const AvatarUploadButton: React.FC<AvatarUploadButtonProps> = ({
  onFileUpload,
}) => {
  const { toast } = useToast();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    
    onFileUpload(file);
  };
  
  return (
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
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUploadButton;
